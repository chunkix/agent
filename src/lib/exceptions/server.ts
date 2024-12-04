import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerException extends HttpException {
  constructor(
    error: any,
    message?: string,
    errorCode?: string,
    statusCode?: HttpStatus,
  ) {
    if (errorCode && message && statusCode) {
      super(
        {
          message: message,
          errorCode: errorCode,
        },
        statusCode,
      );
    }

    errorCode = 'CX_MINECRAFT_UNKNOWN_ERROR';
    message = `Minecraft server error: ${error.message || 'Unknown error'}`;
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error.message && error.message.includes('server not found')) {
      message = 'Minecraft server not found or unavailable.';
      errorCode = 'CX_MINECRAFT_SERVER_NOT_FOUND';
      statusCode = HttpStatus.NOT_FOUND;
    } else if (error.message && error.message.includes('server start failed')) {
      message = 'Failed to start the Minecraft server.';
      errorCode = 'CX_MINECRAFT_SERVER_START_FAILED';
      statusCode = HttpStatus.BAD_REQUEST;
    }

    super(
      {
        message: message,
        errorCode: errorCode,
      },
      statusCode,
    );
  }
}

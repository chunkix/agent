import { HttpException, HttpStatus } from '@nestjs/common';

export class DockerException extends HttpException {
  constructor(error: any) {
    let errorCode = 'CX_DOCKER_UNKNOWN_ERROR';
    let message = `Docker error: ${error.message || 'Unknown error'}`;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error.code === 'ENOENT') {
      message = 'Docker daemon is not running or accessible.';
      errorCode = 'CX_DOCKER_DAEMON_UNAVAILABLE';
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    } else if (
      error.message &&
      error.message.toLowerCase().includes('no such image')
    ) {
      message = `Docker error: ${error.message}`;
      errorCode = 'CX_DOCKER_IMAGE_NOT_FOUND';
      statusCode = HttpStatus.NOT_FOUND;
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

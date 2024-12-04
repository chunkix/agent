import { HttpException, HttpStatus } from "@nestjs/common";

export class ThrowException extends HttpException {
  constructor(message: string, errorCode: string, statusCode: HttpStatus) {
    super(
      {
        message: message,
        errorCode: errorCode,
      },
      statusCode,
    );
  }
}

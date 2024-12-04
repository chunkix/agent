import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerNotFoundException extends HttpException {
  constructor(containerId: string) {
    super(
      `Server with container ID ${containerId} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

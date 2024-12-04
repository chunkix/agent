import { IsString } from 'class-validator';

export class DeleteServerDto {
  @IsString()
  readonly containerId: string;
}

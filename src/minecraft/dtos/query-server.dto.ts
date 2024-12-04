import { IsString } from "class-validator";

export class QueryServerDto {
  @IsString()
  readonly serverId: string;
}

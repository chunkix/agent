import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Max,
} from "class-validator";

export class CreateServerDto {
  @IsEnum(["java", "bedrock"], {
    message: 'Platform must be either "java" or "bedrock".',
  })
  platform: "java" | "bedrock";

  @IsString()
  @IsOptional()
  version?: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  maxPlayers: number;

  @IsString()
  @IsOptional()
  motd?: string;

  @IsOptional()
  allowCheats?: boolean;

  @IsOptional()
  eula?: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  ram?: number;

  @IsOptional()
  cpuLimit?: number;
}

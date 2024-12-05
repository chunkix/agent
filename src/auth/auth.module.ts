import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Core } from "@/lib/entities/core.entitiy";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Core]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: { issuer: "chunkix" },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

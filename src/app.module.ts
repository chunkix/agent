import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MinecraftModule } from "./minecraft/minecraft.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Server } from "@/lib/entities/server.entity";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "@/auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { Core } from "./lib/entities/core.entitiy";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    MinecraftModule,
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "chunkix.db",
      entities: [Core, Server],
      synchronize: true, // Set to false in production to avoid data loss
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

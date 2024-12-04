import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MinecraftModule } from "./minecraft/minecraft.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Server } from "@/lib/entities/server.entity";

@Module({
  imports: [
    MinecraftModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "chunkix.db",
      entities: [Server],
      synchronize: true, // Set to false in production to avoid data loss
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

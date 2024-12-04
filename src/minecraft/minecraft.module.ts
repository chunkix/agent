import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { DockerModule } from '@/docker/docker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '@/lib/entities/server.entity';

@Module({
  imports: [DockerModule, TypeOrmModule.forFeature([Server])],
  controllers: [MinecraftController],
  providers: [MinecraftService],
  exports: [MinecraftService],
})
export class MinecraftModule {}

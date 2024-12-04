import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';
import { DockerModule } from '@/docker/docker.module';

@Module({
  imports: [DockerModule],
  controllers: [MinecraftController],
  providers: [MinecraftService],
  exports: [MinecraftService],
})
export class MinecraftModule {}

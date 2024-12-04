import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MinecraftModule } from './minecraft/minecraft.module';

@Module({
  imports: [MinecraftModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

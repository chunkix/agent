import { Controller, Post, Body, Delete } from '@nestjs/common';
import { MinecraftService } from './minecraft.service';
import { DeleteServerDto } from './dtos/delete-server.dto';
import { ServerOptions } from '@/lib/interfaces/server';

@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Post('create')
  async createServer() {
    const options: ServerOptions = {
      name: null,
      version: null,
      maxPlayers: null,
    };
    return this.minecraftService.createServer(options);
  }

  @Delete('delete')
  async deleteServer(@Body() deleteServerDto: DeleteServerDto) {
    return this.minecraftService.deleteServer(deleteServerDto.containerId);
  }
}

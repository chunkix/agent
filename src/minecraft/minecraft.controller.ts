import { Controller, Post, Body, Delete } from '@nestjs/common';
import { MinecraftService } from './minecraft.service';
import { DeleteServerDto } from './dtos/delete-server.dto';
import { ServerOptions } from '@/lib/interfaces/server';

/**
 * Controller responsible for managing Minecraft servers.
 */
@Controller('minecraft')
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  /**
   * Endpoint to create a new Minecraft server.
   *
   * @returns An object containing the container ID and server options.
   */
  @Post('create')
  async createServer() {
    const options: ServerOptions = {
      maxPlayers: 1,
    };
    return this.minecraftService.createServer(options);
  }

  /**
   * Endpoint to delete an existing Minecraft server.
   *
   * @param deleteServerDto - Data transfer object containing the container ID of the server to be deleted.
   * @returns An object containing the deleted container ID.
   */
  @Delete('delete')
  async deleteServer(@Body() deleteServerDto: DeleteServerDto) {
    return this.minecraftService.deleteServer(deleteServerDto.containerId);
  }
}

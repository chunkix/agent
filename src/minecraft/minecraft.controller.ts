import { Controller, Post, Body, Delete, Get, Param } from "@nestjs/common";
import { MinecraftService } from "./minecraft.service";
import { CreateServerDto } from "./dtos/create-server.dto";
import { QueryServerDto } from "./dtos/query-server.dto";

/**
 * Controller responsible for managing Minecraft servers.
 */
@Controller("minecraft")
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  /**
   * Retrieve a Minecraft server by server ID.
   * @param serverId The ID of the server to retrieve.
   * @returns The server.
   * @throws ServerException if the server does not exist or is unavailable.
   */
  @Get(":id")
  async getServer(@Param("id") serverId: string) {
    return this.minecraftService.getServer(serverId);
  }

  /**
   * List all Minecraft servers.
   *
   * @returns A promise that resolves with an array of container objects
   * for all Minecraft servers.
   * @throws DockerException if the list operation fails.
   */
  @Get()
  async listServers() {
    return this.minecraftService.listServers();
  }

  /**
   * Endpoint to create a new Minecraft server.
   *
   * @returns An object containing the container ID and server options.
   */
  @Post("create")
  async createServer(@Body() createServerDto: CreateServerDto) {
    return this.minecraftService.createServer(createServerDto);
  }

  /**
   * Endpoint to delete an existing Minecraft server.
   *
   * @param deleteServerDto - Data transfer object containing the container ID of the server to be deleted.
   * @returns An object containing the deleted container ID.
   */
  @Delete("delete")
  async deleteServer(@Body() deleteServerDto: QueryServerDto) {
    return this.minecraftService.deleteServer(deleteServerDto.serverId);
  }

  /**
   * Endpoint to start an existing Minecraft server.
   *
   * @param startServerDto - Data transfer object containing the container ID of the server to be started.
   * @returns An object containing the started container ID.
   */
  @Post("start")
  async startServer(@Body() startServerDto: QueryServerDto) {
    return this.minecraftService.startServer(startServerDto.serverId);
  }

  /**
   * Endpoint to stop an existing Minecraft server.
   *
   * @param stopServerDto - Data transfer object containing the container ID of the server to be stopped.
   * @returns An object containing the stopped container ID.
   */
  @Post("stop")
  async stopServer(@Body() stopServerDto: QueryServerDto) {
    return this.minecraftService.stopServer(stopServerDto.serverId);
  }
}

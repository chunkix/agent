import { HttpStatus, Injectable } from '@nestjs/common';
import { DockerService } from '@/docker/docker.service';
import { ContainerCreateOptions } from 'dockerode';
import { Server } from '@/lib/entities/server.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerException } from '@/lib/exceptions/server';
import { v4 as uuidv4 } from 'uuid';
import { generateContainerName } from '@/lib/utils/name-generator';

/**
 * Service responsible for managing Minecraft servers.
 */
@Injectable()
export class MinecraftService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,

    private readonly dockerService: DockerService,
  ) {}

  /**
   * Retrieve a Minecraft server by server ID from the database.
   * @param serverId The ID of the server to retrieve.
   * @returns The server.
   * @throws ServerException if the server does not exist or is unavailable.
   */
  private async getServerFromDB(serverId: string) {
    const server = await this.serverRepository.findOne({
      where: { serverId },
    });

    if (!server) {
      throw new ServerException({
        message: 'Minecraft server not found or unavailable.',
        errorCode: 'CX_MINECRAFT_SERVER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return server;
  }

  /**
   * Retrieve a Minecraft server by server ID.
   * @param serverId The ID of the server to retrieve.
   * @returns The server.
   * @throws ServerException if the server does not exist or is unavailable.
   */
  async getServer(serverId: string) {
    const server = await this.getServerFromDB(serverId);
    return this.dockerService.getContainer(server.containerId);
  }

  /**
   * List all Minecraft servers.
   * @returns A promise that resolves with an array of container objects
   * for all Minecraft servers.
   * @throws DockerException if the list operation fails.
   */
  async listServers() {
    const servers = await this.serverRepository.find();
    return this.dockerService.listContainers(
      servers.map((server) => server.containerId),
    );
  }

  /**
   * Create a new Minecraft server.
   * @param options Options to be passed to the dockerode createContainer method.
   * @returns An object containing the server ID, container ID, and options for the newly created server.
   * @throws DockerException if the container could not be created or started.
   */
  async createServer() {
    const containerOptions: ContainerCreateOptions = {
      Image: 'itzg/minecraft-server',
      name: `cx_${generateContainerName()}`,
    };

    const container =
      await this.dockerService.createContainer(containerOptions);
    await this.dockerService.startContainer(container.id);

    const newServer = new Server();
    newServer.serverId = uuidv4();
    newServer.containerId = container.id;
    await this.serverRepository.save(newServer);

    return {
      serverId: newServer.serverId,
      containerId: container.id,
      containerOptions,
    };
  }

  /**
   * Deletes a Minecraft server and the associated container.
   * @param serverId The ID of the server to delete.
   * @returns An object containing the deleted server.
   * @throws ServerException if the server does not exist or is unavailable.
   */
  async deleteServer(serverId: string) {
    const server = await this.getServerFromDB(serverId);

    await this.dockerService.removeContainer(server.containerId);
    await this.serverRepository.remove(server);

    return { server };
  }

  /**
   * Starts a Minecraft server.
   * @param serverId The ID of the server to start.
   * @returns An object containing the started server.
   * @throws ServerException if the server does not exist or is unavailable.
   */
  async startServer(serverId: string) {
    const server = await this.getServerFromDB(serverId);

    await this.dockerService.startContainer(server.containerId);
    return { server };
  }

  /**
   * Stops a Minecraft server.
   * @param serverId The ID of the server to stop.
   * @returns An object containing the stopped server.
   * @throws ServerException if the server does not exist or is unavailable.
   */
  async stopServer(serverId: string) {
    const server = await this.getServerFromDB(serverId);

    await this.dockerService.stopContainer(server.containerId);
    return { server };
  }
}

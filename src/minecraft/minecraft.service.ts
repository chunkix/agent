import { HttpStatus, Injectable } from "@nestjs/common";
import { DockerService } from "@/docker/docker.service";
import { ContainerCreateOptions } from "dockerode";
import { Server } from "@/lib/entities/server.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ThrowException } from "@/lib/exceptions/throw";
import { generateContainerName } from "@/lib/utils/name-generator";
import { CreateServerDto } from "./dtos/create-server.dto";
import { parseProperties } from "@/lib/utils/parse-properties";

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
      where: { id: serverId },
    });

    if (!server) {
      throw new ThrowException(
        "Minecraft server not found or unavailable.",
        "CX_MINECRAFT_SERVER_NOT_FOUND",
        HttpStatus.NOT_FOUND,
      );
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
    // const container = await this.dockerService.getContainer(server.containerId); (TODO: get status)
    const fileContent = await this.dockerService.getFile(
      server.containerId,
      "/data/server.properties",
    );

    return { server, properties: parseProperties(fileContent) };
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
   * @param options Options for the Minecraft server.
   * @returns The created server's ID and container options.
   * @throws BadRequestException if the RAM is invalid.
   * @throws DockerException if the container could not be created.
   */
  async createServer(options: CreateServerDto) {
    const {
      platform = "java",
      version = "latest",
      maxPlayers = 10,
      motd = "Welcome to Minecraft!",
      allowCheats = false,
      eula = true,
      ram = 1024,
      cpuLimit,
    } = options;

    if (ram <= 0) {
      throw new ThrowException(
        "The specified ram is invalid.",
        "CX_MINECRAFT_SERVER_INVALID_RAM",
        HttpStatus.BAD_REQUEST,
      );
    }

    let image: string = "itzg/minecraft-server";
    const baseImage =
      platform === "java"
        ? "itzg/minecraft-server"
        : platform === "bedrock"
          ? "itzg/minecraft-bedrock-server"
          : null;

    if (!baseImage) {
      throw new ThrowException(
        "The specified platform is not supported.",
        "CX_MINECRAFT_SERVER_INVALID_PLATFORM",
        HttpStatus.BAD_REQUEST,
      );
    }

    image = version === "latest" ? baseImage : `${baseImage}:${version}`;

    const hostConfig: ContainerCreateOptions["HostConfig"] = {
      Memory: ram * 1024 * 1024,
      NanoCpus: cpuLimit ? cpuLimit * 1e9 : undefined,
      PortBindings: {
        "25565/tcp": [{ HostPort: "25565" }],
      },
    };

    if (platform === "bedrock") {
      hostConfig.PortBindings["19132/udp"] = [{ HostPort: "19132" }];
    }

    const containerOptions: ContainerCreateOptions = {
      Image: image,
      name: `cx_${generateContainerName()}`,
      Env: [
        `EULA=${eula}`,
        `MAX_PLAYERS=${maxPlayers}`,
        `MOTD=${motd}`,
        `ALLOW_CHEATS=${allowCheats}`,
      ],
      HostConfig: hostConfig,
    };

    const container =
      await this.dockerService.createContainer(containerOptions);
    await this.dockerService.startContainer(container.id);

    const newServer = new Server();
    newServer.containerId = container.id;
    await this.serverRepository.save(newServer);

    return {
      id: newServer.id,
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

    // TODO: Make it process in background
    await this.dockerService.stopContainer(server.containerId);
    return { server };
  }
}

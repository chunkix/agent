import { Injectable } from '@nestjs/common';
import { ServerOptions } from '@/lib/interfaces/server';
import { DockerService } from '@/docker/docker.service';
import { generateContainerName } from '@/lib/utils/name-generator';

@Injectable()
export class MinecraftService {
  constructor(private readonly dockerService: DockerService) {}

  async createServer(options: ServerOptions) {
    const container = await this.dockerService.createContainer(
      'itzg/minecraft-server',
      {
        name: generateContainerName(),
        Env: ['EULA=TRUE', 'MEMORY=2G'],
      },
    );
    await this.dockerService.startContainer(container.id);
    return { status: 'started', containerId: container.id, options };
  }

  async deleteServer(containerId: string) {
    await this.dockerService.removeContainer(containerId);
    return { status: 'deleted' };
  }

  async stopServer(containerId: string) {
    await this.dockerService.stopContainer(containerId);
    return { status: 'stopped' };
  }
}

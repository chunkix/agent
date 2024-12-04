import * as Docker from 'dockerode';
import { Injectable } from '@nestjs/common';
import { DockerException } from '@/lib/exceptions/docker';

@Injectable()
export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async createContainer(image: string, options: any) {
    try {
      const images = await this.docker.listImages();
      const imageExists = images.some(
        (img) => img.RepoTags && img.RepoTags.includes(image),
      );

      if (!imageExists) {
        this.docker.pull(image).catch(() => {});
      }

      return await this.docker.createContainer({
        Image: image,
        ...options,
      });
    } catch (error) {
      throw new DockerException(error);
    }
  }

  async startContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.start();
    } catch (error) {
      throw new DockerException(error);
    }
  }

  async stopContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop();
    } catch (error) {
      throw new DockerException(error);
    }
  }

  async removeContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      return await container.remove({ force: true });
    } catch (error) {
      throw new DockerException(error);
    }
  }
}

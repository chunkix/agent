import * as Docker from 'dockerode';
import { Injectable } from '@nestjs/common';
import { DockerException } from '@/lib/exceptions/docker';

/**
 * Service for docker operations
 */
@Injectable()
export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  /**
   * Retrieve a container by container ID.
   * @param containerId The container ID to retrieve.
   * @returns The container.
   * @throws DockerException if the container does not exist.
   */
  async getContainer(containerId: string) {
    try {
      return this.docker.getContainer(containerId);
    } catch (error) {
      throw new DockerException(error);
    }
  }

  /**
   * List containers with given container IDs.
   * @param containerIds The container IDs to filter by.
   * @returns A promise that resolves with an array of container objects.
   * @throws DockerException if the list operation fails.
   */
  async listContainers(containerIds: string[]) {
    try {
      return await this.docker.listContainers({
        filters: {
          id: containerIds,
        },
      });
    } catch (error) {
      throw new DockerException(error);
    }
  }

  /**
   * Create a new container based on the given options.
   * @param options Options to be passed to the dockerode createContainer method.
   * @returns The created container.
   * @throws DockerException if the container could not be created.
   */
  async createContainer(options: Docker.ContainerCreateOptions) {
    try {
      const images = await this.docker.listImages();
      const imageExists = images.some(
        (img) => img.RepoTags && img.RepoTags.includes(options.Image),
      );

      if (!imageExists) {
        this.docker.pull(options.Image).catch(() => {});
      }

      return await this.docker.createContainer(options);
    } catch (error) {
      throw new DockerException(error);
    }
  }

  /**
   * Removes a container.
   *
   * @param containerId - The ID of the container to remove.
   * @returns A promise that resolves when the container is removed.
   * @throws DockerException if the container could not be removed.
   */
  async removeContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      return await container.remove({ force: true });
    } catch (error) {
      throw new DockerException(error);
    }
  }

  /**
   * Starts a container.
   * @param containerId The ID of the container to start.
   * @throws DockerException if the container could not be started.
   */
  async startContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.start();
    } catch (error) {
      throw new DockerException(error);
    }
  }

  /**
   * Stops a container.
   * @param containerId The ID of the container to stop.
   * @throws DockerException if the container could not be stopped.
   */
  async stopContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop();
    } catch (error) {
      throw new DockerException(error);
    }
  }
}

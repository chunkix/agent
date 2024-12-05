import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Core } from "@/lib/entities/core.entitiy";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Core)
    private readonly coreRepository: Repository<Core>,
    private readonly jwtService: JwtService,
  ) {}

  async addCore(name: string): Promise<{ token: string }> {
    const payload = { name };
    const token = this.jwtService.sign(payload);

    const hashedToken = await bcrypt.hash(token, 10);

    const core = this.coreRepository.create({ name, token: hashedToken });
    await this.coreRepository.save(core);

    return { token };
  }

  async validateToken(token: string): Promise<Core | null> {
    const cores = await this.coreRepository.find({ where: { isActive: true } });

    for (const core of cores) {
      try {
        this.jwtService.verify(token);

        const isValid = await bcrypt.compare(token, core.token);
        if (isValid) {
          return core;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}

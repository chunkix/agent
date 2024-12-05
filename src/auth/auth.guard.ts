import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly coreService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const core = await this.coreService.validateToken(token);

    if (!core) {
      throw new UnauthorizedException("Invalid or inactive token");
    }

    request.core = core;
    return true;
  }
}

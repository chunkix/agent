import { Command } from "commander";
import { AuthService } from "@/auth/auth.service";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
const program = new Command();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  program
    .command("add <coreName>")
    .description("Add a new core and generate a token")
    .action(async (coreName: string) => {
      try {
        const result = await authService.addCore(coreName);
        console.log(`Core added with token: ${result.token}`);
      } catch (error) {
        console.error(`Error adding core: ${error.message}`);
      }
    });

  await program.parseAsync(process.argv);
}

bootstrap().catch(console.error);

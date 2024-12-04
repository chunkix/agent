export interface CreateServerOptions {
  platform: "java" | "bedrock";
  version?: string;
  maxPlayers: number;
  motd?: string;
  allowCheats?: boolean;
  eula?: boolean;
  ram?: number;
  cpuLimit?: number; // CPU limit in units (e.g., 0.5 for 50% of 1 CPU)
}

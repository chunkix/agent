export function parseProperties(properties: string): object {
  const lines = properties.split("\n");
  const parsed = {};

  lines.forEach((line) => {
    if (line.trim() && !line.startsWith("#")) {
      const [key, value] = line.split("=").map((str) => str.trim());
      if (key && value) {
        if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
          parsed[key] = value.toLowerCase() === "true";
        } else if (!isNaN(Number(value))) {
          parsed[key] = Number(value);
        } else {
          parsed[key] = value;
        }
      }
    }
  });

  return parsed;
}

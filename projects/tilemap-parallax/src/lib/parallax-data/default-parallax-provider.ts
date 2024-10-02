import { ParallaxData } from "./parallax-data";
import { ParallaxProvider } from "./parallax-provider";
import { TilesetConfig } from "./tileset-config";

export class DefaultParallaxProvider implements ParallaxProvider {
  constructor(
    private readonly folderPath: string
  ) {}

  getSrc(relPath: string): string {
    return `${this.folderPath}/${relPath}`;
  }

  async getTileset(relPath: string): Promise<TilesetConfig> {
    return (await fetch(`${this.folderPath}/${relPath}`)).json();
  }

  async getParallaxData(relPath: string): Promise<ParallaxData> {
    return (await fetch(`${this.folderPath}/${relPath}`)).json();
  }
}

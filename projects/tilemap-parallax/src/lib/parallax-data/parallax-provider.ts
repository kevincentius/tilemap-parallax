import { ParallaxData } from "./parallax-data";
import { TilesetConfig } from "./tileset-config";

export interface ParallaxProvider {
  getSrc(relPath: string): string;
  getTileset(relPath: string): Promise<TilesetConfig>;
  getParallaxData(id: string): Promise<ParallaxData>;
}

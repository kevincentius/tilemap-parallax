import { TilesetConfig } from "./tileset-config";

export interface ImgSrcProvider {
  getSrc(relPath: string): string;
}

export interface TilesetProvider {
  getTileset(relPath: string): TilesetConfig;
}

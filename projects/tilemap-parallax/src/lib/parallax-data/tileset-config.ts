import { TileConfig } from "./tile-config";

export interface Pos { i: number; j: number; }

export interface TilesetConfig {
  spritesheet: {
    path: string;
    tileWidth: number;
    tileHeight: number;
    scale: number;
    tiles: TileConfig[][];
  };
}

export enum TilePosType {
  TOP_LEFT = 0,
  TOP = 1,
  TOP_RIGHT = 2,
  BELOW_TOP_LEFT = 3,
  INSIDE = 4,
  BELOW_TOP_RIGHT = 5,
}

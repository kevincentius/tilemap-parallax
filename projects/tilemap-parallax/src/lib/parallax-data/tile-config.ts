import { TilePosType } from "./tileset-config";

export interface TileConfig {
  posTypes: TilePosType[];
  weight?: number; // default: 100
}

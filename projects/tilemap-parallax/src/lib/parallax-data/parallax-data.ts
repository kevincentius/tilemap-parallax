import { ParallaxLayerGenConfig } from "./parallax-layer-gen";

export interface ParallaxLayerData {
  image?: string;                 // for layer with static image
  gen?: ParallaxLayerGenConfig;   // for layer with generated tilemap

  static?: boolean;               // if true, stretch image proportionally to fill the screen
  mult: number;
  disabled?: boolean;
  height: number;                // percentage of the screen height
  bottom?: number;               // percentage of the screen height
  filter?: string;               // additional style for the layer
}

export interface ParallaxData {
  id: string;
  layers: ParallaxLayerData[];
}

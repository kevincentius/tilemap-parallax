
export interface ParallaxAnimatorConfig {
  slowAdvanceSpeed: number;
  fastAdvanceSpeed: number;
  advanceSpeedAccelTime: number;
}

export const defaultParallaxAnimatorConfig: ParallaxAnimatorConfig = {
  slowAdvanceSpeed: 6,
  fastAdvanceSpeed: 300,
  advanceSpeedAccelTime: 0.5,
};

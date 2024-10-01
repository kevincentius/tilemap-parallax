
export interface GroundConfig {
  amp: number;
  wl: number; // wavelength
  width: number;
  base: number;
}
export const defaultGroundConfig =  {
  amp: 5,
  wl: 5, // wavelength
  width: 100,
  base: 0,
};

const M = 4294967296;
const A = 1664525; // a - 1 should be divisible by m's prime factors
const C = 1; // c and m should be co-prime
var z = Math.floor(Math.random() * M);

function rand(){
  z = (A * z + C) % M;
  return z / M - 0.5;
};

function interpolate(pa: number, pb: number, px: number){
  const ft = px * Math.PI;
  const f = (1 - Math.cos(ft)) * 0.5;
  return pa * (1 - f) + pb * f;
}

export function generatePerlin(cfg: GroundConfig) {
  const { amp, wl, width } = cfg;

  const baseLine = amp / 2;

  let x = 0;
  let y = baseLine;
  let a = 0;
  let b = 0;

  let vals = [];

  while(x < width){
    if(x % wl === 0){
      a = b;
      b = (x + wl >= width) ? 0 : rand();
      y = amp / 2 + a * amp;
    } else {
      y = amp / 2 + interpolate(a, b, (x % wl) / wl) * amp;
    }
    vals.push(y);
    x += 1;
  }

  return vals.map(val => Math.round(val + cfg.base));
}

export function generateGround(cfg: GroundConfig = defaultGroundConfig) {
  const perlin = generatePerlin(cfg);
  const ground: number[] = new Array(perlin.length).fill(0);

  ground[0] = perlin[0];
  let curPeakLength = 1;
  for (let i = 1; i < perlin.length; i++) {
    if (perlin[i] === ground[i - 1]) {
      // flat
      ground[i] = ground[i - 1];
      curPeakLength++;
    } else if (perlin[i] > ground[i - 1]) {
      // going up
      ground[i] = ground[i - 1] + 1;
      curPeakLength = 1;
    } else {
      // going down
      if (curPeakLength < 3) {
        // minimum flat length is 3, so don't go down
        ground[i] = ground[i - 1];
        curPeakLength++;
      } else {
        // go down
        ground[i] = ground[i - 1] - 1;
        curPeakLength++;
      }
    }
  }
  return ground;
}

import { GroundConfig, generateGround } from "./ground-gen";
import { TilePosType, TilesetConfig } from "./tileset-config";

function generateTilePosTypeMap(groundCfg: GroundConfig): (TilePosType | null)[][] {
  const ground = generateGround(groundCfg);
  const map: (TilePosType | null)[][] = new Array(Math.max(2, groundCfg.amp + groundCfg.base + 2)).fill(0)
    .map((_, i) => new Array(ground.length).fill(0)
      .map((_, j) => {
        const groundLevel = ground[j];
        const groundLevelLeft = ground[(j - 1 + ground.length) % ground.length];
        const groundLevelRight = ground[(j + 1) % ground.length];
        const leftIsLower = groundLevelLeft < groundLevel;
        const rightIsLower = groundLevelRight < groundLevel;
        if (i > groundLevel) {
          // sky
          return null;
        } else if (i == groundLevel) {
          // top tile
          return leftIsLower ? TilePosType.TOP_LEFT
            : rightIsLower ? TilePosType.TOP_RIGHT
            : TilePosType.TOP;
        } else if (i == groundLevel - 1) {
          // below top tile
          return leftIsLower ? TilePosType.BELOW_TOP_LEFT
            : rightIsLower ? TilePosType.BELOW_TOP_RIGHT
            : TilePosType.INSIDE;
        } else {
          return TilePosType.INSIDE;
        }
      }));
  
  // flip vertically
  map.reverse();

  // put decor tiles
  for (let j = 0; j < ground.length; j++) {
    for (let i = 1; i < map.length; i++) {
      if (map[i][j] === TilePosType.TOP) {
        map[i - 1][j] = TilePosType.DECOR;
      }
    }
  }

  return map;
}

export function generateTilemap(tilesetCfg: TilesetConfig, groundCfg: GroundConfig) {
  const tilePickerMap = new Map<TilePosType, {
    tiles: { i: number, j: number, weight: number }[],
    weightSum: number,
  }>();
  tilesetCfg.spritesheet.tiles.forEach((row, i) => {
    row.forEach((tile, j) => {
      const tileEntry = { i, j, weight: tile.weight ?? 100 };
      tile.posTypes.forEach(posType => {
        if (tilePickerMap.has(posType)) {
          const entry = tilePickerMap.get(posType)!;
          entry.weightSum += tileEntry.weight;
          entry.tiles.push(tileEntry);
        } else {
          tilePickerMap.set(posType, {
            tiles: [ tileEntry ],
            weightSum: tileEntry.weight,
          });
        }
      });
    });
  });

  const typeMap = generateTilePosTypeMap(groundCfg);
  return typeMap.map((row, i) => row.map((type, j) => {
    if (type === null) return null;
    if (type === TilePosType.DECOR && Math.random() > tilesetCfg.spritesheet.decorDensity) return null;
    
    const entry = tilePickerMap.get(type);
    if (type === TilePosType.DECOR && ((entry?.tiles?.length ?? 0) == 0)) { return null; }
    if (!entry) {
      return { i: 0, j: 0 };
    }

    let p = Math.random() * entry.weightSum;
    for (let tile of entry.tiles) {
      p -= tile.weight;
      if (p <= 0) return { i: tile.i, j: tile.j };
    }

    console.error("Should not reach here");
    return { i: 0, j: 0 };
  }));
}

export async function drawTilemap(tilesetCfg: TilesetConfig, groundCfg: GroundConfig, canvas: HTMLCanvasElement, imgSrc: string) {
  const tilemap = generateTilemap(tilesetCfg, groundCfg);
  const tw = tilesetCfg.spritesheet.tileWidth;
  const th = tilesetCfg.spritesheet.tileHeight;
  canvas.width = tilemap[0].length * tw;
  canvas.height = tilemap.length * th;
  
  const img = await loadImage(imgSrc);
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tilemap.forEach((row, i) => row.forEach((pos, j) => {
    if (pos === null) return;
    ctx.drawImage(
      img!,
      pos.j * tw, pos.i * th, tw, th,
      j * tw, i * th, tw, th,
    );
  }));
}
async function loadImage(imgSrc: string) {
  const img = new Image();
  img.src = imgSrc;
  await new Promise<void>(resolve => {
    img.onload = () => resolve();
  });
  return img;
}


import { GroundConfig, generateGround } from "./ground-gen";
import { TilePosType, TilesetConfig } from "./tileset-config";

function generateTilePosTypeMap(groundCfg: GroundConfig): (TilePosType | null)[][] {
  const ground = generateGround(groundCfg);
  const map = new Array(Math.max(1, groundCfg.amp + groundCfg.base + 1)).fill(0)
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
  return map;
}

export function generateTilemap(tilesetCfg: TilesetConfig, groundCfg: GroundConfig) {
  const tilePickerMap = new Map<TilePosType, { i: number, j: number }[]>();
  tilesetCfg.spritesheet.tiles.forEach((row, i) => {
    row.forEach((tile, j) => {
      tile.posTypes.forEach(posType => {
        const pos = { i, j };
        if (tilePickerMap.has(posType)) {
          tilePickerMap.get(posType)!.push(pos);
        } else {
          tilePickerMap.set(posType, [pos]);
        }
      });
    });
  });

  const typeMap = generateTilePosTypeMap(groundCfg);
  return typeMap.map((row, i) => row.map((type, j) => {
    if (type === null) return null;
    const tilePoses = tilePickerMap.get(type) ?? [{ i: 0, j: 0 }];
    return tilePoses[Math.floor(Math.random() * tilePoses.length)];
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


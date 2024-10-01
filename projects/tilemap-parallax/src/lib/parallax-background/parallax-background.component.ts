import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ParallaxData, ParallaxLayerData } from '../parallax-data/parallax-data';
import { CommonModule } from '@angular/common';
import { ImgSrcProvider, TilesetProvider } from '../parallax-data/resource-provider';
import { ParallaxLayerGenConfig } from '../parallax-data/parallax-layer-gen';
import { drawTilemap } from '../parallax-data/tilemap-gen';

export interface ParallaxLayer {
  data: ParallaxLayerData;
  offset: number;
  genDataUrl?: string;
  style?: string;
}

@Component({
  selector: 'app-parallax-background',
  standalone: true,
  imports: [ CommonModule, ],
  templateUrl: './parallax-background.component.html',
  styleUrls: ['./parallax-background.component.scss']
})
export class ParallaxBackgroundComponent {

  @Input() tilesetProvider!: TilesetProvider;
  @Input() imgSrcProvider!: ImgSrcProvider;

  layers: ParallaxLayer[] = [];

  @ViewChild('parallaxContainer', { static: true }) container!: ElementRef<HTMLDivElement>;
  width = 100;

  @ViewChild('debugCanvas', { static: true }) debugCanvas!: ElementRef<HTMLCanvasElement>;

  layerStyle?: object;

  async setParallax(parallaxData: ParallaxData) {
    this.layers = await Promise.all(parallaxData.layers.map(async l => ({
      data: l,
      offset: 0,
      genDataUrl: l.gen ? await this.generateLayerImage(l.gen) : undefined,
      style: l.filter ?? '',
    })));
  }

  async generateLayerImage(gen: ParallaxLayerGenConfig): Promise<string> {
    const canvas = document.createElement('canvas');
    const tileset = this.tilesetProvider.getTileset(gen.tileset);
    const imgSrc = this.imgSrcProvider.getSrc(tileset.spritesheet.path);
    await drawTilemap(tileset, gen.groundGen, canvas, imgSrc);
    return canvas.toDataURL();
  }

  advance(pixels: number) {
    this.layers.forEach(l => l.offset += l.data.mult * pixels);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = this.container.nativeElement.clientWidth;
  }
  
  constructor() { }
}

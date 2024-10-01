import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ParallaxBackgroundComponent } from '../parallax-background/parallax-background.component';
import { CommonModule } from '@angular/common';
import { ParallaxData } from '../parallax-data/parallax-data';
import { ImgSrcProvider, TilesetProvider } from '../parallax-data/resource-provider';

@Component({
  selector: 'app-parallax-animator',
  standalone: true,
  imports: [
    CommonModule,

    ParallaxBackgroundComponent,
  ],
  templateUrl: './parallax-animator.component.html',
  styleUrls: ['./parallax-animator.component.scss']
})
export class ParallaxAnimatorComponent implements OnInit {

  timeout: any;
  lastMs = Date.now();

  @Input() imgSrcProvider!: ImgSrcProvider;
  @Input() tilesetProvider!: TilesetProvider;

  @ViewChild('parallax', { static: true }) parallax!: ParallaxBackgroundComponent;

  slowAdvanceSpeed = 6;
  fastAdvanceSpeed = 300;
  advanceSpeed = this.slowAdvanceSpeed;
  advanceSpeedAccelTime = 0.5;
  fastAdvanceMsLeft = 0;

  ngOnInit(): void {
    this.loop();
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

  setParallax(parallax: ParallaxData) {
    this.parallax.setParallax(parallax);
  }

  advanceFastForSecs(secs: number) {
    this.fastAdvanceMsLeft = secs * 1000;
  }

  loop() {
    const dt = Date.now() - this.lastMs;
    const accel = dt / 1000 / this.advanceSpeedAccelTime * (this.fastAdvanceSpeed - this.slowAdvanceSpeed);
    if (this.fastAdvanceMsLeft > 0) {
      this.advanceSpeed = Math.min(this.fastAdvanceSpeed, this.advanceSpeed + accel);
      this.fastAdvanceMsLeft -= dt;
    } else {
      this.advanceSpeed = Math.max(this.slowAdvanceSpeed, this.advanceSpeed - accel);
    }

    this.parallax.advance(dt / 1000 * this.advanceSpeed);
    this.lastMs += dt;
    this.timeout = setTimeout(() => this.loop(), 1000 / 60);
  }
}

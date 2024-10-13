import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ParallaxBackgroundComponent } from '../parallax-background/parallax-background.component';
import { CommonModule } from '@angular/common';
import { ParallaxData } from '../parallax-data/parallax-data';
import { ParallaxProvider } from '../parallax-data/parallax-provider';
import { DefaultParallaxProvider } from '../parallax-data/default-parallax-provider';
import { defaultParallaxAnimatorConfig } from '../parallax-data/parallax-animator-config';

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
export class ParallaxAnimatorComponent implements OnInit, OnChanges {

  timeout: any;
  lastMs = Date.now();

  @Input() parallaxProvider!: ParallaxProvider;
  @Input() parallaxFolder?: string;
  @Input() parallaxRelPath?: string;
  @Input() config = defaultParallaxAnimatorConfig;
  @Input() animate = true;

  @ViewChild('parallax', { static: true }) parallax!: ParallaxBackgroundComponent;

  advanceSpeed = 6;
  fastAdvanceMsLeft = 0;

  ngOnInit(): void {
    this.ngOnChanges();
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

  ngOnChanges(changesAny?: any) {
    // changes is not really ParallaxAnimatorComponent, but only the @Input()s. But this provides a little type safety anyways.
    const changes = changesAny as ParallaxAnimatorComponent;

    this.advanceSpeed = this.config.slowAdvanceSpeed;

    if (changes?.parallaxProvider || changes?.parallaxFolder) {
      if (this.parallaxFolder) {
        this.parallaxProvider = new DefaultParallaxProvider(this.parallaxFolder);
        this.parallax.setParallaxProvider(this.parallaxProvider);
      } else if (this.parallaxProvider) {
        this.parallax.setParallaxProvider(this.parallaxProvider);
      }
    }

    if (changes?.parallaxProvider || changes?.parallaxFolder || changes?.parallaxRelPath) {
      this.parallax.setParallax(this.parallaxRelPath);
    }

    if (changes == undefined || changes.animate) {
      clearTimeout(this.timeout);
      if (this.animate) {
        this.lastMs = Date.now();
        this.loop();
      }
    }
  }

  setParallaxData(parallax: ParallaxData) {
    this.parallax.setParallaxData(parallax);
  }

  advanceForSeconds(secs: number) {
    this.fastAdvanceMsLeft = secs * 1000;
  }

  advance(amount: number) {
    this.parallax.advance(amount);
  }

  private loop() {
    const dt = Date.now() - this.lastMs;
    const accel = dt / 1000 / this.config.advanceSpeedAccelTime * (this.config.fastAdvanceSpeed - this.config.slowAdvanceSpeed);
    if (this.fastAdvanceMsLeft > 0) {
      this.advanceSpeed = Math.min(this.config.fastAdvanceSpeed, this.advanceSpeed + accel);
      this.fastAdvanceMsLeft -= dt;
    } else {
      this.advanceSpeed = Math.max(this.config.slowAdvanceSpeed, this.advanceSpeed - accel);
    }

    this.parallax.advance(dt / 1000 * this.advanceSpeed);
    this.lastMs += dt;
    this.timeout = setTimeout(() => this.loop(), 1000 / 60);
  }
}

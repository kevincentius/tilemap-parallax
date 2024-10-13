# Tilemap Parallax

This library provides a component that can animate a parallax background created by the visual tool.

## Usage

Extract the exported ZIP file obtained from the [parallax editor tool](https://github.com/kevincentius/tile-parallax) somewhere in your `/assets` folder and use the ParallaxAnimatorComponent, for example:

```
<div class="fixed-background">
  <app-parallax-animator
    #parallaxAnimator
    [parallaxFolder]="'assets/my-folder'"
    [parallaxRelPath]="'parallax/jungle.json'"
    [config]="config"
    [animate]="animate"
  ></app-parallax-animator>
</div>
```

```
// CSS to make the element full size (if desired):
.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
```
### Inputs

- `resourceFolder` - required, URL to the extracted folder.
- `parallax` - optional, relative path to the parallax JSON file found in the extracted folder. If not present, no parallax will be displayed.
- `config` - optional, configure the speed and acceleration of the parallax motion. If not present, a default config will be used.
- `animate` - optional, if false, then the parallax will not move automatically. The movement can be controlled via methods (advance and advanceForSeconds). Defaults to true.


### Methods

You can use @ViewChild to get a reference to the ParallaxAnimatorComponent and call the methods to control the parallax yourself:

- `setParallaxData` - switch to the given parallax. Normally, you should use the Angular Inputs `resourceFolder` and `parallax` instead of passing a ParallaxData yourself to this method.
- `advance`

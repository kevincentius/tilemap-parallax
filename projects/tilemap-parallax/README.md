# Usage In Angular

Extract the exported ZIP file obtained from the parallax editor tool somewhere in your `/assets` folder and use the ParallaxAnimatorComponent, for example:

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

## Inputs

- `resourceFolder` - required, URL to the extracted folder.
- `parallax` - optional, relative path to the parallax JSON file found in the extracted folder. If not present, no parallax will be displayed.
- `config` - optional, configure the speed and acceleration of the parallax motion. If not present, a default config will be used.
- `animate` - optional, if false, then the parallax will not move automatically. The movement can be controlled via methods (advance and advanceForSeconds). Defaults to true.


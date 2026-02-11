import type { AssetsImagesListLoad } from "../types/Assets";
import type { Camera } from "./Camera";
import type { HeroStore } from "./HeroStore";
import { StaticBackground } from "./StaticBackground";
import type { World } from "./World";

export class Game {
  private staticBackground: StaticBackground | null;
  // private count: number = 0;

  constructor(
    private world: World,
    private heroStore: HeroStore,
    public images: AssetsImagesListLoad,
    private camera: Camera,
  ) {
    this.staticBackground = this.world.backgroundWorld ? new StaticBackground(
      this.world.backgroundWorld,
      this.images,
    ) : null;
  }

  public update() {
    const myHeroState = this.heroStore.getMyHeroState();

    this.camera.update(myHeroState ? myHeroState.positionX : 0);

    if (this.world.gameWorld) {
      this.world.gameWorld.clearRect(
        this.camera.cameraRenderStart,
        0,
        this.camera.cameraRenderEnd,
        this.world.height,
      );
    }

    if (this.staticBackground && !this.staticBackground.isDraw) {
      this.staticBackground.initDrawBackground(1024, this.world.height);
      this.staticBackground.isDraw = true;
    }

    this.heroStore.update();
  }
}

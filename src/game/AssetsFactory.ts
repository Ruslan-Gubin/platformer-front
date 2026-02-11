import type { AssetsImagesList } from "../types/Assets";

export class AssetsFactory {
  private images: AssetsImagesList = {
    backgroundSet: null,
    sky: null,
    fog: null,
    fogBlack: null,
    hero: null,
  };


  public initImages() {
    return Promise.all([
      this.loadImage(
        "backgroundSet",
        "../../public/assets/tiled/assets/tileset.png",
      ),
      this.loadImage(
        "sky",
        "../../public/assets/tiled/assets/background_0.png",
      ),
      this.loadImage(
        "fog",
        "../../public/assets/tiled/assets/background_1.png",
      ),
      this.loadImage(
        "fogBlack",
        "../../public/assets/tiled/assets/background_2.png",
      ),
      this.loadImage(
        "hero",
        "../../public/assets/hero/knight/Quixote_Default_Weapons.png",
      ),
    ]);
  }

  private loadImage(key: keyof AssetsImagesList, src: string) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;

      image.onload = () => {
        this.images[key] = image;
        resolve("success");
      };
      image.onerror = (e) => (console.error("Error load image", e), reject(e));
    });
  }

  get img() {
    return this.images;
  }
}

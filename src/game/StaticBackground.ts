import { CanvasDraw } from "../shared/canvas/CanvasDraw";
import type { AssetsImagesListLoad } from "../types/Assets";

export class StaticBackground {
  private drawService: CanvasDraw;
  private isDrawBackground: boolean = false;

  constructor(
    private context: CanvasRenderingContext2D,
    private images: AssetsImagesListLoad,
  ) {
    this.drawService = new CanvasDraw(this.context);
  }

  get isDraw() {
    return this.isDrawBackground;
  }

  set isDraw(value: boolean) {
    this.isDrawBackground = value;
  }

  public initDrawBackground(width: number, height: number) {
    for (let i = 0; i < 5; i++) {
      this.drawBackgroundStatic(this.images.sky, width * i, width, height);
      this.drawBackgroundStatic(this.images.fog, width * i, width, height);
      this.drawBackgroundStatic(this.images.fogBlack, width * i, width, height);
    }

    this.drawRoad(0, 655);
    this.drawRoad(-90, 640);
    this.drawRoad(270, 655);
    this.drawRoad(180, 640);

    for (let i = 0.5; i < 110; i++) {
      this.drawSmallThree(150 * i, 555);
    }

    for (let i = 0.5; i < 110; i++) {
      this.drawBigThree(470 * i, 480);
      this.drawBigThree(270 * i, 480);
    }

    for (let i = 0.5; i < 20; i++) {
      this.drawRoad(270 * i, 635);
    }

    for (let i = 0; i < 20; i++) {
      this.drawRoad(270 * i, 655);
    }

    for (let i = 0; i < 100; i++) {
      this.drawBush(70 * i, 620);
    }

    for (let i = 0; i < 10; i++) {
      this.drawStone(500 * i, 620);
    }

    for (let i = 0; i < 10; i++) {
      this.drawBigBush(229 * i, 617);
    }

    this.drawStone(50, 615);
    this.drawBush(449, 620);
    this.drawBush(399, 620);
    this.drawBush(339, 620);
    this.drawBush(149, 620);
    this.drawBush(149, 620);
    this.drawSmallStone(119, 638);
    this.drawSmallStone(221, 645);
    this.drawBigBush(229, 617);

    this.drawSmallThree(475, 555);
    this.drawSmallThree(565, 555);
    this.drawSmallThree(765, 555);
    this.drawSmallThree(695, 555);
    this.drawSmallThree(655, 555);
    this.drawBigThree(470, 480);
    this.drawBigThree(560, 485);
    this.drawBigThree(680, 475);
    this.drawBigThree(780, 475);
    this.drawStone(680, 625);

    for (let i = 0; i < 20; i++) {
      const currentPoint = i * 100;
      this.drawService.text({
        text: `${currentPoint}`,
        color: "white",
        x: currentPoint,
        y: 675,
      });
    }
  }

  private drawBackgroundStatic(
    img: HTMLImageElement,
    positionX: number,
    width: number,
    height: number,
  ) {
    this.drawService.image({
      image: img,
      imageOptions: {
        x: positionX,
        y: 0,
        height: height,
        width: width,
      },
    });
  }

  private drawBigThree(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      179,
      11,
      101,
      125,
      x,
      y,
      150,
      178,
    );
  }

  private drawSmallThree(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      6,
      81,
      50,
      62,
      x,
      y,
      78,
      100,
    );
  }

  private drawBush(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      116,
      92,
      37,
      20,
      x,
      y,
      68,
      38,
    );
  }

  private drawBigBush(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      67,
      125,
      74,
      19,
      x,
      y,
      110,
      40,
    );
  }

  private drawStone(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      48,
      59,
      32,
      21,
      x,
      y,
      50,
      35,
    );
  }

  private drawSmallStone(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      64,
      86,
      16,
      10,
      x,
      y,
      20,
      15,
    );
  }

  private drawRoad(x: number, y: number) {
    this.drawService.drawImageDirection(
      this.images.backgroundSet,
      0,
      144,
      180,
      16,
      x,
      y,
      270,
      30,
    );
  }
}

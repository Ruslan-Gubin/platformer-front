export class Sprite {
  public image: HTMLImageElement;

  constructor(
    private context: CanvasRenderingContext2D,
    private position: { x: number; y: number },
     src: string,
  ) {
    this.image = new Image();
    this.image.src = src;
  }

  public draw() {
    if (!this.image) return;
    this.context.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}


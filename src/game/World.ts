export class World {
  private widthWorld: number = 0;
  private heightWorld: number = 0;
  private mainCanvas: HTMLCanvasElement;
  private canvasGame: HTMLCanvasElement;
  private canvasBackground: HTMLCanvasElement;
  private canvasForeground: HTMLCanvasElement;
  private mainContext: CanvasRenderingContext2D | null = null;
  private backgroundContext: CanvasRenderingContext2D | null = null;
  private gameContext: CanvasRenderingContext2D | null = null;
  private foregroundContext: CanvasRenderingContext2D | null = null;

  constructor(
    private root: HTMLElement,
    width: number,
    height: number,
  ) {
    this.mainCanvas = document.createElement("canvas");
    this.canvasGame = document.createElement("canvas");
    this.canvasBackground = document.createElement("canvas");
    this.canvasForeground = document.createElement("canvas");

    this.widthWorld = width;
    this.heightWorld = height;

    this.mainCanvas.width = this.widthWorld;
    this.mainCanvas.height = this.heightWorld;
    this.canvasGame.width = this.widthWorld;
    this.canvasGame.height = this.heightWorld;
    this.canvasBackground.width = this.widthWorld;
    this.canvasBackground.height = this.heightWorld;
    this.canvasForeground.width = this.widthWorld;
    this.canvasForeground.height = this.heightWorld;

    this.root.appendChild(this.mainCanvas);
    this.root.appendChild(this.canvasBackground);
    this.root.appendChild(this.canvasGame);
    this.root.appendChild(this.canvasForeground);

    this.mainContext = this.mainCanvas.getContext("2d");
    this.gameContext = this.canvasGame.getContext("2d");
    this.backgroundContext = this.canvasBackground.getContext("2d");
    this.foregroundContext = this.canvasForeground.getContext("2d");
  }

  get backgroundWorld() {
    return this.backgroundContext;
  }

  get worldContext() {
    return this.mainContext;
  }

  get worldMainCanvas() {
    return this.mainCanvas;
  }

  get worldCanvasBackground() {
    return this.canvasBackground;
  }

  get gameWorld() {
    return this.gameContext;
  }

  get foregroundWorld() {
    return this.foregroundContext;
  }

  get width() {
    return this.canvasGame.width;
  }

  get height() {
    return this.canvasGame.height;
  }
}

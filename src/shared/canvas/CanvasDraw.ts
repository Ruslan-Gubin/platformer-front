import { DrawService } from "./DrawService";
import type * as types from "./types";

export class CanvasDraw {
  private readonly drawService: DrawService;

  constructor(private context: CanvasRenderingContext2D) {
    this.drawService = new DrawService(context);
  }

  /** прямая линия, если указать больше значений в lines будет продолжение */
  public straightLine(options: types.IStraightLineOptions) {
    this.context.beginPath();
    this.context.moveTo(options.startLine.x, options.startLine.y);

    for (let i = 1; i < options.lines.length; i++) {
      if (i % 2 === 0) continue;
      this.context.lineTo(options.lines[i - 1], options.lines[i]);
    }

    this.context.lineCap = options.cap ? options.cap : "butt";
    this.drawService.checkBorder(options.border);
  }

  /** прямоугольник */
  public rect(options: types.IRectOptions) {
    if (!options.fill && !options.border) return;

    this.context.beginPath();
    this.context.rect(
      options.start.x,
      options.start.y,
      options.size.width,
      options.size.height,
    );

    this.drawService.checkFill(options.fill);
    this.drawService.checkBorder(options.border);
  }

  /** арка/круг size.start = -Math.PI / 4, size.start = Math.PI / 4, */
  public arc(options: types.IArkOptions) {
    this.context.beginPath();
    this.context.arc(
      options.size.x,
      options.size.y,
      options.size.radius,
      options.size.start
        ? this.drawService.degreesToRadians(options.size.start)
        : 0,
      options.size.end
        ? this.drawService.degreesToRadians(options.size.end)
        : Math.PI * 2,
    );

    this.drawService.checkFill(options.fill);
    this.drawService.checkBorder(options.border);
  }

  /** Кривые Безье */
  public bezierCurve(options: types.IBezierCurveOptions) {
    const { fill, points, border } = options;
    this.context.beginPath();
    this.context.moveTo(points[0], points[1]);
    const coordinate = points.slice(2, points.length - 1);

    if (coordinate.length < 5) {
      this.context.quadraticCurveTo(
        coordinate[0],
        coordinate[1],
        coordinate[2],
        coordinate[3],
      );
    } else {
      this.context.bezierCurveTo(
        coordinate[0],
        coordinate[1],
        coordinate[2],
        coordinate[3],
        coordinate[4],
        coordinate[5],
      );
    }

    this.drawService.checkFill(fill);
    this.drawService.checkBorder(border);
  }

  /** Произвольные формы */
  public arbitraryForms(options: types.IArbitraryFormsOptions) {
    this.context.beginPath();
    this.context.moveTo(options.startLine.x, options.startLine.y);

    for (let i = 1; i < options.lines.length; i++) {
      if (i % 2 === 0) continue;
      this.context.lineTo(options.lines[i - 1], options.lines[i]);
    }

    this.context.closePath();

    this.drawService.checkFill(options.fill);
    this.drawService.checkBorder(options.border);
  }

  /** Текст */
  public text(options: types.ITextOptions) {
    this.context.font = `${options.fontSize ? options.fontSize : "1.2rem"
      } sans-serif`;
    this.context.textAlign = options.textAlign ? options.textAlign : "left";
    this.context.textBaseline = options.baseline
      ? options.baseline
      : "alphabetic";
    this.context.fillStyle = options.color ? options.color : "black";
    this.context.fillText(options.text, options.x, options.y, options.maxWidth);
  }

  /** Изображение */
  public image(options: types.IImageOptions) {
    this.context.drawImage(
      options.image,
      options.sourceOptions ? options.sourceOptions.x : 0,
      options.sourceOptions ? options.sourceOptions.y : 0,
      options.sourceOptions ? options.sourceOptions.width : options.image.width,
      options.sourceOptions
        ? options.sourceOptions.height
        : options.image.height,
      options.imageOptions.x,
      options.imageOptions.y,
      options.imageOptions.width,
      options.imageOptions.height,
    );
  }

  public drawImageDirection(
    image: HTMLImageElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    x: number,
    y: number,
    dw: number,
    dh: number,
    rotate: number = 1,
  ) {
    if (rotate === -1) {
      this.context.setTransform(rotate, 0, 0, 1, 0, 0);
    }
    this.context.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      rotate === 1 ? x : -x - sw,
      y,
      dw,
      dh,
    );

    if (this.context.getTransform().a === -1) {
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}

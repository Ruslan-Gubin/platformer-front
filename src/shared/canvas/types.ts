type FillOptions = { color?: string };
type BorderOptions = {
  color?: string;
  width?: number;
  join?: "bevel" | "round";
};
interface FillBorderOptions {
  fill?: FillOptions;
  border?: BorderOptions;
}
export interface IStraightLineOptions {
  startLine: { x: number; y: number };
  lines: number[];
  cap?: "round" | "square";
  border?: BorderOptions;
}

export interface IRectOptions extends FillBorderOptions {
  start: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface IArkOptions extends FillBorderOptions {
  size: { x: number; y: number; radius: number; start?: number; end?: number };
}

export interface IBezierCurveOptions extends FillBorderOptions {
  points: number[];
}

export interface IArbitraryFormsOptions extends FillBorderOptions {
  startLine: { x: number; y: number };
  lines: number[];
}

export interface ITextOptions {
  maxWidth?: number;
  fontSize?: string;
  color?: string;
  text: string;
  x: number;
  y: number;
  textAlign?: "start" | "right" | "center" | "end";
  baseline?: "bottom" | "middle" | "top";
}
export interface IImageOptions {
  image: HTMLImageElement;
  imageOptions: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sourceOptions?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

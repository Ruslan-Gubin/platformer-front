
export class DrawService  {

  constructor(private context: CanvasRenderingContext2D){}

/** Превращаем мередиану в градусы если наоборот return (n / Math.PI) * 180 */
public degreesToRadians(n: number) {
  return (n / 180) * Math.PI;
}

/** Проверяем опции заливки */
public checkFill(fill: { color?: string } | undefined) {
  if (!fill) return;
    this.context.fillStyle = fill.color ? fill.color : '';
    this.context.fill();  
}

/** Проверяем опции границы */
public checkBorder(border: { color?: string; width?: number; join?: "bevel" | "round" } | undefined) {
  if (!border) return;
  this.context.strokeStyle = border.color ? border.color : 'black';
  this.context.lineWidth = border.width ? border.width : 0;
  this.context.lineJoin = border.join ? border.join : "miter";
  this.context.stroke();  
}

}

   /** Развернуть текст */
    // this.context.save()
    // this.context.translate(x,y)
    // this.context.rotate(-Math.PI / 2);
    // this.context.fillText(text, 0, 0, maxWidth);

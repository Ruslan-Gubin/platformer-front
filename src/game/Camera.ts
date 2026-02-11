export class Camera {
  private root: HTMLElement | null = null;
  private center: number = 0;
  private cameraStart: number = 0;
  private cameraEnd: number = 0;

  constructor(
    private width: number,
    // private height: number,
  ) {
    this.center = this.width / 2;
    this.root = document.getElementById("root");
  }

  public update(targetX: number) {
    if (!this.root) return;
    this.cameraStart = this.getCameraStart(targetX);
    this.cameraEnd = this.getCameraEnd(targetX);

    this.root.style.left = `-${this.cameraStart}px`;
  }

  public get cameraRenderStart() {
    return this.cameraStart;
  }

  public get cameraRenderEnd() {
    return this.cameraEnd;
  }

  public getCameraStart(targetX: number) {
    return targetX < this.center
      ? 0
      : targetX + this.center > 5000
        ? 5000 - this.width
        : targetX - this.center;
  }

  public getCameraEnd(targetX: number) {
    return targetX < this.center
      ? this.width
      : targetX + this.center > 5000
        ? 5000
        : targetX + this.width / 2;
  }

  get cameraWidth() {
    return this.width;
  }

  get cameraHeight() {
    return this.width;
  }
}

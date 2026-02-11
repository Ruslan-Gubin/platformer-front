import type { HeroState } from "../../game/HeroStore";
import { CanvasDraw } from "../../shared/canvas/CanvasDraw";
import { heroAnimations } from "./hero-animations";

export type HeroStatusVariants =
  | "stay"
  | "walking"
  | "run"
  | "jump"
  | "sitDown"
  | "standUp"
  | "jumpAttack"
  | "sitDownAttack"
  | "attack"
  | "protection"
  | "damage"
  | "dead"
  | "getIn";

export class Hero {
  //private gravity: number = 0.5;
  //private height: number = 100;
  //private speed: number = 3;
  //private lastJumpDateNow: number = Date.now();
  public velocity: { x: number; y: number } = { x: 0, y: 0 };
  private drawService: CanvasDraw;
  public status: HeroStatusVariants = "stay";
  private count: number = 0;
  private activeFrame: number = 0;
  private speedAnimation: number = 9; //9
  public direction: number = 1;

  private hitBox = {
    x: 0,
    y: 0,
    width: 44,
    height: 64,
  };

  private animationList = heroAnimations;

  constructor(
    private context: CanvasRenderingContext2D,
    public position: { x: number; y: number },
    private heroSpriteImg: HTMLImageElement,
    public heroToken: number,
  ) {
    this.drawService = new CanvasDraw(this.context);
  }

  public update(state: HeroState) {
    if (this.position.x !== state.playerX) {
      const difference = Math.abs(state.playerX - this.position.x);
      const step = difference > 2 ? 2 : 1;
      this.position.x =
        this.position.x < state.playerX
          ? this.position.x + step
          : this.position.x - step;
    }

    const animationLength = this.animationList[state.status].length - 1;

    const currentAnimation = this.animationList[state.status][this.activeFrame];

    if (this.position.x !== state.playerX) {
    }

    if (currentAnimation) {
      this.drawFrame(this.position.x, this.position.y, currentAnimation);
    }

    this.count++;

    this.position.y = state.playerY;
    this.direction = state.direction;

    if (this.count === this.speedAnimation) {
      this.count = 0;
      this.activeFrame++;
      if (animationLength <= this.activeFrame) {
        this.activeFrame = 0;
      }
    }

    //if (this.count === this.speedAnimation) {
    //  this.count = 0;
    //  if (animationLength > this.activeFrame) {
    //    this.activeFrame++;
    //  } else {
    //    if (status === "sitDown") {
    //      this.activeFrame = this.animationList.sitDown.length - 1;
    //    } else if (status === "protection") {
    //      this.activeFrame = this.animationList.protection.length - 1;
    //    } else {
    //      this.activeFrame = 0;
    //    }
    //  }
    //}

    /** stand up finish */
    //if (
    //  status === "standUp" &&
    //  this.activeFrame === this.animationList.standUp.length - 1 &&
    //  this.count === this.animationList.standUp.length - 1
    //) {
    //  // this.keyboardProcessor.setButtonUp('KeyS');
    //  status = "stay";
    //}
  }

  private drawFrame(
    positionX: number,
    positionY: number,
    currentAnimation: number[],
  ) {
    this.drawHero(
      positionX,
      positionY - (currentAnimation[3] - this.hitBox.height),
      currentAnimation[0],
      currentAnimation[1],
      currentAnimation[2],
      currentAnimation[3],
    );
  }

  public getRadiant(angle: number) {
    return (angle / Math.PI) * 180;
  }

  public moveHorizont(x: number) {
    this.velocity.x = x;
  }

  public setStatus(status: HeroStatusVariants) {
    this.status = status;
  }

  private drawHero(
    x: number,
    y: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
  ) {
    this.drawService.drawImageDirection(
      this.heroSpriteImg,
      sx,
      sy,
      sw,
      sh,
      x,
      y,
      sw,
      sh,
      this.direction,
    );
  }
}

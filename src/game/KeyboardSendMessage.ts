import type { HeroStatusVariants } from "../entity/hero/Hero";
import type { KeyboardProcessor } from "../shared/keyboard/KeyboardProcessor";
import type { WebSocketGame } from "./WebSocketGame";

export class KeyboardSendMessage {
  private speed: number = 10;
  private lastDirection = 1;

  constructor(
    private socket: WebSocketGame,
    private id: number | null,
    private keyboard: KeyboardProcessor,
  ) { }

  public onKeyDownInput() {
    if (
      this.keyboard.isButtonPressed("KeyA") &&
      this.keyboard.isButtonPressed("KeyD")
    ) {
      return this.sendStayPosition(this.lastDirection);
    }

    if (this.keyboard.isButtonPressed("KeyA")) {
      this.lastDirection = 1;
      return this.postChangePosition(-this.speed, 0, "walking", -1);
    } else if (this.keyboard.isButtonPressed("KeyD")) {
      this.lastDirection = -1;
      return this.postChangePosition(this.speed, 0, "walking", 1);
    } else if (
      this.keyboard.isButtonPressed("KeyS") &&
      this.keyboard.isButtonPressed("Space")
    ) {
      return this.postChangePosition(0, 0, "sitDownAttack", 1); //prev direction
    } else if (this.keyboard.isButtonPressed("KeyS")) {
      return this.postChangePosition(0, 0, "sitDown", 1); //prev direction
    }

    // if (
    //   this.keyboard.isButtonPressed("KeyA") &&
    //   this.keyboard.isButtonPressed("KeyD")
    // ) {
    //   this.postChangePosition( 0, 0, 'stay', -1);
    // } else {
    //   if (this.keyboard.isButtonPressed("ShiftLeft")) {
    //     this.postChangePosition( 0, 0, 'protection', 1);//prev direction
    //   }

    //   else if (this.keyboard.isButtonPressed("Space")) {
    //     // this.status = this.status === 'jump' ? 'jumpAttack' : 'attack';
    //     this.postChangePosition( 0, 0, 'attack', 1);//prev direction
    //   }

    //   else if (this.keyboard.isButtonPressed('KeyD')) {
    //     // this.status = this.status !== 'jump' ? "walking" : 'jump';
    //     this.postChangePosition( speed, 0, 'walking', 1);
    //   }

    //   else if (this.keyboard.isButtonPressed('KeyA')) {
    //     // this.status = this.status !== 'jump' ? "walking" : 'jump';
    //     this.postChangePosition( -speed, 0, 'walking', -1);
    //   }

    //   else if (this.keyboard.isButtonUp("KeyS")) {
    //     // this.hitBox.y = 0;
    //     this.postChangePosition( 0, 0, 'standUp', 1);//prev direction
    //   }

    //   else if (
    //     this.keyboard.isButtonPressed('KeyA') &&
    //     this.keyboard.isButtonPressed('KeyW')
    //   ) {
    //     this.postChangePosition( -1, 0, 'jump', 1);
    //   }
    //   else if (
    //     this.keyboard.isButtonPressed('KeyD') &&
    //     this.keyboard.isButtonPressed('KeyW')
    //   ) {
    //     this.postChangePosition( 1, 0, 'jump', 1);
    //   }

    //   if (
    //     this.keyboard.isButtonPressed("KeyW") &&
    //     // this.lastJumpDateNow + 650  < Date.now() &&
    //     // this.position.y === 593 &&
    //     // heroStatus !== "jump"
    //     this.keyboard.isButtonPressed('KeyD')
    //   ) {
    //     // this.velocity.y = -10;
    //     this.postChangePosition( 0, 0, 'jump', 1);//prev direction
    //     // this.lastJumpDateNow = Date.now();
    //   }

    // }
  }

  public onKeyUpInput() {
    if (this.keyboard.isButtonUp("KeyA")) {
      this.sendStayPosition(-1);
    }
    if (this.keyboard.isButtonUp("KeyD")) {
      this.sendStayPosition(1);
    }
  }

  private sendStayPosition(direction: number) {
    this.postChangePosition(0, 0, "stay", direction);
  }

  private postChangePosition(
    x: number,
    y: number,
    status: HeroStatusVariants,
    direction: number,
  ) {
    if (this.id === null) return;
    this.socket.sendMessage("player-update-position", {
      id: this.id,
      x,
      y,
      status,
      direction,
    });
  }
}

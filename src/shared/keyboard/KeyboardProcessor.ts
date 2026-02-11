import type { KeyMapType } from "../../types/KeyBoardTypes";

export class KeyboardProcessor {
  private keyMap: Record<string, boolean> = {
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false,
    ShiftLeft: false,
    Space: false,
  };

  private keyUp: Record<string, boolean> = {
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false,
    ShiftLeft: false,
    Space: false,
  };

  public onKeyDown(keyCode: string) {
    if (this.isHasKeyInMap(keyCode)) {
      this.keyMap[keyCode] = true;
    }
  }

  public onKeyUp(keyCode: string) {
    if (this.isHasKeyInMap(keyCode)) {
      this.keyMap[keyCode] = false;
      this.keyUp[keyCode] = true;
    }
  }

  private isHasKeyInMap(checkKey: string) {
    return this.keyMap.hasOwnProperty(checkKey);
  }

  public getButton(keyCode: string) {
    return this.keyMap[keyCode];
  }

  public isButtonPressed(keyCode: keyof KeyMapType): boolean {
    return this.keyMap[keyCode];
  }

  public isButtonUp(keyCode: keyof KeyMapType): boolean {
    return this.keyUp[keyCode];
  }

  public setButtonUp(keyCode: keyof KeyMapType): void {
    this.keyUp[keyCode] = false;
  }
}

import { Hero, type HeroStatusVariants } from "../entity/hero/Hero";
import type { AssetsImagesListLoad } from "../types/Assets";
import type { World } from "./World";

export type HeroState = {
  direction: number;
  id: number;
  playerX: number;
  playerY: number;
  status: HeroStatusVariants;
};

export class HeroStore {
  public heroList: Hero[] = [];
  public heroState: HeroState[] = [];

  constructor(
    private world: World,
    private images: AssetsImagesListLoad,
    private heroToken: number | null,
  ) { }

  public update() {
    if (this.heroList.length === 0) return;
    //console.log(this.heroState);
    for (let i = 0; i < this.heroList.length; i++) {
      //const hero = this.heroList[i];

      //const currentState = this.heroState.find(
      //  (item) => item.id === hero.heroToken,
      //);
      //const currentState = this.heroState.find(
      //  (item) => item.id === hero.heroToken,
      //);
      if (this.heroState[i]) {
        //hero.position.x = currentState.playerX;
        //hero.position.y = this.heroList[i].playerY;
        //hero.direction = currentState.direction;
        this.heroList[i].update(this.heroState[i]);
      }
    }
  }

  public addNewHero(players: HeroState[]) {
    if (!this.world || !this.world.gameWorld) return;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const isHasPlayer = this.heroState.some(
        (statePlayer) => statePlayer.id === player.id,
      );
      if (isHasPlayer) continue;
      this.heroState.push(player);
      this.heroList.push(
        new Hero(
          this.world.gameWorld,
          { x: player.playerX, y: player.playerY },
          this.images.hero,
          player.id,
        ),
      );
    }
  }

  public disconnectHero(id: number) {
    this.heroState.filter((player) => player.id !== id);
    this.heroList.filter((player) => player.heroToken !== id);
  }

  public updateHeroPosition(player: HeroState) {
    for (let i = 0; i < this.heroState.length; i++) {
      if (this.heroState[i].id === player.id) {
        this.heroState[i].direction = player.direction;
        this.heroState[i].playerX = player.playerX;
        this.heroState[i].playerY = player.playerY;
        this.heroState[i].status = player.status;
        break;
      }
    }
  }

  public getMyHero() {
    for (let i = 0; i < this.heroList.length; i++) {
      if (this.heroList[i].heroToken === this.heroToken) {
        return this.heroList[i];
      }
    }
    return null;
  }

  public getMyHeroState() {
    for (let i = 0; i < this.heroList.length; i++) {
      if (this.heroList[i].heroToken === this.heroToken) {
        return {
          positionX: this.heroList[i].position.x,
          status: this.heroList[i].status,
        };
      }
    }
    return null;
  }
}

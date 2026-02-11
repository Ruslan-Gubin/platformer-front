import type { HeroState, HeroStore } from "./HeroStore";

export class WsMessageProcessor {
  constructor(
    private heroStore: HeroStore,
  ) {}

  public connectHero = (data: HeroState[]) => {
    this.heroStore.addNewHero(data);
  };

  public disconnectHero = (id: number) => {
    this.heroStore.disconnectHero(id);
  };

  public updateHeroPosition = (player: HeroState) => {
    this.heroStore.updateHeroPosition(player);
  };
}

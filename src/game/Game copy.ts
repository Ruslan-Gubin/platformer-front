import { TextStyle, Text } from "pixi.js";
import { World } from "./World";

import { KeyboardProcessor } from "../hared/keyboard/KeyboardProcessor";
import { Camera } from "../entities/camera/Camera";
import { Physics } from "../hared/physics/Physics";

import { PlatformFactory } from "../entities/platforms/PlatformFactory";
import { BulletFactory } from "../entities/bullets/BulletFactory";
import { HeroFactory } from "../entities/hero/HeroFactory";
import { SceneFactory } from "./SceneFactory";
import { EnemiesFactory } from "../entities/enemies/EnemiesFactory";
import { PowerupsFactory } from "../entities/powerups/PowerupsFactory";

import { Hero } from "../entities/hero/Hero";
import { Runner } from "../entities/enemies/runner/Runner";
import { Weapon } from "./Weapon";

import type { Application } from "pixi.js";
import type { Platform } from "../entities/platforms/Platform";
import type {
  ButtonContextType,
  EntityArrayItemType,
  EntityArrayType,
} from "../entities/types";
import type { AssetsFactory } from "../hared/assets-factory/AssetsFactory";
import { SpreadgunPowerup } from "../entities/powerups/SpreadgunPawerup";
import { StaticBackground } from "./StaticBackground";

export class Game {
  private hero: Hero;
  private platforms: Platform[] = [];
  private platformFactory: PlatformFactory;
  private sceneFactory: SceneFactory;
  public keyboardProcessor: KeyboardProcessor;
  private camera: Camera;
  public worldContainer: World;
  private bulletFactory: BulletFactory;
  private entityes: EntityArrayType = [];
  private enemiesFactory: EnemiesFactory;
  private heroFactory: HeroFactory;
  private powerupFactory: PowerupsFactory;
  private weapon: Weapon;
  private heroBulletCount: number = 0;
  private isEndGame = false;
  public stats: any;

  constructor(
    private pixiApp: Application,
    public assets: AssetsFactory,
  ) {
    this.worldContainer = new World();
    this.pixiApp.stage.addChild(
      new StaticBackground(this.pixiApp.screen, this.assets),
    );
    this.pixiApp.stage.addChild(this.worldContainer);

    /** создание героя */
    this.heroFactory = new HeroFactory(
      this.worldContainer.gameWorld,
      this.assets,
    );
    this.hero = this.heroFactory.createHero(160, 100);
    this.entityes.push(this.hero);

    /** фабрика пуль для героя и врагов */
    this.bulletFactory = new BulletFactory(
      this.worldContainer.gameWorld,
      this.entityes,
    );

    /** фабрика создания врагов */
    this.enemiesFactory = new EnemiesFactory(
      this.worldContainer.gameWorld,
      this.hero,
      this.bulletFactory,
      this.entityes,
      this.assets,
    );

    /** фабрика создание летающих бонусов */
    this.powerupFactory = new PowerupsFactory(
      this.entityes,
      this.assets,
      this.worldContainer,
      this.hero,
    );

    /** фабрика создания платформ */
    this.platformFactory = new PlatformFactory(
      this.worldContainer,
      this.assets,
    );

    /** фабрика создания сцены */
    this.sceneFactory = new SceneFactory(
      this.platforms,
      this.platformFactory,
      this.enemiesFactory,
      this.hero,
      this.entityes,
      this.powerupFactory,
    );
    this.sceneFactory.createScene();

    this.keyboardProcessor = new KeyboardProcessor(this);
    this.setKeys();

    const cameraSettings = {
      target: this.hero,
      world: this.worldContainer,
      screenSize: this.pixiApp.screen,
      maxWorldWidth: this.worldContainer.width,
      isBackScrollX: false,
    };
    this.camera = new Camera(cameraSettings);

    this.weapon = new Weapon(this.bulletFactory);

    this.weapon.setWeapon(1);
  }

  public update() {
    this.heroBulletCount = 0;
    for (let i = 0; i < this.entityes.length; i++) {
      const entity = this.entityes[i];
      entity.update();

      /** подбиваем количество пуль героя на карте */
      if (entity.type === this.hero.bulletContextHero.type) {
        this.heroBulletCount++;
      }

      /** проверяем сущности на урон */
      if (
        entity.type === "hero" ||
        entity.type === "enemy" ||
        entity.type === "powerup" ||
        entity.type === "spreadgunPowerup"
      ) {
        this.checkDamage(entity);
      }

      /** проверяем падение и столкновение с платформами */
      if (
        entity instanceof Hero ||
        entity instanceof Runner ||
        entity instanceof SpreadgunPowerup
      ) {
        this.checkPlatforms(entity);
      }

      this.checkEntityStatus(entity, i);

      if (entity.isBoss) {
        this.checkBossStatus(entity);
      }

      if (entity.type === "hero") {
        this.checkHeroStatus(entity);
      }
    }

    this.camera.update();
    this.weapon.update(this.hero.bulletContextHero);
  }

  /** проверяем жизнь героя */
  private checkHeroStatus(entity: EntityArrayItemType) {
    if (!entity.isDead || !entity.isActive) return;
    this.entityes.push(this.hero);
    this.worldContainer.gameWorld.addChild(this.hero.view);
    this.hero.reset();
    this.hero.x = -this.worldContainer.x + 160;
    this.hero.y = 100;
    this.weapon.setWeapon(1);
  }

  /** проверяем жизнь босса на уровне */
  private checkBossStatus(entity: EntityArrayItemType) {
    if (this.isEndGame || entity.isActive) return;
    this.setDeadAllEnemy();
    /** удаляем босса после анимации с задержкой для исключеия проверки босса выше */
    this.isEndGame = true;
    this.showEndGame();
    setTimeout(() => entity.setDead(), 1000);
  }

  /** показываем надпись прохождения уровня */
  private showEndGame() {
    const style = new TextStyle({
      fontFamily: "Impact",
      fontSize: 50,
      stroke: 0xffffff,
      //@ts-ignore
      strokeThickness: 5,
      letterSpacing: 30,
      fill: 0xdd0000,
    });

    const text = new Text({ text: "stage clear", style });
    text.x = this.pixiApp.screen.width / 2 - text.width / 2;
    text.y = this.pixiApp.screen.height / 2 - text.height / 2;

    this.pixiApp.stage.addChild(text);
  }

  /** удаляем всех врагов на карте */
  private setDeadAllEnemy() {
    this.entityes.forEach(
      (entity) => entity.type === "enemy" && !entity.isBoss && entity.setDead(),
    );
  }

  /** проверяем сущность на урон */
  private checkDamage(entity: EntityArrayItemType) {
    for (let i = 0; i < this.entityes.length; i++) {
      /** обьект с которым проверяем */
      const curretTarget = this.entityes[i];

      /** если герой сталкивается с бонусом */
      if (
        entity instanceof Hero &&
        curretTarget instanceof SpreadgunPowerup &&
        this.isCollisionPowerup(entity, curretTarget)
      ) {
        curretTarget.damage();
        this.weapon.setWeapon(curretTarget.powerUpType);
        continue;
      }

      if (!this.isDamager(entity, curretTarget)) {
        continue;
      }

      if (
        Physics.isCheckAABB(
          curretTarget.collisionBox,
          entity instanceof Hero ? entity.hitBox : entity.collisionBox,
        )
      ) {
        entity.damage();
        if (curretTarget.type !== "enemy") {
          curretTarget.setDead();
        }
        break;
      }
    }
  }

  private checkPlatforms(character: Hero | Runner | SpreadgunPowerup) {
    if (character.isDead || !character.gravitable) return;
    for (let platform of this.platforms) {
      if (
        (character.isJumpState() && platform.type !== "box") ||
        !platform.isActive
      ) {
        continue;
      }

      this.checkPlatformCollision(character, platform);
    }

    if (character.type === "hero" && character.x < -this.worldContainer.x) {
      character.x = character.prevPointHero.x;
    }
  }

  /** проверка столкновения пули */
  private isDamager(entity: EntityArrayItemType, damager: EntityArrayItemType) {
    return (
      ((entity.type === "enemy" || entity.type === "powerup") &&
        damager.type === "heroBullet") ||
      (entity.type === "hero" &&
        (damager.type === "enemyBullet" || damager.type === "enemy"))
    );
  }

  /** проверка столкновения героя с бонусом */
  private isCollisionPowerup(hero: Hero, powerup: SpreadgunPowerup) {
    return Physics.isCheckAABB(hero.hitBox, powerup.hitBox);
  }

  private checkPlatformCollision(
    character: Hero | Runner | SpreadgunPowerup,
    platform: Platform,
  ) {
    if (!character.prevPointHero) return;

    const prevPoint = character.prevPointHero;

    const collisionResult = Physics.getOrientCollisionResult(
      character.collisionBox,
      platform.collisionBox,
      prevPoint,
    );

    if (collisionResult.vertical) {
      character.y = prevPoint.y;
      character.stay(platform.y);
    }
    if (
      collisionResult.horizontal &&
      platform.type === "box" &&
      //@ts-ignore проверяем пулю босса на горизонтальную коллизию
      !character.isForbiddenHorizontalCollision
    ) {
      if (platform.isStep) {
        character.stay(platform.y);
      } else {
        character.x = prevPoint.x;
      }
    }
  }

  public setKeys() {
    const keyA = this.keyboardProcessor.getButton("KeyA");

    keyA.executeDown = () => (
      !this.hero.isDead &&
        !this.hero.isFall &&
        this.getHeroBulletsLength() < 15 &&
        this.weapon.startFire(),
      this.hero.setView(this.getArrowButtonContext())
    );

    keyA.executeUp = () => (
      !this.hero.isDead &&
        !this.hero.isFall &&
        this.hero.setView(this.getArrowButtonContext()),
      this.weapon.stopFire()
    );

    const keyS = this.keyboardProcessor.getButton("KeyS");

    keyS.executeDown = () =>
      this.keyboardProcessor.isButtonPressed("ArrowDown") &&
      !this.keyboardProcessor.isButtonPressed("ArrowLeft") &&
      !this.keyboardProcessor.isButtonPressed("ArrowRight")
        ? this.hero.throwDown()
        : this.hero.jump();

    const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");

    arrowLeft.executeDown = () => (
      this.hero.starLeftMove(), this.hero.setView(this.getArrowButtonContext())
    );

    arrowLeft.executeUp = () => (
      this.hero.stopLeftMove(), this.hero.setView(this.getArrowButtonContext())
    );

    const arrowRight = this.keyboardProcessor.getButton("ArrowRight");

    arrowRight.executeDown = () => (
      this.hero.starRightMove(), this.hero.setView(this.getArrowButtonContext())
    );

    arrowRight.executeUp = () => (
      this.hero.stopRightMove(), this.hero.setView(this.getArrowButtonContext())
    );

    const arrowUp = this.keyboardProcessor.getButton("ArrowUp");

    arrowUp.executeDown = () => this.hero.setView(this.getArrowButtonContext());

    arrowUp.executeUp = () => this.hero.setView(this.getArrowButtonContext());

    const arrowDown = this.keyboardProcessor.getButton("ArrowDown");

    arrowDown.executeDown = () =>
      this.hero.setView(this.getArrowButtonContext());

    arrowDown.executeUp = () => this.hero.setView(this.getArrowButtonContext());
  }

  /** получение количества выпущенных пуль героя */
  private getHeroBulletsLength() {
    return this.heroBulletCount;
  }

  /** Создаем контекст кнопок которые нажаты на данный момент */
  public getArrowButtonContext(): ButtonContextType {
    return {
      arrowLeft: this.keyboardProcessor.isButtonPressed("ArrowLeft"),
      arrowRight: this.keyboardProcessor.isButtonPressed("ArrowRight"),
      arrowUp: this.keyboardProcessor.isButtonPressed("ArrowUp"),
      arrowDown: this.keyboardProcessor.isButtonPressed("ArrowDown"),
      shoot: this.keyboardProcessor.isButtonPressed("KeyA"),
    };
  }

  /** все кто может находится за экраном */
  private getNoCheckScreenOut(entity: EntityArrayItemType) {
    return (
      entity.type !== "enemy" &&
      entity.type !== "hero" &&
      entity.type !== "powerup" &&
      entity.type !== "bridge"
    );
  }

  /** проверка на вылет за пределы экрана и врага и пули */
  private checkEntityStatus(entity: EntityArrayItemType, index: number) {
    let isRemove = false;

    this.getNoCheckScreenOut(entity)
      ? (isRemove = entity.checkIsDead || this.isScreenOut(entity))
      : (isRemove = entity.checkIsDead || this.isScreenOutEnemy(entity));

    if (isRemove) {
      this.removeEntity(entity, index);
    }
  }

  /** удаление сущности из контейнера и из массива сущностей */
  private removeEntity(entity: EntityArrayItemType, index: number) {
    entity.removeFromStage();
    this.entityes.splice(index, 1);
  }

  /** проверка пули на велет за пределы экрана */
  private isScreenOut(entity: EntityArrayItemType) {
    return (
      entity.x > this.pixiApp.screen.width - this.worldContainer.x ||
      entity.x < -this.worldContainer.x ||
      entity.y > this.pixiApp.screen.height ||
      entity.y < 0
    );
  }

  /** проверка врага на велет за пределы левого экрана и вниз */
  private isScreenOutEnemy(entity: EntityArrayItemType) {
    return (
      entity.x < -this.worldContainer.x || entity.y > this.pixiApp.screen.height
    );
  }
}

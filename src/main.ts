import { AssetsFactory } from "./game/AssetsFactory";
import { Camera } from "./game/Camera";
import { Game } from "./game/Game";
import { HeroStore } from "./game/HeroStore";
import { KeyboardSendMessage } from "./game/KeyboardSendMessage";
import { WebSocketGame } from "./game/WebSocketGame";
import { World } from "./game/World";
import { WsMessageProcessor } from "./game/WsMessageProcessor";
import { KeyboardProcessor } from "./shared/keyboard/KeyboardProcessor";
import type { AssetsImagesListLoad } from "./types/Assets";

(async () => {
  const root = document.getElementById("root");
  if (!root) return;

  const GAME_SIZES_WIDTH: number = 5000;
  const GAME_SIZES_HEIGHT: number = 768;
  const CAMERA_SIZES_WIDTH: number = 1024;

  const assets = new AssetsFactory();
  await assets.initImages();

  const token: number | null = localStorage.getItem("id")
    ? Number(localStorage.getItem("id"))
    : null;

  const world = new World(root, GAME_SIZES_WIDTH, GAME_SIZES_HEIGHT);
  if (!world) return;
  const camera = new Camera(CAMERA_SIZES_WIDTH);

  const heroStore = new HeroStore(
    world,
    assets.img as AssetsImagesListLoad,
    token,
  );

  const webSocketGame = new WebSocketGame(
    token,
    "ws://localhost:8080/ws",
    new WsMessageProcessor(heroStore),
  );

  const keyboardProcessor = new KeyboardProcessor();
  const keyboardSendMessage = new KeyboardSendMessage(
    webSocketGame,
    token,
    keyboardProcessor,
  );

  const game = new Game(
    world,
    heroStore,
    assets.img as AssetsImagesListLoad,
    camera,
  );

  const animation = () => {
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(animation);
      game.update();
    }
  };

  animation();

  document.addEventListener("keydown", (key: KeyboardEvent): void => {
    keyboardProcessor.onKeyDown(key.code);
    keyboardSendMessage.onKeyDownInput();
  });

  document.addEventListener("keyup", (key: KeyboardEvent): void => {
    keyboardProcessor.onKeyUp(key.code);
    keyboardSendMessage.onKeyUpInput();
  });

  document.addEventListener("dblclick", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  });
})();

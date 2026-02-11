import type { WsMessageProcessor } from "./WsMessageProcessor";

export class WebSocketGame {
  private ws: WebSocket | null = null;

  constructor(
    private token: number | null,
    socketUrl: string,
    private messageProcessor: WsMessageProcessor,
  ) {
    this.ws = new WebSocket(socketUrl);
    this.listeners();
  }

  public onMessages = (event: MessageEvent<any>) => {
    const { type, data } = JSON.parse(event.data);

    switch (type) {
      case "connect":
        this.messageProcessor.connectHero(data);
        break;
      case "disconnect":
        this.messageProcessor.disconnectHero(data);
        break;
      case "player-update-position":
        this.messageProcessor.updateHeroPosition(data);
        break;
      case "init-new-player":
        this.messageProcessor.connectHero(data);
        break;
      case "init-player":
        console.log("new player:", data);
        localStorage.setItem("id", String(data.id));
        break;

      default:
        break;
    }
  };

  public onOpen = (event: Event) => {
    if (this.token !== null) {
      this.sendMessage("connect", { id: Number(this.token) });
    } else {
      this.sendMessage("init-player", {});
    }
  };

  private listeners() {
    if (!this.ws) return;
    this.ws.addEventListener("open", this.onOpen);
    this.ws.addEventListener("message", this.onMessages);
    this.ws.addEventListener("error", this.onError);
    this.ws.addEventListener("close", this.onClose);
  }

  public disconnect() {
    if (!this.ws) return;
    this.ws.removeEventListener("error", this.onError);
    this.ws.removeEventListener("close", this.onClose);
    this.ws.removeEventListener("message", this.onMessages);
  }

  private onError(event: Event) {
    console.error("WebSocket error: ", event);
  }

  private onClose(event: Event) {
    console.log("WebSocket close: ", event);
  }

  public sendMessage(type: string, data: object) {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({ type, data }));
  }
}

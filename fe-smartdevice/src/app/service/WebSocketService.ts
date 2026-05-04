import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


export class WebSocketService{
    private client: Client;

    private static _webSocketService: WebSocketService;
  
    public static getInstance(): WebSocketService {
      if (!WebSocketService._webSocketService) {
        WebSocketService._webSocketService = new WebSocketService();
      }
      return WebSocketService._webSocketService;
    }

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(process.env.REACT_APP_SOCKET_URL),
            debug: (msg) => console.log("[STOMP] " + msg),
            reconnectDelay: 5000, // Tự động reconnect nếu mất kết nối
            onConnect: () => console.log("Kết nối WebSocket thành công"),
            onDisconnect: () => console.log("Mất kết nối WebSocket"),
        })
        this.client.activate();
    }

    public subscribe(topic: string, callback: (message: string) => void) {
        if (this.client.connected) {
            this.client.subscribe(topic, (message) => {
                callback(message.body);
            });
        } else {
            this.client.onConnect = () => {
                this.client.subscribe(topic, (message) => {
                    callback(message.body);
                });
            };
        }
    }
}
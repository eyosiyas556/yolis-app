export type RealtimeEvent =
  | {
      type: "ORDER_CREATED";
      order: any;
    }
  | {
      type: "ORDER_STATUS_CHANGED";
      orderId: string;
      orderNumber?: string;
      status: string;
      rejectionReason?: string;
      order?: any;
    }
  | {
      type: "DATA_MUTATION";
      entity: "products" | "categories" | "orders" | "welcome";
    };

const CHANNEL_NAME = "yolanda_live_sync_channel";
const STORAGE_KEY = "yolanda_realtime_ping";

class RealtimeBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(event: RealtimeEvent) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        if ("BroadcastChannel" in window) {
          this.channel = new BroadcastChannel(CHANNEL_NAME);
          this.channel.onmessage = (e) => {
            if (e.data && e.data.type) {
              this.notify(e.data);
            }
          };
        }
      } catch (err) {
        console.warn("BroadcastChannel initialization warning:", err);
      }

      // Cross-window storage fallback
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data && data.event) {
              this.notify(data.event);
            }
          } catch {}
        }
      });
    }
  }

  public emit(event: RealtimeEvent) {
    if (typeof window === "undefined") return;

    // 1. Notify listeners in current window/tab immediately (0ms)
    this.notify(event);

    // 2. Broadcast to other tabs/windows via BroadcastChannel
    try {
      this.channel?.postMessage(event);
    } catch {}

    // 3. Fallback ping via localStorage for any tabs where BroadcastChannel isn't active
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ event, timestamp: Date.now() })
      );
    } catch {}
  }

  public subscribe(callback: (event: RealtimeEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(event: RealtimeEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error("Error in realtime listener callback:", err);
      }
    });
  }
}

export const realtimeBus = new RealtimeBus();

export const emitRealtimeEvent = (event: RealtimeEvent) => realtimeBus.emit(event);
export const subscribeRealtimeEvent = (callback: (event: RealtimeEvent) => void) =>
  realtimeBus.subscribe(callback);

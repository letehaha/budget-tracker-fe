export enum BUS_EVENTS {
  transactionChange = 'transaction-change',
  error = 'error',
}

class EventBus {
  events: Record<string, ((data?: unknown) => void)[]>;

  constructor() {
    this.events = {};
  }

  on(eventName: BUS_EVENTS, fn: () => void) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  emit(eventName: BUS_EVENTS, data?: unknown) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  }

  off(eventName: BUS_EVENTS, fn: () => void) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  reset() {
    this.events = {};
  }

  error(payload: unknown) { this.emit(BUS_EVENTS.error, payload); }
}

export const eventBus = new EventBus();

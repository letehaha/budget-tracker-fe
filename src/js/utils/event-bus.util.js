class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  }

  off(eventName, fn) {
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

  error(payload) { this.emit(this.eventsList.error, payload); }

  get eventsList() {
    return {
      error: 'error',
      modalOpen: 'modal-open',
      modalClose: 'modal-close',
    };
  }

  eventExists(eventName) {
    return Object
      .values(this.eventsList)
      .includes(eventName);
  }
}

export const eventBus = new EventBus();

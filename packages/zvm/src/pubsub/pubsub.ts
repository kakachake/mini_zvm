export class PubSub {
  subscribers: {
    [topic: string]: Set<(data: any) => any>;
  };
  constructor() {
    this.subscribers = {};
  }
  subscribe(topic: string, callback: (...args: any[]) => void) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = new Set();
    }
    this.subscribers[topic].add(callback);
  }
  publish(topic: string, data: any = "") {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach((callback) => {
        callback(data);
      });
    }
  }
}

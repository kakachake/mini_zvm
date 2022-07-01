export class PubSub {
  subscribers: {
    [topic: string]: Set<(data: any) => any>;
  };
  constructor() {
    this.subscribers = {};
  }
  subscribe(topic, callback) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = new Set();
    }
    this.subscribers[topic].add(callback);
  }
  publish(topic, data = "") {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach((callback) => {
        callback(data);
      });
    }
  }
}

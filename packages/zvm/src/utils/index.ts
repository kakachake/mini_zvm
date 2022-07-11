// 获取类型
export function getType(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function getRandomId(): string {
  return Math.random().toString(36).substr(2);
}

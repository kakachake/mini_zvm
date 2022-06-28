// 根据a.b.c设置数据
export function setValueByPath(obj, path, value) {
  const paths = path.split(".");
  const len = paths.length;
  let i = 0;
  while (i < len - 1) {
    obj = obj[paths[i++]];
  }
  obj[paths[i]] = value;
}

export function getValueByPath(obj, path) {
  const paths = path.split(".");

  const len = paths.length;
  let i = 0;
  while (i < len) {
    obj = obj[paths[i++]];
  }
  return obj;
}

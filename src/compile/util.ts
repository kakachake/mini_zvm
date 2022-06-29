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

export function _with(scopeName: string, exp: string) {
  //去除空格
  exp = exp.replace(/\s/g, "");
  exp = " " + exp;
  const quickRegex = /([\s\+\-\*\/%&\|\^!\*~]\s*?)([a-zA-Z_$][a-zA-Z_$0-9]*?)/g;

  exp = exp.replace(quickRegex, (a, b, c) => {
    return b + scopeName + "." + c;
  });

  return exp;
}

export function runInScope(scope, scopeName: string, exp: string) {
  const func = new Function(scopeName, "return " + _with(scopeName, exp));
  return func(scope);
}

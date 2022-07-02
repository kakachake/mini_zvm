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

// 模拟with
export function _with(scopeName: string, exp: string) {
  //去除空格
  exp = exp.replace(/\s/g, "");
  exp = " " + exp;
  const quickRegex =
    /([\(:,\s\+\-\*\/%&\|\^!\*~]\s*?)(([a-zA-Z_$][a-zA-Z_$0-9]*))/g;
  // javascript 关键字的正则
  const boolRegex = /(true|false|null|undefined)/g;

  exp = exp.replace(quickRegex, (_a, b, c) => {
    return boolRegex.test(c) ? b + c : b + scopeName + "." + c;
  });

  return exp;
}

// 解析JavaScript表达式，加入上下文对象，返回表达式最后的值
export function runInScope(scope, scopeName: string, exp: string) {
  const func = new Function(scopeName, "return " + _with(scopeName, exp));
  return func(scope);
}

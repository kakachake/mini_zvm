import * as esprima from "esprima";
import estraverse from "estraverse";
import escodegen from "escodegen";

// 根据a.b.c设置数据
export function setValueByPath(obj: object, path: string, value: any) {
  const paths = path.split(".");
  const len = paths.length;
  let i = 0;
  while (i < len - 1) {
    obj = obj[paths[i++]];
  }
  obj[paths[i]] = value;
}

export function getValueByPath(obj: object, path: string) {
  const paths = path.split(".");

  const len = paths.length;
  let i = 0;
  while (i < len) {
    obj = obj[paths[i++]];
  }
  return obj;
}

// // 模拟with
// export function _with(scopeName: string, exp: string) {
//   //去除空格
//   exp = exp.replace(/\s/g, "");
//   exp = " " + exp;
//   const quickRegex =
//     /((?!["'])[\(:,\s\+\-\*\/%&\|\^!\*~]\s*?)(([a-zA-Z_$][a-zA-Z_$0-9]*)\s*?(?!["':]))/g;
//   // javascript 关键字的正则
//   const boolRegex = /(true|false|null|undefined)/g;

//   exp = exp.replace(quickRegex, (_a, b, c) => {
//     return boolRegex.test(c) ? b + c : b + scopeName + "." + c;
//   });

//   return exp;
// }

export function createRunInScopeFn(
  scope: object,
  scopeName: string,
  exp: string
) {
  const func = new Function(scopeName, "return " + __with(scopeName, exp));

  return function () {
    return func(scope);
  };
}

// 解析JavaScript表达式，加入上下文对象，返回表达式最后的值
export function runInScope(scope: object, scopeName: string, exp: string): any {
  return createRunInScopeFn(scope, scopeName, exp)();
}

export function camelToDash(str: string) {
  return str.replace(/[A-Z]|([0-9]+)/g, function (item: string) {
    return "-" + item.toLowerCase();
  });
}

// 模拟with
export function __with(scopeName: string, exp: string) {
  if (!exp) return "";
  const code = "(" + exp + ")";

  const tree = esprima.parseScript(code); // 生成语法树
  // 遍历语法树
  estraverse.traverse(tree, {
    enter(node: any, parent: any) {
      // 修改变量名
      if (node.type === "Identifier" && parent.type !== "MemberExpression") {
        node.name = scopeName + "." + node.name;
      }
      if (node.type === "ObjectExpression") {
        node.properties.forEach((prop: any) => {
          if (prop.value.type === "Identifier") {
            prop.value.name = scopeName + "." + prop.value.name;
          }
        });
        return estraverse.VisitorOption.Skip;
      }
      if (node.type === "MemberExpression") {
        node.object.name = scopeName + "." + node.object.name;
        // return estraverse.VisitorOption.Skip;
      }
      return node;
    },
  });

  // 编译修改后的语法树；
  const compileTreeJS = escodegen.generate(tree);

  return compileTreeJS;
}

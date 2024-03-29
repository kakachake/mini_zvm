import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
export const file = (type) => `dist/index.${type}.js`;
import json from "@rollup/plugin-json";

console.log(process.env.NODE_ENV);
const isProd = process.env.NODE_ENV === "production";
const overrides = {
  compilerOptions: {
    noUnusedParameters: false,
    noUnusedLocals: false,
    strictNullChecks: false,
    moduleResolution: "node",
    declaration: true, //抽离声明代码 *.d.js
    allowSyntheticDefaultImports: true,
  },
  useTsconfigDeclarationDir: true,
};
export default {
  input: "src/main.ts",
  output: [
    {
      format: "es",
      dir: "dist/es",
    },
    {
      format: "iife",
      dir: "dist/iife",
      name: "ZVM",
    },
    {
      format: "umd",
      dir: "dist/umd",
      name: "ZVM",
    },
  ],
  plugins: [
    typescript({
      tsconfigOverride: overrides,
    }),
    nodeResolve({
      extensions: [".js", ".ts"], //允许我们加载第三方模块
    }),
    commonjs(), // 转换为ES6版本
    isProd ? terser() : null,
    json(),
  ],
};

import webpack = require("webpack");
import { templateCompile } from "./templateCompile";

export default function loader(
  this: webpack.LoaderContext<any>,
  source: string
) {
  const compileSource = templateCompile(source);

  return compileSource;
}

export function templateCompile(content: string) {
  const templateReg =
    /<template>([\s\S]+)<\/template>\s+<script>([\s\S]+)<\/script>/;

  const [, template, script] = templateReg.exec(content) || [];

  if (!template) {
    throw new Error("template not found");
  }
  if (!script) {
    throw new Error("script not found");
  }
  const scriptReg = /(export default\s+\{)([\s\S]+)(\})/;
  let [, , scriptContent] = scriptReg.exec(script) || [];

  scriptContent = "render:(h)=>  h(`" + template + "`),\n" + scriptContent;

  const parseScript = script.replace(scriptReg, `$1${scriptContent}$3`);

  return `
    ${parseScript}
  `;
}

import { screen } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("customDirective", () => {
  it("auto focus", () => {
    document.body.innerHTML = `
      <div id="app">
        <input value="input 元素应该会被自动聚焦" data-testid="1" z-focus />
      </div>
    `;
    createApp({
      template: "#app",
      directives: {
        focus: (node) => {
          (node as HTMLInputElement).focus();
        },
      },
    }).mount("#app");
    const input = screen.getByTestId("1");
    expect(input === document.activeElement).toBe(true);
  });
});

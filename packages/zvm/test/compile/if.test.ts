import { screen } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("model", () => {
  it("input textarea", () => {
    document.body.innerHTML = `
      <div id="app" >
        <button z-on:click="handleBtnClick"  data-testid="1">显示/隐藏</button>
        <div z-if="isShow"  data-testid="2">z-if</div>
        <div z-else  data-testid="3">else</div>
      </div>
    `;
    createApp({
      template: "#app",
      data() {
        return {
          isShow: true,
        };
      },
      methods: {
        handleBtnClick() {
          this.isShow = !this.isShow;
        },
      },
    }).mount("#app");
    const btn = screen.getByTestId("1");
    const ifEl = screen.getByTestId("2");
    const elseEl = screen.getByTestId("3");
    expect(ifEl.style.display).toEqual("block");
    expect(elseEl.style.display).toEqual("none");
    btn.click();
    expect(ifEl.style.display).toEqual("none");
    expect(elseEl.style.display).toEqual("block");
  });
});

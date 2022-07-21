import { screen } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("bind directive", () => {
  it("on&bind", () => {
    document.body.innerHTML = `
      <div id="app">
        <div z-bind:class="className" data-testid="1"></div>
        <div z-bind:class="{pointerEventsNone: isDisable}" data-testid="2"></div>
        <button
        z-on:click="handleBtnClick($event)"
        type="button"
        data-testid="3"
      >
        点击使旁边的按钮失效/恢复
      </button>
      <button
        z-on:click="isDisable = !isDisable"
        type="button"
        data-testid="4"
      >
        点击使旁边的按钮失效/恢复
      </button>
      </div>
    `;
    createApp({
      template: "#app",
      data: () => {
        return { className: "red", isDisable: true };
      },
      methods: {
        handleBtnClick(e: MouseEvent) {
          this.isDisable = !this.isDisable;
          e.stopPropagation();
        },
      },
    }).mount("#app");
    const target1 = screen.getByTestId("1");
    const target2 = screen.getByTestId("2");
    const target3 = screen.getByTestId("3");
    const target4 = screen.getByTestId("4");

    expect(target1.className).toEqual("red");
    expect(target2.className).toEqual("pointer-events-none");
    target3.click();
    expect(target2.className).toEqual("");
    target4.click();
    expect(target2.className).toEqual("pointer-events-none");
  });
});

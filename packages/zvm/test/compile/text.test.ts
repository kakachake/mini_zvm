import { screen } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("bind directive", () => {
  it("text", () => {
    document.body.innerHTML = `
      <div id="app">
        <div z-text="text" data-testid="1"></div>
        <div data-testid="2">{{text}}</div>
      </div>
    `;
    createApp({
      template: "#app",
      data: () => {
        return { text: "this is a text." };
      },
    }).mount("#app");
    const target1 = screen.getByTestId("1");
    const target2 = screen.getByTestId("2");

    expect(target1.innerHTML).toEqual("this is a text.");
    expect(target2.innerHTML).toEqual("this is a text.");
  });
});

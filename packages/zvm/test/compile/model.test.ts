import { screen, fireEvent } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("model", () => {
  it("input textarea", () => {
    document.body.innerHTML = `
      <div id="app">
        <input placeholder="输入试试" type="text" z-model="text"  data-testid="1"/>
        <textarea name="" id="" cols="30" rows="10" z-model="text" data-testid="2"></textarea>
      </div>
    `;
    createApp({
      template: "#app",
      data: () => {
        return { text: "this is a text." };
      },
    }).mount("#app");
    const target1: HTMLInputElement = screen.getByTestId("1");
    const target2: HTMLInputElement = screen.getByTestId("2");
    expect(target1.value).toEqual("this is a text.");
    expect(target2.value).toEqual("this is a text.");
    fireEvent.input(target1, { target: { value: "this is a change text." } });
    expect(target1.value).toEqual("this is a change text.");
    expect(target2.value).toEqual("this is a change text.");
    fireEvent.input(target2, { target: { value: "this is a change text_2." } });
    expect(target1.value).toEqual("this is a change text_2.");
    expect(target2.value).toEqual("this is a change text_2.");
  });
});

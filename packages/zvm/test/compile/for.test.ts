import { screen } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("model", () => {
  it("input textarea", () => {
    document.body.innerHTML = `
      <div id="app"  data-testid="1">
        <ul>
          <li z-for="(item,index) in items" class="forLi">
            <div>点击试试</div>
            <div>{{item.msg}}</div>
            <div>{{index}}</div>
            <div>{{parentData}}</div>
          </li>
        </ul>
        <button z-on:click="handleAddItem" data-testid="2">addItem</button>
      </div>
    `;
    createApp({
      template: "#app",
      data: () => {
        return {
          parentData: "外层data",
          items: [
            {
              msg: "111",
            },
            {
              msg: "222",
            },
            {
              msg: "333",
            },
          ],
        };
      },
      methods: {
        handleAddItem() {
          this.parentData += "1";
          this.items.push({
            msg: "新增的数据",
          });
        },
      },
    }).mount("#app");
    const appEl = screen.getByTestId("1");
    const btn = screen.getByTestId("2");
    expect(appEl.getElementsByClassName("forLi")).toHaveLength(3);
    btn.click();
    expect(appEl.getElementsByClassName("forLi")).toHaveLength(4);
  });
});

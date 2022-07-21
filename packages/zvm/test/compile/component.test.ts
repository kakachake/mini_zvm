import { screen } from "@testing-library/dom";
import { createApp } from "../../src/main";

describe("component", () => {
  it("component for, if", () => {
    document.body.innerHTML = `
      <div id="app" data-testid="1">
        <button z-on:click="addItem" data-testid="2">add item</button>
        <button-counter
          z-for="item in items"
          z-bind:item="item"
          z-on:addCount="add"
          z-bind:propcount="count"
        ></button-counter>
        <button-counter
          z-if="show"
          z-on:addCount="add"
          z-bind:propcount="count"
        ></button-counter>
        <button z-on:click="toggle" data-testid="3">toogleShow</button>
      </div>
    `;
    const app = createApp({
      template: "#app",
      data() {
        return {
          show: false,
          count: 0,
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
        add() {
          this.count++;
          console.log(this.count);
        },
        toggle() {
          this.show = !this.show;
          console.log(this.show);
        },
        addItem() {
          console.log("addItem");
          this.items.push({
            msg: "444",
          });
          console.log(this.items);
        },
      },
    });

    // 定义一个名为 button-counter 的新全局组件
    app.component("button-counter", {
      props: {
        propcount: {
          type: Number,
          default: 0,
        },
        item: {
          type: Object,
          default: {
            msg: 456,
          },
        },
      },
      data() {
        return {
          count: 0,
        };
      },
      methods: {
        add() {
          this.count++;
          this.$emit("addCount");
        },
      },
      render(h) {
        return h(`
        <div class="component">
          <button z-on:click="add" >
            You clicked me {{ count }} times.
          </button>
          <div>{{item.msg}}</div>
          {{propcount}}
        </div>
        `);
      },
    });

    app.mount("#app");

    const appEl = screen.getByTestId("1");
    const btn1 = screen.getByTestId("2");
    const btn2 = screen.getByTestId("3");
    expect(appEl.getElementsByClassName("component")).toHaveLength(3);
    btn1.click();
    expect(appEl.getElementsByClassName("component")).toHaveLength(4);
    btn2.click();
    expect(appEl.getElementsByClassName("component")).toHaveLength(5);
  });
});

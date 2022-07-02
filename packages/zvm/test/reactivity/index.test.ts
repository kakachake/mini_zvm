import {
  reactive,
  effect,
  watch,
  shallowReactive,
  computed,
} from "../../src/main";

describe("响应式测试-reactive", () => {
  it("effect-lazy", () => {
    const obj = reactive({
      a: 1,
      b: 2,
    });

    effect(
      () => {
        expect(obj.a).toBe(2);
      },
      {
        lazy: true,
      }
    );
    obj.a = 2;
  });
  it("watch", () => {
    const obj = reactive({
      a: 1,
      b: 2,
    });

    watch(
      () => obj.a,
      (newVal, oldVal) => {
        expect(newVal).toBe(2);
        expect(oldVal).toBe(1);
      }
    );
    obj.a = 2;
  });
  it("watch", () => {
    const obj = reactive({
      a: 1,
      b: 2,
    });

    watch(
      () => obj.a,
      (newVal, oldVal) => {
        expect(newVal).toBe(2);
        expect(oldVal).toBe(1);
      }
    );
    obj.a = 2;
  });
  it("has", () => {
    const arr = reactive([1, 2, 3]);

    effect(
      () => {
        expect(3 in arr).toBe(true);
        expect(arr.has(4)).toBe(true);
        for (const i in arr) {
          expect(arr[i]).toBe(i + 1);
        }
      },
      {
        lazy: true,
      }
    );
    arr.push(4);
  });
  it("has, ownkeys", () => {
    let count = 1;
    const arr = reactive([1, 2, 3]);

    effect(() => {
      if (count === 1) {
        expect(3 in arr).toBe(false);

        for (const i in arr) {
          expect(arr[i]).toBe(1 + +i);
        }
      } else {
        expect(3 in arr).toBe(true);
        for (const i in arr) {
          expect(arr[i]).toBe(1 + +i);
        }
      }
      count++;
    });
    arr.push(4);
  });
  it("delete obj", () => {
    const obj = reactive({
      a: 1,
      b: 2,
      c: {
        d: 3,
      },
    });
    watch(
      () => obj.c,
      (newVal) => {
        expect("d" in newVal).toBe(true);
      }
    );

    delete obj.c.d;
  });
  it("delete arr", () => {
    const arr = reactive([1, 2, 3]);

    watch(
      () => arr[1],
      (newVal, oldVal) => {
        expect(newVal).toBe(undefined);
        expect(oldVal).toBe(2);
      }
    );
    delete arr[1];
  });
  it("避免重复代理", () => {
    const obj = {
      a: 1,
    };
    const proxyObj = reactive(obj);
    const obj2 = reactive({
      a: 1,
      b: 2,
      c: {
        d: 3,
      },
      obj,
    });

    watch(obj2.obj, (newVal) => {
      expect(newVal.a).toBe(2);
    });
    proxyObj.a = 2;
  });
  it("浅响应", () => {
    const obj2 = shallowReactive({
      a: 1,
      b: 2,
      c: {
        d: 3,
      },
    });
    effect(() => {
      expect(obj2.a).toBe(1);
      expect(obj2.b).toBe(2);
      expect(obj2.c.d).toBe(3);
    });
    expect(obj2.c.__isProxy__).toBe(undefined);
  });
  it("计算属性", () => {
    const obj2 = reactive({
      a: 1,
      b: 2,
    });
    const computedAPlusB = computed(() => {
      return obj2.a + obj2.b;
    });
    watch(
      () => computedAPlusB.value,
      (newVal) => {
        expect(newVal).toBe(4);
      }
    );
    obj2.a = 2;
  });
});

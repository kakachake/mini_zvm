import {
  reactive,
  effect,
  watch,
  shallowReactive,
  computed,
  ref,
  toRefs,
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
    expect(Object.prototype.hasOwnProperty.call(obj2.c, "__isProxy__")).toBe(
      false
    );
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

  it("set,map - add, delete", () => {
    const s = new Set([1, 2, 3]);
    const m = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const ps = reactive(s);
    const pm = reactive(m);
    watch(
      () => {
        return ps.size;
      },
      (newVal) => {
        expect(newVal).toEqual(4);
      }
    );
    watch(
      () => {
        return pm.size;
      },
      (newVal) => {
        expect(newVal).toEqual(1);
      }
    );
    ps.add(4);
    pm.delete("a");
  });
  it("Set,Map-get, set", () => {
    const p = reactive(new Map([["key", 1]]));
    let i = 1;
    effect(() => {
      expect(p.get("key")).toBe(i);
      i++;
    });
    p.set("key", 2);
  });

  it("Set,Map-原始值污染", () => {
    const m = new Map();
    const p1 = reactive(m);
    const p2 = reactive(new Map());
    p1.set("p2", p2);
    effect(() => {
      expect(p1.get("p2").size).toBe(0);
    });
    m.get("p2").set("foo", "bar");
  });

  it("Set,Map-forEach1", () => {
    const m = reactive(new Map([["3", new Set([1, 2, 3])]]));
    let i = 1;
    effect(() => {
      m.forEach((value: any, key: string, m: object) => {
        if (i === 1) {
          expect(key).toBe("3");
          expect(value.size).toEqual(3);
          expect(m).toBe(m);
        } else {
          expect(key).toBe("3");
          expect(value.size).toEqual(4);
          expect(m).toBe(m);
        }
        i++;
      });
    });
    m.get("3").add(4);
  });

  it("Set,Map-forEach2", () => {
    const m = reactive(new Map([["3", 1]]));
    let i = 1;
    effect(() => {
      m.forEach((value: any) => {
        i === 1 ? expect(value).toEqual(1) : expect(value).toEqual(3);
        i++;
      });
    });
    m.set("3", 3);
  });

  it("Set,Map - 迭代器", () => {
    const p = reactive(
      new Map([
        ["key", 1],
        ["key2", 2],
      ])
    );
    let i = 1;
    effect(() => {
      // console.log(p[Symbol.iterator]());
      for (const [key, value] of p) {
        console.log(key, value);
      }
      if (i === 1) {
        expect(p.size).toBe(2);
      } else {
        expect(p.size).toBe(3);
      }
      i++;
    });
    p.set("key3", "3");
  });

  it("Set,Map - 迭代器keys", () => {
    const p = reactive(
      new Map([
        ["key1", 1],
        ["key2", 2],
      ])
    );
    let i = 0;
    effect(() => {
      // console.log(p[Symbol.iterator]());
      for (const value of p.keys()) {
        console.log(value);
      }
      i++;
    });
    p.set("key2", "3");
    setTimeout(() => {
      expect(i).toBe(1);
    }, 0);
  });

  it("Set,Map - 迭代器keys", () => {
    const p = reactive(
      new Map([
        ["key1", 1],
        ["key2", 2],
      ])
    );
    let i = 0;
    effect(() => {
      // console.log(p[Symbol.iterator]());
      for (const value of p.values()) {
        console.log(value);
      }
      i++;
    });
    p.set("key2", "3");
    setTimeout(() => {
      expect(i).toBe(2);
    }, 0);
  });

  it("ref", () => {
    const refVal = ref(1);
    let i = 1;
    effect(() => {
      expect(refVal.value).toBe(i);
      i++;
    });
    refVal.value = 2;
  });

  it("toRef, toRefs", () => {
    const obj = reactive({
      a: 1,
      b: 2,
    });

    const _obj: any = {
      ...toRefs(obj),
    };
    let i = 1;
    effect(() => {
      if (i === 1) {
        expect(_obj.a.value).toBe(1);
        expect(_obj.b.value).toBe(2);
      } else {
        expect(_obj.a.value).toBe(2);
        expect(_obj.b.value).toBe(2);
      }
      i++;
    });
    obj.a = 2;
  });
});

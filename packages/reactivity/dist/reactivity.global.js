var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactivity: () => reactivity
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var ReactiveEffect = class {
    // 收集effect中使用到的属性 用于后续清理
    constructor(fn) {
      this.fn = fn;
      this.active = true;
      this.parent = void 0;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        this.fn();
      } else {
        try {
          this.parent = activeEffect;
          activeEffect = this;
          this.fn();
        } finally {
          activeEffect = this.parent;
          this.parent = void 0;
        }
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    if (activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = /* @__PURE__ */ new Set());
      }
      let shouldTrack = !dep.has(activeEffect);
      if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
      }
    }
  }
  function trigger(target, key, value) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    const effects = depsMap.get(key);
    effects && effects.forEach((effect2) => {
      if (effect2 !== activeEffect) {
        effect2.run();
      }
    });
  }

  // packages/shared/src/index.ts
  var isObj = (val) => {
    return typeof val === "object" && val !== null;
  };

  // packages/reactivity/src/baseHandler.ts
  var baseHandler = {
    get(target, key, receiver) {
      track(target, key);
      if (key === "__v_isReacivity" /* IS_REACIVITY */) {
        return true;
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldVal = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (oldVal !== value) {
        trigger(target, key, value);
      }
      return result;
    }
  };

  // packages/reactivity/src/reactivity.ts
  var reactivityMap = /* @__PURE__ */ new WeakMap();
  function reactivity(target) {
    if (!isObj(target)) {
      return target;
    }
    if (target["__v_isReacivity" /* IS_REACIVITY */]) {
      return target;
    }
    const isExist = reactivityMap.get(target);
    if (isExist) {
      return isExist;
    }
    const proxyTarget = new Proxy(target, baseHandler);
    reactivityMap.set(target, proxyTarget);
    return proxyTarget;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map

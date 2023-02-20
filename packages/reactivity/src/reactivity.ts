import { isObj } from "@vue/shared";

const enum ReactivityFlags {
  IS_REACIVITY = '__v_isReacivity'
}

// 存储代理过的对象
const reactivityMap = new WeakMap()

export function reactivity(target) {
  if(!isObj(target)) {
    return target
  }

  // 判断传入的对象是否是已经被代理过了
  if(target[ReactivityFlags.IS_REACIVITY]) {
    // 下次在进来的时候会触发get方法，因为此时的target已经是代理对象了
    return target
  }

  const isExist = reactivityMap.get(target)
  if(isExist) {
    return isExist
  }

  const proxyTarget = new Proxy(target, {
    get(target, key, receiver) {
      console.log('执行get方法了');
      console.log('key', key);
      // 再次传入target为代理对象时候返回true, 当到达16行时候就会if(true) return target了
      if(key === ReactivityFlags.IS_REACIVITY) {
        return true
      }
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) { 
      console.log('执行set方法了');
      console.log('key', key);
      return Reflect.set(target, key, value, receiver)
    }
  })
  reactivityMap.set(target, proxyTarget)
  return proxyTarget
}

import { isObj } from "@vue/shared";
import { ReactivityFlags, baseHandler } from "./baseHandler";


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

  const proxyTarget = new Proxy(target, baseHandler)
  reactivityMap.set(target, proxyTarget)
  return proxyTarget
}

import { track, trigger } from "./effect"

export const enum ReactivityFlags {
  IS_REACIVITY = '__v_isReacivity'
}

export const baseHandler = {
  get(target, key, receiver) {
    // 关联属性和effect的方法
    track(target, key)
    // 再次传入target为代理对象时候返回true, 当到达16行时候就会if(true) return target了
    if(key === ReactivityFlags.IS_REACIVITY) {
      return true
    }
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) { 
    // 触发更新
    const oldVal = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if(oldVal !== value) {
      trigger(target, key, value)
    } 
    return result
  }
}


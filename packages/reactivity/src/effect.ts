
// 当前正在执行的effect
export let activeEffect = undefined;

class ReactiveEffect {
  public active = true
  public parent = undefined
  public deps = []; // 收集effect中使用到的属性 用于后续清理
  constructor(public fn) {}
  run() {
    if(!this.active) {
      this.fn()
    } else {
      try {
        this.parent = activeEffect
        activeEffect = this
        this.fn()
      } finally {
        activeEffect = this.parent
        this.parent = undefined
      }
    }
  }
}

// 我们希望的是如果 代理对象的属性更新了，我们就重新触发effect
// 所以我们应该解决如何收集effect关联的依赖以及如何触发effect
// 在proxy中就可以拦截属性，所以可以将effect暴露出去在proxy执行


// 如何关联 属性和effect
// 执行effect的时候会触发run，这时候我们在run函数中暴露出去effect，在fn触发的时候，如果使用了proxy属性会再触发set方法，
// 于是我们可以在set中引入activeEffect再和对应的key关联起来就可以了
// 下面这种情况会有问题，创建了两个effect，每次effect之后会设置activeEffect为undefined，最后state.address就没有关联的effect了
// effect(() => {
//   state.name
//   effect(() => {
//     state.age
//   })
//   state.address
// })
// 为了解决上述问题，我们可以设置个parent属性用来关联


export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}


// 现在我们知道的是 哪个对象 哪个对象中的哪个属性 对应的effect
//  { obj: {key: [effect1, effect2], name: [effect1, effect2]} }
// 数据结构就是 Map([ obj, Map(key, Set) ])

const targetMap = new WeakMap()
export function track(target, key) {
  if(activeEffect) {
    // 依赖收集 属性对应 => effect  我们也需要 effect记录对应的属性 于是在ReactiveEffect中添加个属性deps
    let depsMap = targetMap.get(target); 
    if(!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack) {
      dep.add(activeEffect)
      // effect关联属性 在ReactiveEffect中的deps中添加
      activeEffect.deps.push(dep)
    }
  }

}

export function trigger(target, key, value?) {
  const depsMap = targetMap.get(target)
  if(!depsMap) {
    return
  }
  const effects = depsMap.get(key)
  // effect(() => {
  //   app.innerHTML = `大家好,我是${state.name},${state.age}, ${state.address}`
  //   state.age = Math.random()
  // })
  effects && effects.forEach(effect => {
    // 防止死循环
    if(effect !== activeEffect) {
      effect.run()
    }
  })
}

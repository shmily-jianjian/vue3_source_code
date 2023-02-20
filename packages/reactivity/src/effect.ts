
class ReactiveEffect {
  public active = true
  constructor(public fn) {}
  run() {
    this.fn()
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
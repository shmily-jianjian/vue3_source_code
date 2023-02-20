// import { isObj } from "@vue/shared";

const person = {
  name: 'xiaojin',
  getName() {
    return this.name + 'love jianjian'
  }
}

const newPerson = reactivity(person)
newPerson.name = 'jianjian'
console.log(newPerson, 2222);
console.log(newPerson.getName, 1111);

 function reactivity(target) {
  // if(!isObj(target)) {
  //   return target
  // }

  const proxyTarget = new Proxy(target, {
    get(target, key, receiver) {
      console.log('执行get方法了');
      console.log('key', key);
      return target
    },
    set(target, key, value, receiver) { 
      console.log('执行set方法了');
      console.log('key', key);
      return true
    }
  })

  return proxyTarget
}

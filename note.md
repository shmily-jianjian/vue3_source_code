### 搭建mononorepo环境
```bash
1 根目录下新建文件 pnpm-workspace.yaml
  packages
    - "packages/*"
2 下载vue3发现使用pnpm下载的在node_modules下和npn下载的是不一样的展示
  pnpm下载的vue所依赖的包在.pnpm文件夹下，在项目中我们是不能直接引入的, 可以通过以下方式解决
  新建文件.npmrc => 加上 shamefully-hoist = true, 然后重新下载就可以了，这时候发现vue依赖的包都在node_modules下了拍平了
```

### process.argv
```bash
process是node中的一个模块，通过访问process.argv我们能轻松愉快的接收通过命令执行node程序时候所传入的参数。
例如执行 
  - node demo.js --name=jianjian
  - 这时候 console.log(process.argv);
  - [
    '/opt/homebrew/Cellar/node/18.11.0/bin/node',
    '/Users/jianjian/Desktop/demo/demo.js',
    '--name=jinajian'
  ]
  - 这三个参数是node.exe绝对路径 node所执行文件的绝对路径 以及我们自己在后面自己加的
  - 所以我们一般  console.log(process.argv.slice(2));
```

### mimimist用来解析命令行参数
```js
const res = mimimist(process.argv.slice(2), {})
console.log(res.name); // jianjian
```

### execa
```js
const { execa } = await import('execa')
const { stdout } = await execa('mkdir', ['jianjian'])
console.log({ stdout })
// 可以执行 mkdir jianjian这个命令
```

### monorepo环境下如何将本地的一个包下载以来另一个模块的包(这就是pnpm能很方便实现monorepo环境的一个原因之一)
```js
pnpm install @vue/shared@workspace --filter @vue/reactivity
// 这个表示在 @vue/reactivity 依赖 @vue/shared@workspace，也就是将@vue/shared@workspace下载到 @vue/reactivity
// 一般用于本地调试
```
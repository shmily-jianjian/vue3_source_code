// 打包配置

const minimist = require('minimist')
const path = require('path')
const { context } = require('esbuild')
const fs = require('fs')

const args = minimist(process.argv.slice(2), {})

const target = args._[0] || 'reactivity'

const format = args.f || 'global'

const entry = path.resolve(__dirname, `../packages/${target}/src/index.ts`)

const outputFormat = format.startsWith('global')// 输出的格式
    ? 'iife'
    : format === 'cjs'
        ? 'cjs'
        : 'esm'

const outputFile = path.resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

const globalName = require(path.resolve(__dirname, `../packages/${target}/package.json`)).buildOptions?.name

const distDIr = path.resolve(__dirname, `../packages/${target}/dist`)

run()


async function run() {
  // if (fs.existsSync(distDIr)) {
  //    fs.rm(`${distDIr}`, {recursive: true}, async(err) => {
  //    })
  // }

  await context({
    entryPoints: [entry],
    outfile: outputFile,
    bundle: true,
    sourcemap: true,
    globalName,
    format: outputFormat,
    platform: format === 'cjs' ? 'node' : 'browser',
  }).then((ctx) => {
    ctx.watch()
    console.log('构建监听中...')
  })
}

#!/usr/bin/env node
let minimist = require('minimist')
let chalk = require('chalk')
let argv = minimist(process.argv.slice(2))
let Api = require('./api')
let { version } = require('./package.json')

let api = new Api()
let h = argv.h || argv.help
let v = argv.v || argv.version
let [_1] = argv._

if (v) {
  console.log(chalk.gray(version))
}
else if (h) {
  console.log(chalk.gray('See https://github.com/fritx/wxchangba-cli'))
}
else if (!_1) {
  ;(async () => {
    while (true) {
      await api.playRandom()
      await delay(5000)
    }
  })()
}
else if (_1 === 'random') {
  api.playRandom()
}
else {
  let id = _1
  api.playFromId(id)
}

async function delay (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

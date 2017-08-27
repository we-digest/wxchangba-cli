let s2p = require('stream-to-promise')
let request = require('request')
let chalk = require('chalk')
let lame = require('lame')

// Switch from deprecated Carbon Component API ...
// https://github.com/TooTallNate/node-speaker/pull/86
let Speaker = require('speaker')

let baseUrl = 'http://changba.wx.fritx.me'

module.exports = class Api {
  async playFromId (id) {
    let songUrl = `${baseUrl}/song/${id}`
    console.log(chalk.gray(`songUrl: ${songUrl}`))

    let mediaName = await this.fetchMedia(songUrl)
    let audioUrl = `${baseUrl}/${mediaName}`
    console.log(chalk.gray(`audioUrl: ${audioUrl}`))

    await this.playAudio(audioUrl)
    console.log(chalk.gray('Finished playing'))
  }

  async playRandom () {
    let id = await this.fetchRandomId()
    await this.playFromId(id)
  }

  async fetchRandomId () {
    let r = Math.random()
    let url = `${baseUrl}/song/random?r=${r}`
    let id = await new Promise((resolve, reject) => {
      request(url, { followRedirect: false })
        .on('error', reject)
        .on('response', res => {
          let { location } = res.headers
          resolve(location)
        })
    })
    return id
  }

  async fetchMedia (url) {
    let stream = request(url)
    let buffer = await s2p(stream)
    let mediaUrl = buffer.toString().match(/ src="(.+?)"><\/audio>/)[1]
    return mediaUrl
  }

  async playAudio (url) {
    let stream = request(url)
      .pipe(new lame.Decoder())
      .pipe(new Speaker())
    await s2p(stream)
  }
}

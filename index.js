const debug = require('debug')('vue-cli-plugin-p11n:service')

module.exports = (api, options) => {
  debug('options', options)

  api.registerCommand('build', {
    description: 'build for production with rollup',
    usage: 'vue-cli-service build [options] [entry|pattern]',
    options: {
    }
  }, async args => {
    const path = require('path')
    const { existsSync, mkdirSync } = require('fs')
    const getAllEntries = require('./entry')
    const bundle = require('./bundle')
    const banner = require('./banner')
    const { version, name, author, license } = require(path.join(process.cwd(), './package.json'))
    const lang = args.lang || 'js'

    if (!existsSync('dist')) {
      mkdirSync('dist')
    }

    let config = null
    let runtime = null
    if (lang === 'ts') {
      config = path.join(process.cwd(), './tsconfig.json')
      runtime = path.join(process.cwd(), './node_modules/typescript')
    }

    const entries = getAllEntries(
      { name, version }, 
      { entry: `src/plugin.${lang}`, dest: process.cwd() },
      banner({
        name,
        version,
        author: (author && author.name) || '',
        year: new Date().getFullYear(),
        license: license || 'ISC'
      }),
      { lang, config, runtime }
    )
    bundle(entries)
  })
}

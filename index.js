const fs = require('fs-extra')
const filter = require('lodash/filter')
const includes = require('lodash/includes')
const isString = require('lodash/isString')
const isFunction = require('lodash/isFunction')
const { extname } = require('path')

function InjectHtmlWebpackPlugin(options) {
  this.options = options
  options.chunks = options.chunks || []
  options.more = options.more || {}
  options.auto = options.auto || false
  options.startJS = options.startJS || '<!-- start:js -->'
  options.endJS = options.endJS || '<!-- end:js -->'
  options.startCSS = options.startCSS || '<!-- start:css -->'
  options.endCSS = options.endCSS || '<!-- end:css -->'
  options.transducer = options.transducer || ''
  options.custom = options.custom || []
  this.runing = false
}

function assetsOfChunks(chunks, selected) {
  let assets = {
    js: [],
    css: []
  }
  filter(chunks, chunk => includes(selected, chunk.name)).forEach(chunk => {
    chunk.files.forEach(file => {
      let ext = extname(file).replace('.', '')
      assets[ext] && assets[ext].push(file)
    })
  })
  return assets
}

function injectWithinByIndentifier(
  html,
  startIdentifier,
  endIdentifier,
  content,
  purified
) {
  let start = html.indexOf(startIdentifier),
    end = html.indexOf(endIdentifier)
  if (start < 0 || end < 0) {
    return html
  }
  let previousInnerContent = html.substring(start + startIdentifier.length, end)
  let indent = leadingWhitespace(previousInnerContent)
  indent = indent.replace(/(\n[\s|\t]*\r*\n)/g, '\n')
  let injected = Array.isArray(content) ? content.slice() : [content]
  purified
    ? injected.unshift(html.substr(0, start))
    : injected.unshift(html.substr(0, start + startIdentifier.length))
  purified
    ? injected.push(html.substr(end + endIdentifier.length))
    : injected.push(html.substr(end))
  return injected.join(indent)
}

function injectWithin(html, content, head = true) {
  let before = head ? html.indexOf('</head>') : html.indexOf('</body>')
  if (before < 0) return html
  let injected = Array.isArray(content) ? content.slice() : [content]
  injected.unshift(html.substr(0, before))
  injected.push(html.substr(before))
  return injected.join('\n')
}

function applyTransducer(originURL, transducer) {
  let url = originURL
  if (typeof transducer === 'string') {
    url = transducer + originURL
  } else if (typeof transducer === 'function') {
    typeof transducer(originURL) === 'string' && (url = transducer(originURL))
  }
  return url
}

function leadingWhitespace(str) {
  return str.match(/^\s*/)[0]
}

InjectHtmlWebpackPlugin.prototype.apply = function(compiler) {
  let that = this
  let options = that.options
  let filename = options.filename
  let output =
    isString(options.output) || isFunction(options.output)
      ? options.output
      : false
  let purified = !!output
  let selected = options.chunks
  let more = options.more
  let transducer = options.transducer
  let autoInject = options.auto
  let startInjectJS = options.startJS,
    endInjectJS = options.endJS,
    startInjectCSS = options.startCSS,
    endInjectCSS = options.endCSS
  let customInject = options.custom
  let emit = function(compilation, callback = () => {}) {
    let chunks = compilation.chunks
    let html
    if (that.runing) {
      callback()
      return
    }
    if (!options.filename) {
      callback()
      return
    }
    let assets = assetsOfChunks(chunks, selected)

    let jsLabel = assets['js'].map(function(v) {
      return '<script src="' + applyTransducer(v, transducer) + '"></script>'
    })
    let cssLabel = assets['css'].map(function(v) {
      return (
        '<link rel="stylesheet" href="' + applyTransducer(v, transducer) + '"/>'
      )
    })
    if (more) {
      if (Array.isArray(more.js)) {
        for (let i = 0; i < more.js.length; i++) {
          jsLabel.unshift('<script src="' + more.js[i] + '"></script>')
        }
      }
      if (Array.isArray(more.css)) {
        for (var j = 0; j < more.css.length; j++) {
          cssLabel.unshift(
            '<link rel="stylesheet" href="' + more.css[j] + '"/>'
          )
        }
      }
    }
    if (isString(output) && output) {
      try {
        fs.copySync(filename, output)
        filename = output
      } catch (e) {
        compilation.errors.push(
          new Error('InjectHtmlWebpackPlugin copy filename to output failed')
        )
      }
    }
    try {
      html = fs.readFileSync(filename, 'utf8')
    } catch (e) {
      compilation.errors.push(
        new Error('InjectHtmlWebpackPlugin read filename failed')
      )
      callback()
      return
    }

    function injector(html) {
      if (autoInject) {
        html = injectWithin(html, jsLabel, false)
        html = injectWithin(html, cssLabel)
      } else {
        html = injectWithinByIndentifier(
          html,
          startInjectJS,
          endInjectJS,
          jsLabel,
          purified
        )
        html = injectWithinByIndentifier(
          html,
          startInjectCSS,
          endInjectCSS,
          cssLabel,
          purified
        )
      }
  
      customInject.forEach(function(inject) {
        let startIdentifier = inject.start,
          endIdentifier = inject.end,
          content = inject.content
        if (!startIdentifier || !endIdentifier) {
          return
        }
        html = injectWithinByIndentifier(
          html,
          startIdentifier,
          endIdentifier,
          content,
          purified
        )
      })
      return html
    }
    if (isFunction(output)) {
      output(filename, injector)
    } else {
      fs.writeFileSync(filename, injector(html))
    }
    that.runing = true
    callback()
  }
  if (compiler.hooks) {
    compiler.hooks.emit.tap('InjectHtmlWebpackPlugin', emit)
  } else {
    compiler.plugin('emit', emit)
  }
}

module.exports = InjectHtmlWebpackPlugin

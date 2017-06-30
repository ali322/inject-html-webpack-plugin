inject-html-webpack-plugin [![Build Status](https://travis-ci.org/ali322/inject-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/ali322/inject-html-webpack-plugin) [![npm version](https://badge.fury.io/js/inject-html-webpack-plugin.svg)](https://badge.fury.io/js/inject-html-webpack-plugin)
===
[![NPM](https://nodei.co/npm/inject-html-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/inject-html-webpack-plugin/)

inspired by [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin),simple and efficient Webpack plugin that inject script label and style links into your html

Install
===

```javascript
npm install inject-html-webpack-plugin --save--dev
```

Usage
===

add plugin in your webpack.config.js

```javascript
var InjectHtmlPlugin = require('inject-html-webpack-plugin')

module.exports = {
    entry:{
        index:"./index.js"
    },
    module:{
        loaders:[
            ...
        ]
    },
    output:{
        path:'./dist',
        filename:'[name].min.js'
    },
    plugins:[
        new InjectHtmlPlugin({
            filename:'./index.html',
            chunks:['index'],
            processor:"http://cdn.example.com",
            customInject:[{
                start:'<!-- start:bundle-time -->',
                end:'<!-- end:bundle-time -->',
                content:Date.now()
            }]
        })
    ]
}
```

then add below placeholders into html file

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <!-- start:css -->
  <!-- end:css -->
  <!-- start:bundle-time -->
  <!-- end:bundle-time -->
</head>
<body>
  <!-- start:js -->
  <!-- end:js -->
</body>
</html>
```

Plugin Options
===

- **transducer**: apply transducer to injected files,accept string to prepended or function that receive file path and return url string
- **filename**: html file path which injected 
- **chunks**: injected array of chunks
- **startInjectJS**: start indentifier where to inject script labels,(eg: <!-- start:js -->)
- **endInjectJS**: end indentifier where to inject script labels,(eg: <!-- end:js -->)
- **startInjectCSS**: start indentifier where to inject style links,(eg: <!-- start:css -->)
- **endInjectCSS**: end indentifier where to inject style links,(eg: <!-- end:css -->)
- **customInject**: array of custom inject,like bundle time,accept objects contains below key/values,
    + start: inject start identifier
    + end: inject end identifier
    + content: injected content

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

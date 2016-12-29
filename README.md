inject-html-webpack-plugin [![npm version](https://badge.fury.io/js/inject-html-webpack-plugin.svg)](https://badge.fury.io/js/inject-html-webpack-plugin)
===
[![NPM](https://nodei.co/npm/inject-html-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/inject-html-webpack-plugin/)

inspired by [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin),simple and efficient Webpack plugin that nject script label and style links into your html

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
            prefixURI:"http://cdn.example.com"
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
</head>
<body>
  <!-- start:js -->
  <!-- end:js -->
</body>
</html>
```

Plugin Options
===

- **prefixURI**: prefix uri string prepend to assets,like js,css
- **filename**: html file path which injected 
- **chunks**: injected array of chunks
- **startInjectJS**: start indentifier where to inject script labels,(eg: <!-- start:js -->)
- **endInjectJS**: end indentifier where to inject script labels,(eg: <!-- end:js -->)
- **startInjectCSS**: start indentifier where to inject style links,(eg: <!-- start:css -->)
- **endInjectCSS**: end indentifier where to inject style links,(eg: <!-- end:css -->)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

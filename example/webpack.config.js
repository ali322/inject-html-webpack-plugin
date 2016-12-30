var ExtractTextPlugin = require('extract-text-webpack-plugin')
var InjectHtmlPlugin = require("../")

module.exports = {
    entry:{
        'main':["./main.js","./main.less"]
    },
    module:{
        loaders:[
            {
                test:/\.js$/,
                loader:'babel'
            },
            {
                test:/\.less$/,
                loader:ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test:/\.(jpg|png)$/,
                loader:'url?limit=500'
            }
        ]
    },
    resolve:{
        extensions:["",".js",".less"]
    },
    output:{
        path:"dist",
        filename:"[name]-[hash].js"
    },
    plugins:[
        new ExtractTextPlugin("[name]-[hash].css"),
        new InjectHtmlPlugin({
            filename:"./main.html",
            chunks:["main"],
            customInject:[
                {
                    start:"<!-- start:bundle-time -->",
                    end:"<!-- end:bundle-time -->",
                    content:Date.now()
                },
                {
                    start:"<!-- start:other-script -->",
                    end:"<!-- end:other-script -->",
                    content:"<script type='text/template'><p>template</p></script>"
                }
            ]
        })
    ]
}
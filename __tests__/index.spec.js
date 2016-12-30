import test from 'ava'
import webpack from 'webpack'
import path from 'path'
import InjectHtmlPlugin from "../"
import fs from 'fs'

const OUTPUT_PATH = path.join(__dirname,"fixtures","dist")
const INJECT_HTML = path.join(__dirname,'fixtures','test.html')


test.cb('should inject html file',t=>{
    var compiler = webpack({
        entry:{
            main:path.join(__dirname,'fixtures','entry.js')
        },
        module:{
            loaders:[{
                test:/\.js$/,
                loader:'babel'
            }]
        },
        output:{
            path:OUTPUT_PATH,
            filename:"[name].min.js"
        },
        plugins:[
            new InjectHtmlPlugin({
                filename:INJECT_HTML,
                chunks:['main']
            })
        ]
    },(err,stats)=>{
        t.ifError(err,'err is null')
        const _html = fs.readFileSync(INJECT_HTML,'utf8')
        const _index = _html.indexOf('<script src="main.min.js"></script>')
        t.true(_index > 0,'found injected')
        t.end()
    })
})
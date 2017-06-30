let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let expect = require('chai').expect
let InjectHtmlPlugin = require('../')

const OUTPUT_PATH = path.join(__dirname, "fixtures", "dist")
const INJECT_HTML = path.join(__dirname, 'fixtures', 'test.html')

describe('Inject Html Plugin', () => {
    it('should inject html file correctly', done => {
        let compiler = webpack({
            entry: {
                main: path.join(__dirname, 'fixtures', 'entry.js')
            },
            output: {
                path: OUTPUT_PATH,
                filename: "[name].min.js"
            },
            plugins: [
                new InjectHtmlPlugin({
                    filename: INJECT_HTML,
                    chunks: ['main']
                })
            ]
        }, (err, stats) => {
            expect(err).to.equal(null)
            let html = fs.readFileSync(INJECT_HTML, 'utf8')
            let index = html.indexOf('<script src="main.min.js"></script>')
            expect(index).to.be.above(0)
            done()
        })
    })
})
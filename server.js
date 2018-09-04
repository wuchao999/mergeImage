var http = require('http')
var fs = require('fs')
var url = require('url')

const server = http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname
    // console.log(`pathname===${pathname}`)
    fs.readFile(pathname.substr(1), (err, data) => {
        // console.log(data)
        if (err) {
            console.log(err)
            res.writeHead(404)
        } else {

            res.writeHead(200, {
                'content-type': 'text/html'
            })
            res.write(data)
        }
        res.end()
    })
    
}).listen(8888)
console.log(`服务启动成功：运行在http://localhost:8888/index.html`)
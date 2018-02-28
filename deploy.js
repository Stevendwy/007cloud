var http = require('http')
var fs = require('fs')
var url = require('url')
 
http.createServer(function(req, res){
	if(req.url === "/favicon.ico" || req.url === "/js/jquery.min.map") return

	var pathname = url.parse(req.url).pathname
	var filename = pathname.substr(1)
    
 	fs.readFile(filename.length > 0 ? filename : 'index.html', (err, data) => {
 		if(err) console.log(err)
 		else {
 			res.writeHead(200, {'Content-Type': 'text/html'})
 			res.end(data.toString())
 		}
 	})
}).listen(3000, "localhost", () => {
//}).listen(3000, "10.154.192.33", () => {
	console.log("本地部署成功")
	//console.log("服务器运行在外网: http://118.89.171.180:3000/")
})

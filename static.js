var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html";
var DATA_DIR = "data";
http.createServer(function(req, res){
	var urlObj = url.parse(req.url, true, false);
	if (urlObj.pathname.indexOf("getcity") != -1) {
		console.log("In REST Service");
		fs.readFile(DATA_DIR + "/cities.dat.txt", function(err, data){
			if (err) throw err;
			cities = data.toString().split("\n");
			var regex = new RegExp("^"+urlObj.query["q"]);
			var jsonResult = [];
			for (var i = 0; i < cities.length; i++) {
				var result = cities[i].search(regex)
				if (result != -1) {
					console.log(cities[i]);
					jsonResult.push({city:cities[i]});
				}
			}
			console.log(jsonResult);
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(jsonResult));
		});
	} else {
		fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			
			if (urlObj.pathname.indexOf(".js") != -1) {
				res.writeHead(200, {"Content-Type": "text/javascript"});
			} else if (urlObj.pathname.indexOf(".css") != -1) {
				res.writeHead(200, {"Content-Type": "text/css"});
			} else {
				res.writeHead(200);
			}
			res.end(data);
		});
	}
}).listen(80);

var options = {
	hostname: 'localhost',
	port: '80',
	path: '/hello.html'
};
function handleResponse(response) {
	var serverData = '';
	response.on('data', function(chunk) {
		serverData += chunk;
	});
	response.on('end', function() {
		console.log(serverData);
	});
}
http.request(options, function(response){
	handleResponse(response);
}).end();

var express = require('express');
var fs = require('fs');
var htmlfiles="index.html";

var app = express.createServer(express.logger());
app.use(express.static(__dirname));
app.get('/', function(request, response) {
  stringToShow = fs.readFileSync('index.html', 'utf8');
  response.send(stringToShow);
  app.use(express.methodOverride());
  });

var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log("Listening on " + port);
});






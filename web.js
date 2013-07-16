var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World 2 !');
});
var fs = require('fs');
var outfile = "index.html"
fs.writeFileSync(outfile);
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Script: " +__filename + "\nWrote: " + out + "To: " + outfile);
});

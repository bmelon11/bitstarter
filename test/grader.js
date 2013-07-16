#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var CHECKSFILE_DEFAULT = "checks.json";
var HTMLFILE_DEFAULT = "index.html";
var HEROKUAPP_DEFAULT = "http://fierce-atoll-8925.herokuapp.com";

var assertFileExists = function(infile) {
  var instr = infile.toString();
  if(!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1);
  }
  return instr;
};

var cheerioHtmlFile = function(htmlfile) {
  return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
  $ = cheerioHtmlFile(htmlfile);

  var checks = loadChecks(checksfile).sort();
  var out = {};
  for(var check in checks) {
    var present = $(checks[check]).length > 0;
    out[checks[check]] = present;
  }
  return out;
};

var clone = function(fn) {
  return fn.bind({});
};

if(require.main == module) {
  program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-u, --url <url_to_app>', 'URL to heroku app')
    .option('-f, --file <html_file>', 'Path to index.html')
    .parse(process.argv);

  if(program.url) {
    var checkJson = rest.get(program.url).on('complete', function(result, response) {
      var out = {};
      if(result instanceof Error) {
	console.error('Error: ' + util.format(response.message));
      } 	
    else {
        $ = cheerio.load(result);
        var checks = loadChecks(program.checks).sort();
        for(var check in checks) {
          var present = $(checks[check]).length > 0;
          out[checks[check]] = present;
        }
      }
      //console.log(out);
      console.log(JSON.stringify(out, null, 4));
    });
  }
  else if(program.file) {
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
  }
}
else {
  exports.checkHtmlFile = checkHtmlFile;
}


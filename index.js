'use strict';

var fs = require('fs-extra'),
	path = require('path'),
	utils = require('./lib/frozen/utils');

var config = utils.readJsonSync('./config.json');

global.frozen = {
	appRoot: __dirname,
	config: config
};

var Frozen = require('./lib/frozen');
Frozen.init();

// run build
exports.build = function () {
	Frozen.build();	
};

// create http server
exports.server = function (port) {
	var frozen = global.frozen,
		Static = require('node-static');

	var fileServer = new Static.Server(path.relative(__dirname, frozen.pagesDir));

	port = port || 8000;

	require('http').createServer(function (request, response) {
	    request.addListener('end', function () {
	        
	        fileServer.serve(request, response)
				.addListener('error', function (err) {
					console.error("Error serving " + request.url + " - " + err.message);
				});

	    }).resume();

	}).listen(port);

	console.log('Server running at http://127.0.0.1:' + port);
};
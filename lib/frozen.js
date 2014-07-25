'use strict';

var fs = require('fs-extra'),
	path = require('path'),
	utils = require('./frozen/utils');

// init configuration
exports.init = function (options) {
	var frozen = global.frozen,
		appRoot = frozen.appRoot;

	var defaultConfig = {
		source: "./content",
		destination: "./pages",
		github: {
			username: "",
			password: ""
		}
	};

	var config = frozen.config = utils.extend(true, defaultConfig, frozen.config);
	//console.log(config);

	frozen = utils.extend(frozen, {
		contentDir: path.join(appRoot, config.source),
		pagesDir: path.join(appRoot, config.destination),
		tmplDir: path.join(appRoot, 'template'),
		cacheDir: path.join(appRoot, '.cache'),
		staticDir: path.join(appRoot, 'static')
	});
}

// build docs
var Build = require('./frozen/build');
exports.build = Build.build;

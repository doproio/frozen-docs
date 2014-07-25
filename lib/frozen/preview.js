'use strict';

var fs = require('fs-extra'),
	path = require('path'),
	jsdom = require('jsdom'),
	cheerio = require('cheerio'),
	Mustache = require('mustache'),
	utils = require('./utils'),
	frozen = global.frozen;

/**
 * Build Preview For Page
 * @param {String} filePath page path
 * @param {Function} callback success callback
 */
function BuildPreview (filePath, callback) {
	this.$ = cheerio.load(fs.readFileSync(filePath).toString());

	this.createNav();
	this.createExampleHtmlDom();

	// save 
	fs.outputFileSync(filePath, this.$.html());

	if (callback) callback();
}

// 生成导航
BuildPreview.prototype.createNav = function () {
	var self = this,
		$ = self.$,
		titleList = [];

	$('.frozen-docs-section').each(function (index, item) {
		var $section = $(item),
			$h1 = $section.find('h1'),
			$h2 = $section.find('h2'),
			h1_id = 'section-' + $h1.text().trim();

		$h1.attr('id', h1_id);

		var childs = [],
			h2_id;
		if ($h2.length) {
			$h2.each(function (index, child) {
				h2_id = h1_id + '-' + $(child).text().trim();
				$(child).attr('id', h2_id);
				childs.push({
					id: h2_id,
					title: $(child).text()
				});
			});
		}

		titleList.push({
			id: h1_id,
			title: $h1.text(),
			items: childs
		});
	});
	
	var tmpl = fs.readFileSync(path.join(frozen.tmplDir, 'tmpl-nav.html')).toString();
	$('.nav').html(Mustache.render(tmpl, {titleList: titleList}));
};

// 生成演示html
BuildPreview.prototype.createExampleHtmlDom = function () {
	var self = this,
		$ = self.$;

	$('.frozen-docs-section').each(function (j, section) {
		$(section).find('.highlight-html').each(function (k, htmlcodeEle) {
			var html = $(htmlcodeEle).find('pre').text();
			html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

			$(htmlcodeEle).before('<div class="example">' + html + '</div>');
		});
	})
};

exports.build = function (file, callback) {
	new BuildPreview(file, callback);
};

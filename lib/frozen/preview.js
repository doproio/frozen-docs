'use strict';

var fs = require('fs-extra'),
	path = require('path'),
	jsdom = require('jsdom'),
	Mustache = require('mustache'),
	utils = require('./utils'),
	frozen = global.frozen;

/**
 * Build Preview For Page
 * @param {String} filePath page path
 * @param {Function} callback success callback
 */
function BuildPreview (filePath, callback) {
	var self = this;

	jsdom.env({
		file: filePath,
		scripts: [path.join(frozen.staticDir, 'js/jquery.js')],
		done: function (errors, window) {
			if (errors) {
				console.error(errors);
				return false;
			}

			var $ = window.jQuery;
			self._window = window;
			

			self.createNav();
			self.createExampleHtmlDom();

			// remove inset jquery
			$('script.jsdom').remove();

			// save 
			fs.outputFileSync(filePath, window.document.innerHTML);

			if (callback) callback();
		}
	});

	// 生成导航
	self.createNav = function () {
		var $ = self._window.jQuery,
		titleList = [];

		$('.frozen-docs-section').each(function (index, item) {
			var $section = $(item),
				$h1 = $section.find('h1'),
				$h2 = $section.find('h2'),
				h1_id = 'section-' + $h1.text().trim();

			$h1[0].id = h1_id;

			var childs = [];
			if ($h2.length) {
				$h2.each(function (index, child) {
					child.id = h1_id + '-' + $(child).text().trim();
					childs.push({
						id: child.id,
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
	self.createExampleHtmlDom = function () {
		var $ = self._window.jQuery;

		$('.frozen-docs-section').each(function (j, section) {
			$(section).find('.highlight-html').each(function (k, htmlcodeEle) {
				var html = $(htmlcodeEle).find('pre').text();
				html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
				$('<div class="example" />').append(html).insertBefore($(htmlcodeEle));
			});
		})
	};
}

exports.build = function (file, callback) {
	new BuildPreview(file, callback);
}






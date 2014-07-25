'use strict';

var fs = require('fs-extra'),
	path = require('path'),
	Mustache = require('mustache'),
	utils = require('./utils'),
	markdown = require('./markdown'),
	BuildPreview = require('./preview');

var frozen = global.frozen;

/**
 * Build Pages
 */
function Build () {
	var self = this;

	self.files = [];
	self.curIndex = 0;
	self.result = [];

	// 批量编译md文档
	self.files = utils.walkDirectory(frozen.contentDir);

	console.log('正在编译文档...');
	self.files.forEach(function (item) {
		var cache = path.join(frozen.cacheDir, path.basename(item, '.md') + '.html');
		markdown.render(item, cache, function (data) {
			self.result.push(data);
			self.notice(item);
		});
	});
}

// 编译过程提示
Build.prototype.notice = function (item) {
	this.curIndex++;
	console.log(path.basename(item) + ' 编译成功');

	if (this.curIndex === this.files.length) {
		console.log('正在生成html页面...');
		this.buildMainPage();
	}
};

// 生成集合页面
Build.prototype.buildMainPage = function () {
	var self = this;
	var mainContent = fs.readFileSync(path.join(frozen.tmplDir, 'tmpl-index.html')).toString(),
		tmpl_docsSetion = fs.readFileSync(path.join(frozen.tmplDir, 'tmpl-docs-section.html')).toString();

	var docsSectionList = Mustache.render(tmpl_docsSetion, {sections: this.result}),
		mainPage = path.join(frozen.pagesDir, 'index.html');
	
	mainContent = mainContent.replace('{{docsSectionList}}', docsSectionList);
	fs.outputFileSync(mainPage, mainContent);

	BuildPreview.build(mainPage, function () {
		self.buildStaticResource();
	});
};

// 拷贝静态资源
Build.prototype.buildStaticResource = function () {
	fs.copySync(frozen.staticDir, path.join(frozen.pagesDir, 'static'));
	this.complete();
};

// 编译完成事件
Build.prototype.complete = function () {
	console.log('完成文档编译!');
};

exports.build = function () {
	new Build();
}
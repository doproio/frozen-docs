'use strict';

var Github = require('github'),
    fs = require('fs-extra'),
    frozen = global.frozen;

var github = new Github({
        debug: false,
        version: '3.0.0'
    }),
    githubConfig = frozen.config.github,
    gfmMode = false;

if (githubConfig.username && githubConfig.password) {
    github.authenticate({
        type: 'basic',
        username: githubConfig.username,
        password: githubConfig.password
    });
}

/**
 * markdownRender
 * @param  {String}   src      src file path
 * @param  {String}   dist     dist file path
 * @param  {Function} callback 
 */
function markdownRender(src, dist, callback) {
    var option = {
            'text': fs.readFileSync(src).toString()
        };

    if (gfmMode) {
        option.mode = 'gfm';
        option.context = 'github/' + githubConfig.username;
    }    

    github.markdown.render(option, function(err, res) {
        if (!err) {
            console.error(err);
            return false;
        }

        if (dist) {
            fs.outputFileSync(dist, res.data);
        }
        if (callback) {
            callback(res.data);
        }
    });
}

exports.render = markdownRender;
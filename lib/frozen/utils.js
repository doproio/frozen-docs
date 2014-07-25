'use strict';

var fs = require('fs-extra'),
    path = require('path');

/**
 * Get all matching files in the directory
 * @param  {reing} root    dir path
 * @return {array}         result files
 */
exports.walkDirectory = function (root) {
    var files = [];

    if (!fs.existsSync(root)) {
        return [];
    }

    function walk(dir) {
        var dirList = fs.readdirSync(dir);
        for (var i = 0; i < dirList.length; i++) {
            var item = dirList[i];
            //fiter system files
            if (/^\./.test(item)) {
                continue;
            }

            if (fs.statSync(path.join(dir, item)).isDirectory()) {
                try {
                    walk(path.join(dir, item));
                } catch (e) {

                }
            } else {
                files.push(path.join(dir, item));
            }
        }
    }

    walk(root);
    return files;
};

/**
 * replace Json Comments
 * @param  {String} content Json content
 * @return {String}         result
 */
exports.replaceJsonComments = function (content) {
    if (!content) return '';
    return content.replace(/\'.+?\"|\'.+?\'/g, function (s) {
        return s.replace(/\/\//g, '@_@');
    }).replace(/\s*?\/\/.*?[\n\r]|[\t\r\n]/g, '').replace(/@_@/g, '//');
};

/**
 * parse JSON
 * @param  {String} content
 * @return {Object}
 */
exports.parseJSON = function (content) {
    content = exports.replaceJsonComments(content);
    try {
        return JSON.parse(content);
    } catch (e) {
        return null;
    }
};

/**
 * read json file sync
 * @param  {String} file file path
 * @return {Object}      json object
 */
exports.readJsonSync = function (file) {
    var content = fs.readFileSync(file, 'utf8');
    return exports.parseJSON(content);
};

exports.isPlainObject = function( obj ) {
    if ( typeof obj !== "object") {
        return false;
    }
    return true;
},

// object extend
exports.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && typeof target !== 'function' ) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) !== null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && exports.isPlainObject(copy) ||
                    (copyIsArray = Array.isArray(copy) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && exports.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = exports.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};
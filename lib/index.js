// Load modules

var Fs = require('fs');
var Inflection = require('inflection');
var Joi = require('joi');
var Path = require('path');


var internals = {
    schema: {
        include: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())]),
        exclude: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())])
    }
};

module.exports = function (dirname, options) {

    options = Joi.attempt(options || {}, internals.schema);

    dirname = Path.resolve(dirname);
    var required = {};
    var files = Fs.readdirSync(dirname);

    var includeFiles = [];
    var excludeFiles = [];

    if (options.include) {

        includeFiles = includeFiles.concat(options.include);
    }

    if (options.exclude) {

        excludeFiles = excludeFiles.concat(options.exclude);
    }

    for (var i = 0, il = files.length; i < il; ++i) {
        var file = files[i];

        if (options.include) {
            if (includeFiles.indexOf(file) === -1) {
                continue;
            }
        }

        if (options.exclude) {
            if (excludeFiles.indexOf(file) !== -1) {
                continue;
            }
        }

        var name = Inflection.camelize(Path.basename(file, '.js'), true);
        var fullPath = Path.join(dirname, file);
        required[name] = require(fullPath);
    }

    return required;
};

'use strict';
// Load modules

const Fs = require('fs');
const Inflection = require('inflection');
const Joi = require('joi');
const Path = require('path');


const internals = {
    schema: {
        include: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())]),
        exclude: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())])
    }
};

module.exports = function (dirname, options) {

    options = Joi.attempt(options || {}, internals.schema);

    dirname = Path.resolve(dirname);
    const required = {};
    const files = Fs.readdirSync(dirname);

    let includeFiles = [];
    let excludeFiles = [];

    if (options.include) {

        includeFiles = includeFiles.concat(options.include);
    }

    if (options.exclude) {

        excludeFiles = excludeFiles.concat(options.exclude);
    }

    for (let i = 0; i < files.length; ++i) {
        const file = files[i];

        if (!file.match(/.js$/)) {
            continue;
        }

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

        const name = Inflection.camelize(Path.basename(file, '.js'), true);
        const fullPath = Path.join(dirname, file);
        required[name] = require(fullPath);
    }

    return required;
};

'use strict';
// Load modules

const Fs = require('fs');
const Camelcase = require('camelcase');
const Joi = require('joi');
const Path = require('path');


const internals = {
    schema: {
        include: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())]).default([]),
        exclude: Joi.alternatives([Joi.string(), Joi.array().items(Joi.string())]).default([])
    }
};


module.exports = function (dirname, options) {

    options = Joi.attempt(options || {}, internals.schema);

    dirname = Path.resolve(dirname);
    const required = {};
    const files = Fs.readdirSync(dirname);

    for (let i = 0; i < files.length; ++i) {
        const file = files[i];

        const stats = Fs.statSync(Path.join(dirname, file));

        if (!file.match(/.js$/)) {
            continue;
        }

        if (options.include.length) {
            if (options.include.indexOf(file) === -1) {
                continue;
            }
        }

        if (options.exclude.length) {
            if (options.exclude.indexOf(file) !== -1) {
                continue;
            }
        }

        const name = Camelcase(Path.basename(file, '.js'), true);
        const fullPath = Path.join(dirname, file);
        required[name] = require(fullPath);
    }

    return required;
};

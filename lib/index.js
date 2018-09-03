'use strict';
// Load modules

const _  = require('lodash');
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


internals.traverse = function (path, options) {

    const required = {};

    const dirname = Path.resolve(path);
    const files = Fs.readdirSync(dirname).map((file) => {

        return Path.join(dirname, file);
    });

    for (let i = 0; i < files.length; ++i) {

        const file = Path.resolve(files[i]);
        const stats = Fs.statSync(file);

        if (stats.isDirectory()) {
            const name = Camelcase(Path.basename(file), true);
            required[name] = required[name] ?
                _.merge({}, required[name], internals.traverse(file, options)) :
                internals.traverse(file, options);
        }

        if (!file.match(/.js$/)) {
            continue;
        }

        if (options.include.length) {
            if (options.include.indexOf(Path.basename(file)) === -1) {
                continue;
            }
        }

        if (options.exclude.length) {
            if (options.exclude.indexOf(Path.basename(file)) !== -1) {
                continue;
            }
        }

        const name = Camelcase(Path.basename(file, '.js'), true);
        required[name] = required[name] ?
            _.merge({}, required[name], require(file)) :
            require(file);
    }

    return required;
};

module.exports = function (dirname, options) {

    options = Joi.attempt(options || {}, internals.schema);

    options.include = toString.call(options.include).match(/Array/) ? options.include : [options.include];
    options.exclude = toString.call(options.exclude).match(/Array/) ? options.exclude : [options.exclude];

    return internals.traverse(dirname, options);
};

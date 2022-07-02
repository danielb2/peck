"use strict";
// Load modules

const Fs = require("fs");
const Camelcase = require("camelcase");
const Joi = require("joi");
const Path = require("path");

const internals = {
    schema: Joi.object({
        include: Joi.alternatives([
            Joi.string(),
            Joi.array().items(Joi.string()),
        ]).default([]),
        exclude: Joi.alternatives([
            Joi.string(),
            Joi.array().items(Joi.string()),
        ]).default([]),
    }),
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
            required[name] = internals.traverse(file, options);
        }

        if (!file.match(/.js$/)) {
            continue;
        }

        if (options.include.length) {
            if (!options.include.includes(Path.basename(file))) {
                continue;
            }
        }

        if (options.exclude.length) {
            if (options.exclude.includes(Path.basename(file))) {
                continue;
            }
        }

        const name = Camelcase(Path.basename(file, ".js"), true);
        required[name] = required[name]
            ? Object.assign({}, required[name], require(file))
            : require(file);
    }

    return required;
};

module.exports = function (dirname, options) {
    options = Joi.attempt(options || {}, internals.schema);

    options.include = toString.call(options.include).match(/Array/)
        ? options.include
        : [options.include];
    options.exclude = toString.call(options.exclude).match(/Array/)
        ? options.exclude
        : [options.exclude];

    return internals.traverse(dirname, options);
};

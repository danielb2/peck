var Code = require('code');
var Lab = require('lab');
var Peck = require('../');

var internals = {};

// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var before = lab.before;

describe('peck', function () {

    it('requires a directory', function (done) {

        var result = Peck(__dirname + '/folder1');

        expect(result.one).to.deep.equal({ moo: 'cow' });
        expect(result.anotherFile).to.deep.equal({ theAnswer: 42 });

        done();
    });

    it('includes specific files using string', function (done) {

        var result = Peck(__dirname + '/folder1', { include: 'one.js' });
        expect(result.one).to.deep.equal({ moo: 'cow' });
        expect(result.anotherFile).to.not.exist();

        done();
    });

    it('includes specific files using array', function (done) {

        var result = Peck(__dirname + '/folder1', { include: ['one.js'] });
        expect(result.one).to.deep.equal({ moo: 'cow' });
        expect(result.anotherFile).to.not.exist();

        done();
    });

    it('excludes specific files using string', function (done) {

        var result = Peck(__dirname + '/folder1', { exclude: 'one.js' });

        expect(result.one).to.not.exist();
        expect(result.anotherFile).to.deep.equal({ theAnswer: 42 });

        done();
    });

    it('excludes specific files using array', function (done) {

        var result = Peck(__dirname + '/folder1', { exclude: ['one.js'] });

        expect(result.one).to.not.exist();
        expect(result.anotherFile).to.deep.equal({ theAnswer: 42 });

        done();
    });

});

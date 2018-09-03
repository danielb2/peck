'use strict';
const Code = require('code');
const Lab = require('lab');
const Peck = require('../');

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('peck', (done) => {

    it('requires a directory', (done) => {

        const result = Peck(__dirname + '/folder1');

        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.equal({ theAnswer: 42 });
        expect(result.moreFiles).to.equal({ theQuestion: '?' });

        done();
    });

    it('requires a directory recursivly', (done) => {

        const result = Peck(__dirname + '/folder1');

        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.equal({ theAnswer: 42 });
        expect(result.nesTed.two).to.equal({ batman: 'who am I?' });

        done();
    });

    it('includes specific files using string', (done) => {

        const result = Peck(__dirname + '/folder1', { include: 'one.js' });
        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.not.exist();

        done();
    });

    it('includes specific files using array', (done) => {

        const result = Peck(__dirname + '/folder1', { include: ['one.js'] });
        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.not.exist();

        done();
    });

    it('excludes specific files using string', (done) => {

        const result = Peck(__dirname + '/folder1', { exclude: 'one.js' });

        expect(result.one).to.not.exist();
        expect(result.anotherFile).to.equal({ theAnswer: 42 });

        done();
    });

    it('excludes specific files using array', (done) => {

        const result = Peck(__dirname + '/folder1', { exclude: ['one.js'] });

        expect(result.one).to.not.exist();
        expect(result.anotherFile).to.equal({ theAnswer: 42 });

        done();
    });

    it('includes folders and files with the same name and merges results', (done) => {

        const controllers = Peck(__dirname + '/controllers');
        expect(controllers.users.login()).to.equal('user logged in');
        expect(controllers.users.logout()).to.equal('user logged out');

        done();
    });

});

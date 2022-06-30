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

describe('peck', () => {

    it('requires a directory', () => {

        const result = Peck(__dirname + '/folder1');

        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.equal({ theAnswer: 42 });
        expect(result.moreFiles).to.equal({ theQuestion: '?' });
    });

    it('requires a directory recursivly', () => {

        const result = Peck(__dirname + '/folder1');

        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.equal({ theAnswer: 42 });
        expect(result.nesTed.two).to.equal({ batman: 'who am I?' });

        
    });

    it('includes specific files using string', () => {

        const result = Peck(__dirname + '/folder1', { include: 'one.js' });
        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.not.exist();

        
    });

    it('includes specific files using array', () => {

        const result = Peck(__dirname + '/folder1', { include: ['one.js'] });
        expect(result.one).to.equal({ moo: 'cow' });
        expect(result.anotherFile).to.not.exist();

        
    });

    it('excludes specific files using string', () => {

        const result = Peck(__dirname + '/folder1', { exclude: 'one.js' });

        expect(result.one).to.not.exist();
        expect(result.anotherFile).to.equal({ theAnswer: 42 });

        
    });

    it('excludes specific files using array', () => {

        const result = Peck(__dirname + '/folder1', { exclude: ['one.js'] });

        expect(result.one).to.not.exist();
        expect(result.anotherFile).to.equal({ theAnswer: 42 });

        
    });

    it('includes folders and files with the same name and merges results', () => {

        const controllers = Peck(__dirname + '/controllers');
        expect(controllers.users.login()).to.equal('user logged in');
        expect(controllers.users.logout()).to.equal('user logged out');

        
    });

});

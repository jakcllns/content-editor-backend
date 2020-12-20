const {expect} = require('chai');
const mongoose = require('mongoose');
const Content = require('../models/content');

describe('Content Model',() => {
    it('has title property', () => {
        const content = new Content;
        expect(content).has.property('title');
    });
    it('has property author', ()=> {
        const content = new Content;
        expect(content).has.property('author');
    });
    it('has property imageUrls',() => {
        const content = new Content;
        expect(content).has.property('imageUrls');
    });
    it('has property content',()=>{
        const content = new Content;
        expect(content).has.property('content');
    });
    it('has property createdAt',()=>{
        const content = new Content;
        expect(content).has.property('createdAt');
    });
    it('should be invalid if title is empty',(done)=>{
        const content = new Content;
        content.validate(err => {
            expect(err.errors).has.property('title');
            done();
        });
    });
    it('should be invalid if author is empty', done => {
        const content = new Content;
        content.validate(err => {
            expect(err.errors).has.property('author');
            done();
        });
    });
});
const {expect} = require('chai');
const mongoose = require('mongoose');
const Post = require('../models/post');

describe('Content Model',() => {
    it('has title property', () => {
        const post = new Post;
        expect(post).has.property('title');
    });
    it('has property author', ()=> {
        const post = new Post;
        expect(post).has.property('author');
    });
    it('has property imageUrls',() => {
        const post = new Post;
        expect(post).has.property('imageUrls');
    });
    it('has property content',()=>{
        const post = new Post;
        expect(post).has.property('content');
    });
    it('has property createdAt',()=>{
        const post = new Post;
        expect(post).has.property('createdAt');
    });
    it('should be invalid if title is empty',(done)=>{
        const post = new Post;
        post.validate(err => {
            expect(err.errors).has.property('title');
            done();
        });
    });
    it('should be invalid if author is empty', done => {
        const post = new Post;
        post.validate(err => {
            expect(err.errors).has.property('author');
            done();
        });
    });
});
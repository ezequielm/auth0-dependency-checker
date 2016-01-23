'use strict';

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var helper = require('../support/helper');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');

describe('Routes - Projects', function() {
  describe('#POST /api/projects', function() {
    afterEach(function(done) {
      Project.remove({}, done);
    });

    describe('when throws an error', function() {
      beforeEach(function(done) {
        global.mockProject = sinon.stub(Project.prototype, 'save');
        global.mockProject.yields('TypeError', null);
        done();
      });

      afterEach(function(done) {
        global.mockProject.restore();
        done();
      });

      it('should returns 500', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj',
            repositoryUrl: 'git://github.com/test/Test-prj'
          })
          .expect(500)
          /*eslint-disable max-nested-callbacks*/
          .end(function(err){
            if (err) {
              return done(err);
            }
            done();
          });
          /*eslint-enable max-nested-callbacks*/
      });
    });

    describe('when authentication fails', function() {
      it('should returns 401');
    });

    describe('when authorization fails', function() {
      it('should returns 403');
    });

    describe('when validation fails', function() {
      it('should returns 400', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj'
          })
          .expect(400)
          /*eslint-disable max-nested-callbacks*/
          .end(function(err){
            if (err) {
              return done(err);
            }
            done();
          });
          /*eslint-enable max-nested-callbacks*/
      });
    });

    describe('when project is created', function() {
      it('should returns 201', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj',
            repositoryUrl: 'git://github.com/test/Test-prj'
          })
          .expect(201)
          /*eslint-disable max-nested-callbacks*/
          .end(function(err){
            if (err) {
              return done(err);
            }
            done();
          });
          /*eslint-enable max-nested-callbacks*/
      });

      it('should returns created project', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj',
            repositoryUrl: 'git://github.com/test/Test-prj'
          })
          /*eslint-disable max-nested-callbacks*/
          .end(function(err, res){
            if (err) {
              return done(err);
            }

            expect(res.body.title).to.be.eql('Test-prj');

            done();
          });
          /*eslint-enable max-nested-callbacks*/
      });

      it('should returns application/json', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj',
            repositoryUrl: 'git://github.com/test/Test-prj'
          })
          .expect('Content-Type', 'application/json; charset=utf-8')
          /*eslint-disable max-nested-callbacks*/
          .end(function(err){
            if (err) {
              return done(err);
            }
            done();
          });
          /*eslint-enable max-nested-callbacks*/
      });
    });
  });
});

'use strict';

var Project = require('../../lib/data/models/project');
var Store = require('../../lib/helpers/store');
var fs = require('fs');

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var helper = require('../support/helper');

describe('Routes - Projects', function() {
  describe('#POST /api/projects', function() {
    afterEach(function(done) {
      fs.writeFile(process.env.DATA_STORE, JSON.stringify({}), done);
    });

    after(function(done) {
      fs.unlink(process.env.DATA_STORE, done);
    });

    describe('when throws an error', function() {
      beforeEach(function(done) {
        global.mockProject = sinon.stub(fs, 'writeFile');
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

    describe('when project exists', function() {
      beforeEach(function(done) {
        Project.addProject({
          title: 'Test-prj',
          repositoryUrl: 'git://github.com/test/Test-prj'
        }).then(done);
      });

      it('should returns 400', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj',
            repositoryUrl: 'git://github.com/test/Test-prj'
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

      it('should store created project in json file', function(done) {
        helper.agent
          .post('/api/projects/')
          .send({
            title: 'Test-prj',
            repositoryUrl: 'git://github.com/test/Test-prj'
          })
          /*eslint-disable max-nested-callbacks*/
          .end(function(err){
            if (err) {
              return done(err);
            }

            Store.loadFile().then(function(result) {
              expect(result.projects[0].title).to.be.eql('Test-prj');
              done();
            });
          });
          /*eslint-enable max-nested-callbacks*/
      });
    });
  });
});

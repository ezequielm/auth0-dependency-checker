'use strict';

describe('Routes - Projects', function() {
  describe('#POST /api/projects', function() {
    describe('when throws an error', function() {
      it('should returns 500');
    });

    describe('when authentication fails', function() {
      it('should returns 401');
    });

    describe('when authorization fails', function() {
      it('should returns 403');
    });

    describe('when validation fails', function() {
      it('should returns 400');
    });

    describe('when project is created', function() {
      it('should returns 400');
      it('should returns created project');
      it('should returns application/json');
    });
  });
});

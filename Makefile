TESTS = test/**/*-test.js
test:
	./node_modules/.bin/mocha $(TESTS)

.PHONY: test

# Testing

## Overview

* Naive Testing with console.log
* Basic Unit testing (simDb)
* Install Mocha
* Mocha:
    * `it()` method
    * `describe()` method
    * Use mocha with `assert()`
* Install Chai
    * BDD DSL
    * `expect().to.be...`
    * Improve output/readability
* Install Chai-Http for testing APIs
    * Wrap `app.listen`
    * Export `app`
    * `chai.request(app)`
        * Returns a promise
        * Resolves with response

### Naive testing - we all do it

On `calculator.js` file add naive `console.log` tests

```js
console.log(add(2, 2) === 4);
console.log(add(-3, 5) === 2);
console.log(add(-3, -5) === -8);
```

* Not scalable :(
* Can not run it automatically on every change/commit :(

### Extract Test

Extract tests to separate file and run
Allows code to be imported. Better, but not aweome

* Create `/test/calculator.js`
* Cut and Paste `console.log` tests to new test page

Export calculator

```js
module.exports = { add, sub, mul, div };
```

### Install Mocha

* `npm install mocha --save-dev`
* Discuss `--save-dev` flag
* Change `console.log(...)` to `assert(...)`
* Wrap each `assert()` in `it('should`, function(){})`

```js
it('should return 4 when given 2 and 2', function () {
  assert(calc.add(2, 2) === 4);
});

it('should return 2 when give -3, 5', function () {
  assert(calc.add(-3, 5) === 2);
});

it('should return -8 when given -3, -5', function () {
  assert(calc.add(-3, -5) === -8);
});
```

That works, but we can do better.

Wrap the `it()` blocks in `describe()`

```js
describe('Calculator add method', function () {

  it('should return 4 when given 2 and 2', function () {
    assert(calc.add(2, 2) === 4);
  });

  it('should return 2 when give -3, 5', function () {
    assert(calc.add(-3, 5) === 2);
  });

  it('should return -8 when given -3, -5', function () {
    assert(calc.add(-3, -5) === -8);
  });

});
```

### Chai is just convenience methods for BDD

* BDD is Behavior Driven Development
* A way of thinking and writing specifications
* Chai is a (DSL) Domain Specifc Language

* `npm install chai  --save-dev`
* Update `assert(...)` to `expect().to.equal()`

```js
const chai = require('chai');
const calc = require('../calculator');

const expect = chai.expect;

describe('Calculator', function () {

  describe('add method', function () {

    it('should return 4 when given 2 and 2', function () {
      expect(calc.add(2, 2)).to.equal(4);
    });

    it('should return 2 when give -3, 5', function () {
      expect(calc.add(-3, 5)).to.equal(2);
    });

    it('should return -8 when given -3, -5', function () {
      expect(calc.add(-3, -5)).to.equal(-8);
    });

  });

});
```

### Chai HTTP to test API

* `npm install chai-http  --save-dev`

```js
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);
```

* Wrap `app.listen` in `if (require.main === module) {...}`
* Export `module.exports = app;`
* add `const app = require('../server');` to test
* Add static server test and 404 test
* `chai.request(app)`
    * Automatically starts and stops server
    * Returns a promise
    * So Use `.then()`
    * Respolves with response from API `.then(res => {...})`

```js
describe('Basic Express setup', function () {

  describe('Express static', function () {

    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(res => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });

  });

  describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });
});
```

* Endpoint Tests

```js
describe('Items routes', function () {

  describe('GET /api/items', function () {

    it('should return the default of 10 items ', function () {
      return chai.request(app)
        .get('/api/items')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
        });
    });

    it('should return a list with the correct right fields', function () {
      return chai.request(app)
        .get('/api/items')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
          res.body.forEach(function (item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'name', 'checked');
          });
        });
    });

  });

});
```

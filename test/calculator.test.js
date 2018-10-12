'use strict';

// const assert = require('assert');
// const calc = require('../calculator');


// describe('Calculator add method', function () {

//   it('should return 4 when given 2 and 2', function () {
//     assert(calc.add(2, 2) === 4);
//   });

//   it('should return 2 when give -3, 5', function () {
//     assert(calc.add(-3, 5) === 2);
//   });

//   it('should return -8 when given -3, -5', function () {
//     assert(calc.add(-3, -5) === -8);
//   });

// });

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

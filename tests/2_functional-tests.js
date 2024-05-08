const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const validPuzzleString = puzzlesAndSolutions[0][0];
  const solvedPuzzleString = puzzlesAndSolutions[0][1];
  const unsolvablePuzzleString = validPuzzleString.replace('9', '1');

  test('Solve a puzzle with valid puzzle string', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: validPuzzleString
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solvedPuzzleString);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: validPuzzleString.replace('5', 'A')
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: validPuzzleString.slice(0, 69)
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: unsolvablePuzzleString
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A2',
        value: '4'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.lengthOf(res.body.conflict, 1);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A2',
        value: '1'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.lengthOf(res.body.conflict, 2);
        assert.includeMembers(res.body.conflict, ['row', 'region']);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A2',
        value: '2'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.lengthOf(res.body.conflict, 3);
        assert.includeMembers(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        coordinate: 'A2',
        value: '2'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString.replace('5', 'A'),
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString.slice(0, 69),
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: '12',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: validPuzzleString,
        coordinate: 'A2',
        value: '0'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});


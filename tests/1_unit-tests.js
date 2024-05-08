const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  const validPuzzleString = puzzlesAndSolutions[0][0];
  const solvedPuzzleString = puzzlesAndSolutions[0][1];
  const unsolvablePuzzleString = validPuzzleString.replace('9', '1');

  test('Handles a puzzle string of 81 characters', function () {
    assert.equal(solver.validate(validPuzzleString), true);
  });

  test('Handles a puzzle string with invalid characters', function () {
    const puzzleString = validPuzzleString.replace('5', 'A');
    assert.equal(solver.validate(puzzleString), false);
  });

  test('Handles a puzzle string that is not 81 characters in length', function () {
    const puzzleString = validPuzzleString.slice(0, 69);
    assert.equal(solver.validate(puzzleString), false);
  });

  test('Handles a valid row placement', function () {
    assert.equal(solver.checkRowPlacement(validPuzzleString, 1, 2, '3'), true);
  });

  test('Handles a invalid row placement', function () {
    assert.equal(solver.checkRowPlacement(validPuzzleString, 1, 2, '4'), false);
  });

  test('Handles a valid column placement', function () {
    assert.equal(solver.checkColPlacement(validPuzzleString, 2, 1, '9'), true);
  });

  test('Handles a invalid column placement', function () {
    assert.equal(solver.checkColPlacement(validPuzzleString, 2, 1, '8'), false);
  });

  test('Handles a valid region (3x3 grid) placement', function () {
    assert.equal(solver.checkRegionPlacement(validPuzzleString, 2, 2, '4'), true);
  });

  test('Handles a invalid region (3x3 grid) placement', function () {
    assert.equal(solver.checkRegionPlacement(validPuzzleString, 2, 2, '5'), false);
  });

  test('Valid puzzle strings pass the solver', function () {
    assert.equal(solver.validate(validPuzzleString), true);
  });

  test('Invalid puzzle strings fail the solver', function () {
    assert.equal(solver.validate(unsolvablePuzzleString), false);
  });

  test('Solver returns the expected solution for an incomplete puzzle', function () {
    assert.equal(solver.solve(validPuzzleString), solvedPuzzleString);
  });
});
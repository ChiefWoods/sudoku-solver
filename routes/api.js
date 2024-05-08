'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

function checkPuzzleParam(res, puzzle) {
  if (/[^1-9.]/.test(puzzle)) {
    return res.json({ error: 'Invalid characters in puzzle' });
  } else if (puzzle.length !== 81) {
    return res.json({ error: 'Expected puzzle to be 81 characters long' });
  }
}

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      checkPuzzleParam(res, puzzle);

      let [row, col] = coordinate.split('');
      row = row.toUpperCase().charCodeAt(0) - 64;
      col = parseInt(col);

      if (coordinate.length !== 2 || /[^1-9]/.test(row.toString()) || /[^1-9]/.test(col.toString())) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (typeof (value) !== 'string' || /[^1-9]/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      let conflict = [];

      if (!solver.checkRowPlacement(puzzle, row, col, value)) {
        conflict.push('row');
      }

      if (!solver.checkColPlacement(puzzle, row, col, value)) {
        conflict.push('column');
      }

      if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
        conflict.push('region');
      }

      return res.json(conflict.length
        ? { valid: false, conflict }
        : { valid: true }
      );
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      checkPuzzleParam(res, puzzle);

      let solved = solver.solve(puzzle);

      return res.json(solved
        ? { solution: solved }
        : { error: 'Puzzle cannot be solved' }
      );
    });
};

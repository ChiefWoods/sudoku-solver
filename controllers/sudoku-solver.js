class SudokuSolver {
  constructor () {
    this.regions = [
      [0, 1, 2, 9, 10, 11, 18, 19, 20],
      [3, 4, 5, 12, 13, 14, 21, 22, 23],
      [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47],
      [30, 31, 32, 39, 40, 41, 48, 49, 50],
      [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74],
      [57, 58, 59, 66, 67, 68, 75, 76, 77],
      [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ];

    this.values = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  }

  getIndex(row, column) {
    return (row - 1) * 9 + column - 1;
  }

  validate(puzzleString) {
    if (puzzleString.length !== 81 || /[^1-9.]/.test(puzzleString)) return false;

    for (let i = 0; i < puzzleString.length; i++) {
      const row = Math.floor(i / 9) + 1;
      const col = (i % 9) + 1;
      const value = puzzleString[i];

      if (value === '.') continue;

      if (!this.checkRowPlacement(puzzleString, row, col, value)
        || !this.checkColPlacement(puzzleString, row, col, value)
        || !this.checkRegionPlacement(puzzleString, row, col, value)) {
        return false;
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = (row - 1) * 9;
    let rowValues = puzzleString.slice(rowStart, rowStart + 9)
    rowValues = rowValues.slice(0, column - 1) + rowValues.slice(column);

    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colStart = column - 1;
    let colValues = [];

    for (let i = colStart; i < puzzleString.length; i += 9) {
      colValues.push(puzzleString[i]);
    }

    colValues = colValues.slice(0, row - 1) + colValues.slice(row);

    return !colValues.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const index = this.getIndex(row, column);
    const region = this.regions.find(region => region.includes(index));
    const regionValues = region.map(index => puzzleString[index]).filter((_, i) => i !== region.indexOf(index)).join('');

    return !regionValues.includes(value);
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return null;
    } else if (/^\d+$/.test(puzzleString)) {
      return puzzleString;
    }

    const index = puzzleString.indexOf(puzzleString.match(/\D/));

    if (index !== -1) {
      const row = Math.floor((index / 9) + 1);
      const col = (index % 9) + 1;

      const possibleValues = this.values.filter(value => {
        return this.checkRowPlacement(puzzleString, row, col, value)
          && this.checkColPlacement(puzzleString, row, col, value)
          && this.checkRegionPlacement(puzzleString, row, col, value);
      });

      for (const value of possibleValues) {
        const newString = puzzleString.slice(0, index) + value + puzzleString.slice(index + 1);
        const result = this.solve(newString);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }
}

module.exports = SudokuSolver;

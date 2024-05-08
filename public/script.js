const cells = document.querySelectorAll('.cell');
const solveForm = document.querySelector('#solve');
const textarea = document.querySelector('textarea');
const checkForm = document.querySelector('#check');
const result = document.querySelector('#result');

function fillCells(puzzle) {
  cells.forEach((cell, i) => {
    cell.textContent = isNaN(puzzle[i]) ? '' : puzzle[i];
  });
}

solveForm.addEventListener('submit', e => {
  e.preventDefault();

  result.textContent = '';

  fetch('/api/solve', {
    method: 'POST',
    body: new FormData(solveForm)
  })
    .then(res => res.json())
    .then(data => {
      if (data.solution) {
        fillCells(data.solution);
      }
      result.textContent = JSON.stringify(data);
    });
});

textarea.addEventListener('input', e => {
  const trimmedString = e.target.value.slice(0, 81);

  fillCells(trimmedString);
});

checkForm.addEventListener('submit', e => {
  e.preventDefault();

  result.textContent = '';

  const formData = new FormData(checkForm);
  formData.append('puzzle', textarea.value);

  fetch('/api/check', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => result.textContent = JSON.stringify(data));
});

fillCells(textarea.value);
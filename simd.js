/*
Автор кода - студент группы 721701 Тесловский Александр Павлович.

Вариант задания № 11.

Для упрощения реализации таблиц и динамической отрисовки элементов страницы
была использована билиотека jQuery.
*/

$(document).ready(() => {
  matrixA = []
  matrixB = []
  matrixE = []
  matrixG = []
  matrixF = []
  matrixD = []
  sizeP = 3
  sizeM = 3
  sizeQ = 3

  createMatrices()
  drawMatrices()

  $('#run-button').on('click', () => {
      sizeP = $('#p-size').val()
      sizeM = $('#m-size').val()
      sizeQ = $('#q-size').val()
    if (!sizeP || !sizeM || !sizeQ) {
      alert('Input all sizes')
      return
    }
    createMatrices(sizeP, sizeM, sizeQ)
    drawMatrices()
  })

  function createMatrices() {
    matrixA = createMatrix(sizeP, sizeM)
    matrixB = createMatrix(sizeM, sizeQ)
    matrixE = createMatrix(1, sizeM)
    matrixG = createMatrix(sizeP, sizeQ)
  }

  function createMatrix(firstSize, secondSize) {
    var tempArray, matrix = []
    for (let i = 0; i < firstSize; i++) {
      tempArray = []
      for (let i = 0; i < secondSize; i++) {
        tempArray.push(Math.random().toFixed(3))
      }
      matrix.push(tempArray)
    }
    return matrix
  }

  function drawMatrices() {
    $('.matrices').children('table').each((_, table) => {
      $(table).empty()
    })
    drawMatrix(matrixA, $('#a-matrix'))
    drawMatrix(matrixB, $('#b-matrix'))
    drawMatrix(matrixE, $('#e-matrix'))
    drawMatrix(matrixG, $('#g-matrix'))
  }

  function drawMatrix(matrix, table) {
    var row
    matrix.forEach((array) => {
      table.append('<tr>')
      row = table.find('tr:last-child')
      array.forEach((number) => {
        row.append('<td>' + number + '</td>')
      })
    })
  }

  function impl(first, second) {

  }
})

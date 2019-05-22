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

  createMatrices(3, 3, 3, 3)
  drawMatrices()

  $('#regenerate-button').on('click', () => {
    let sizeA = $('#a-size').val(),
      sizeB = $('#b-size').val(),
      sizeE = $('#e-size').val(),
      sizeG = $('#g-size').val()
    if (!sizeA || !sizeB || !sizeE || !sizeG) {
      alert('Input all sizes')
      return
    }
    createMatrices(sizeA, sizeB, sizeE, sizeG)
    drawMatrices()
  })

  $('#calculate-button').on('click', () => {

  })

  function createMatrices(sizeA, sizeB, sizeE, sizeG) {
    matrixA = createMatrix(sizeA)
    matrixB = createMatrix(sizeB)
    matrixE = createMatrix(sizeE)
    matrixG = createMatrix(sizeG)
  }

  function createMatrix(size) {
    var tempArray, matrix = []
    for (let i = 0; i < size; i++) {
      tempArray = []
      for (let i = 0; i < size; i++) {
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
})

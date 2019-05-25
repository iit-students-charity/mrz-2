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
  matrixC = []
  sizeP = 3
  sizeM = 3
  sizeQ = 3

  generateMatrices()
  calculate()
  drawMatrices()

  $('#run-button').on('click', () => {
      sizeP = $('#p-size').val()
      sizeM = $('#m-size').val()
      sizeQ = $('#q-size').val()
    if (!sizeP || !sizeM || !sizeQ) {
      alert('Input all sizes')
      return
    }
    generateMatrices(sizeP, sizeM, sizeQ)
    calculate()
    drawMatrices()
  })

  function generateMatrices() {
    matrixA = generateMatrix(sizeP, sizeM)
    matrixB = generateMatrix(sizeM, sizeQ)
    matrixE = generateMatrix(1, sizeM)
    matrixG = generateMatrix(sizeP, sizeQ)
    matrixD = generateEmptyMatrix()
    matrixF = generateEmptyMatrix()
    matrixC = generateEmptyMatrix()
  }

  function generateMatrix(firstSize, secondSize) {
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

  function generateEmptyMatrix() {
    var matrix = []
    for (var i = 0; i < sizeP; i++) {
      matrix.push([])
      for (var j = 0; j < sizeQ; j++) {
        matrix[i].push([])
        for (var k = 0; k < sizeM; k++) {
          matrix[i][j].push([])
        }
      }
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
    drawMatrix(matrixC, $('#c-matrix'))
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

  // a -> b
  function implication(first, second) {
    return Math.max(1 - first, second)
  }

  // a ^ b
  function conjunction(first, second) {
    return Math.min(first, second)
  }

  // ^ a
  function singleConjunction(array) {
    var value = 1
    for (var i = 0; i < array.length; i++) {
      value *= array[i]
    }
    return value
  }

  // v a
  function singleDisjunction(array) {
    var value = 1
    for (var i = 0; i < array.length; i++) {
      value *= (1 - array[i])
    }
    return 1 - value
  }

  // a o b
  function multiplication(first, second) {
    return Math.max(singleConjunction(first) + singleDisjunction(second) - 1, 0)
  }

  function calculate() {
    calculateF()
    calculateD()
    calculateC()
  }

  function calculateF() {
    for (var i = 0; i < sizeP; i++) {
      for (var j = 0; j < sizeQ; j++) {
        for (var k = 0; k < sizeM; k++) {
          matrixF[i][j][k] = (
            implication(matrixA[i][k], matrixB[k][j]) * (2 * matrixE[0][k] - 1) * matrixE[0][k] +
            implication(matrixB[k][j], matrixA[i][k]) * (
              1 + (4 * implication(matrixA[i][k], matrixB[k][j]) - 2) * matrixE[0][k]
            ) * (1 - matrixE[0][k])
          ).toFixed(3)
        }
      }
    }
  }

  function calculateD() {
    for (var i = 0; i < sizeP; i++) {
      for (var j = 0; j < sizeQ; j++) {
        for (var k = 0; k < sizeM; k++) {
          matrixD[i][j][k] = conjunction(matrixA[i][k], matrixB[k][j]).toFixed(3)
        }
      }
    }
  }

  function calculateC() {
    for (var i = 0; i < sizeP; i++) {
      for (var j = 0; j < sizeQ; j++) {
        matrixC[i][j] = (
          singleConjunction(matrixF[i][j]) * (3 * matrixG[i][j] - 2) * matrixG[i][j] + (
            singleDisjunction(matrixD[i][j]) + (4 * (multiplication(matrixF[i][j], matrixD[i][j]) - 3 *
            singleDisjunction(matrixD[i][j])) * matrixG[i][j])
          ) * (1 - matrixG[i][j])
        ).toFixed(3)
      }
    }
  }
})

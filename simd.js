/*
Автор кода - студент группы 721701 Тесловский Александр Павлович.

Вариант задания № 11.

Для упрощения реализации таблиц и динамической отрисовки элементов страницы
была использована билиотека jQuery.
*/

$(document).ready(() => {
  var a, b, e, g, f, d, c,
    sizeP = 3,
    sizeM = 3,
    sizeQ = 3,
    nValue = 1,
    multiplicationTime = 1,
    additionTime = 1,
    subtractionTime = 1,
    comparisonTime = 1

  setDefaults()
  generate()
  calculate()
  draw()

  $('#run-button').on('click', () => {
    if (!validate()) return

    sizeP = $('#p-size').val()
    sizeM = $('#m-size').val()
    sizeQ = $('#q-size').val()
    nValue = $('#n-value').val()
    multiplicationTime = $('#multiplication-time').val()
    divisionTime = $('#division-time').val()
    additionTime = $('#addition-time').val()
    subtractionTime = $('#subtraction-time').val()
    comparisonTime = $('#comparison-time').val()

    generate()
    calculate()
    draw()
  })

  function validate() {
    if ($('#p-size').val() === '' || $('#m-size').val() === '' || $('#q-size').val() === '' ||
    $('#n-value').val() === '' || $('#multiplication-time').val() === '' || $('#division-time').val() === '' ||
    $('#addition-time').val() === '' || $('#subtraction-time').val() === '' || $('#comparison-time').val() === '') {
      alert('Data is incorrect')
      return false
    }
    return true
  }

  function setDefaults() {
    $('#p-size').val('3')
    $('#m-size').val('3')
    $('#q-size').val('3')
    $('#n-value').val('1')
    $('#multiplication-time').val('1')
    $('#division-time').val('1')
    $('#addition-time').val('1')
    $('#subtraction-time').val('1')
    $('#comparison-time').val('1')
  }

  function generate() {
    a = generateMatrix(sizeP, sizeM)
    b = generateMatrix(sizeM, sizeQ)
    e = generateMatrix(1, sizeM)
    g = generateMatrix(sizeP, sizeQ)
    d = generateEmptyMatrix()
    f = generateEmptyMatrix()
    c = generateEmptyMatrix()
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

  function draw() {
    let rang = sizeM * sizeP * sizeQ
    let consistentTime = numberOfMultiplications() * multiplicationTime + numberOfAdditions() * additionTime +
      numberOfSubtractions() * subtractionTime + numberOfComparisons() * comparisonTime
    let parallelTime = consistentTime / nValue

    $('.matrices').children('table').each((_, table) => {
      $(table).empty()
    })
    $('#c-matrix').empty()

    drawMatrix(a, $('#a-matrix'))
    drawMatrix(b, $('#b-matrix'))
    drawMatrix(e, $('#e-matrix'))
    drawMatrix(g, $('#g-matrix'))
    drawMatrix(c, $('#c-matrix'))

    $('#result-multiplication-time').text(numberOfMultiplications() * multiplicationTime)
    $('#result-addition-time').text(numberOfAdditions() * additionTime)
    $('#result-subtraction-time').text(numberOfSubtractions() * subtractionTime)
    $('#result-comparison-time').text(numberOfComparisons() * comparisonTime)
    $('#result-acceleration-factor').text((consistentTime / parallelTime).toFixed(3))
    $('#result-efficiency').text((consistentTime / parallelTime / nValue).toFixed(3))
    $('#result-rang').text(rang)
    $('#result-parallel-time').text(parallelTime)
    $('#result-consistent-time').text(consistentTime)
    $('#result-total-length').text(parallelTime)
    $('#result-average-length').text(Math.ceil(parallelTime / rang))
    $('#result-discrepancy').text(rang)
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
  function reduction(first, second) {
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
          f[i][j][k] = (
            reduction(a[i][k], b[k][j]) * (2 * e[0][k] - 1) * e[0][k] +
            reduction(b[k][j], a[i][k]) * (
              1 + (4 * reduction(a[i][k], b[k][j]) - 2) * e[0][k]
            ) * (1 - e[0][k])
          ).toFixed(3)
        }
      }
    }
  }

  function calculateD() {
    for (var i = 0; i < sizeP; i++) {
      for (var j = 0; j < sizeQ; j++) {
        for (var k = 0; k < sizeM; k++) {
          d[i][j][k] = conjunction(a[i][k], b[k][j]).toFixed(3)
        }
      }
    }
  }

  function calculateC() {
    for (var i = 0; i < sizeP; i++) {
      for (var j = 0; j < sizeQ; j++) {
        c[i][j] = (
          singleConjunction(f[i][j]) * (3 * g[i][j] - 2) * g[i][j] + (
            singleDisjunction(d[i][j]) + (4 * (multiplication(f[i][j], d[i][j]) - 3 *
            singleDisjunction(d[i][j])) * g[i][j])
          ) * (1 - g[i][j])
        ).toFixed(3)
      }
    }
  }

  function numberOfMultiplications() {
    return (13 + 3 * sizeM) * sizeP * sizeQ
  }

  function numberOfAdditions() {
    return 6 * sizeP * sizeQ
  }

  function numberOfSubtractions() {
    return (9 + sizeM) * sizeP * sizeQ
  }

  function numberOfComparisons() {
    return (12 + sizeM) * sizeP * sizeQ
  }
})

// Tn = tMultiplicity * Math.ceil(p * q * m / n)
// Lsum = Tn
// Lavg = T1 / r
// D = Lsum / Lavg
// parallelTime = (consistentTime - (sizeM * 2 * multiplicationTime) - (sizeM * 3 * multiplicationTime + subtractionTime) - subtractionTime)

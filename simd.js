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
    rang = 9,
    multiplicationTime = 1,
    additionTime = 1,
    subtractionTime = 1,
    comparisonTime = 1,
    numberOfMultiplications = 0,
    numberOfAdditions = 0,
    numberOfSubtractions = 0,
    numberOfComparisons = 0,
    numberOfParallelMultiplications = 0,
    numberOfParallelAdditions = 0,
    numberOfParallelSubtractions = 0,
    consistentTime = 0,
    parallelTime = 0

  google.charts.load('current', {packages: ['corechart', 'line']})
  google.charts.setOnLoadCallback(drawGraphics)

  setDefaults()
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
    $('.matrices').children('table').each((_, table) => {
      $(table).empty()
    })
    $('#c-matrix').empty()

    drawMatrix(a, $('#a-matrix'))
    drawMatrix(b, $('#b-matrix'))
    drawMatrix(e, $('#e-matrix'))
    drawMatrix(g, $('#g-matrix'))
    drawMatrix(c, $('#c-matrix'))

    $('#result-multiplication-time').text(numberOfMultiplications * multiplicationTime)
    $('#result-addition-time').text(numberOfAdditions * additionTime)
    $('#result-subtraction-time').text(numberOfSubtractions * subtractionTime)
    $('#result-comparison-time').text(numberOfComparisons * comparisonTime)
    $('#result-acceleration-factor').text(accelerationFactor)
    $('#result-efficiency').text(efficiency)
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
    numberOfSubtractions++
    numberOfComparisons += 2
    return Math.max(1 - first, second)
  }

  // a ^ b
  function conjunction(first, second) {
    numberOfComparisons += 2
    return Math.min(first, second)
  }

  // ^ a
  function singleConjunction(array) {
    var value = 1
    for (var i = 0; i < array.length; i++) {
      value *= array[i]
      numberOfMultiplications++
    }
    numberOfMultiplications--
    return value
  }

  // v a
  function singleDisjunction(array) {
    var value = 1
    for (var i = 0; i < array.length; i++) {
      value *= (1 - array[i])
      numberOfMultiplications++
      numberOfSubtractions++
    }
    numberOfMultiplications--
    numberOfSubtractions++
    return 1 - value
  }

  // a o b
  function multiplication(first, second) {
    numberOfAdditions++
    numberOfSubtractions++
    numberOfComparisons += 2
    return Math.max(singleConjunction(first) + singleDisjunction(second) - 1, 0)
  }

  function calculate(m, p, q, n) {
    if (m && p && q && n) {
      sizeM = m
      sizeP = p
      sizeQ = q
      nValue = n
    }

    numberOfMultiplications = 0
    numberOfAdditions = 0
    numberOfSubtractions = 0
    numberOfComparisons = 0
    numberOfParallelMultiplications = 0
    numberOfParallelAdditions = 0
    numberOfParallelSubtractions = 0

    generate()
    calculateF()
    calculateD()
    calculateC()

    rang = sizeM * sizeP * sizeQ
    consistentTime = numberOfMultiplications * multiplicationTime + numberOfAdditions * additionTime +
      numberOfSubtractions * subtractionTime + numberOfComparisons * comparisonTime + numberOfParallelMultiplications *
      multiplicationTime + numberOfParallelAdditions * additionTime + numberOfParallelSubtractions * subtractionTime
    parallelTime = numberOfMultiplications * multiplicationTime + numberOfAdditions * additionTime +
      numberOfSubtractions * subtractionTime + numberOfComparisons * comparisonTime + (numberOfParallelMultiplications
      * multiplicationTime + numberOfParallelAdditions * additionTime + numberOfParallelSubtractions * subtractionTime)
      / nValue
    accelerationFactor = consistentTime / parallelTime
    efficiency = consistentTime / (parallelTime * nValue)
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
          numberOfParallelMultiplications += 7
          numberOfParallelAdditions += 2
          numberOfParallelSubtractions += 3
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
        numberOfParallelMultiplications += 6
        numberOfParallelAdditions += 2
        numberOfParallelSubtractions += 2
      }
    }
  }

  function drawGraphics() {
    let KyN1 = [], KyN2 = [], KyN3 = [], KyN4 = [], KyR1 = [], KyR2 = [], KyR3 = [], KyR4 = []
    let En1 = [], En2 = [], En3 = [], En4 = [], Er1 = [], Er2 = [], Er3 = [], Er4 = []
    let Dn1 = [], Dn2 = [], Dn3 = [], Dn4 = [], Dr1 = [], Dr2 = [], Dr3 = [], Dr4 = []
    let KyN = [], En = [], Dn = [], KyR = [], Er = [], Dr = []

    for (var i = 1; i <= 50; i++) {
      calculate(1, 1, 1, i)
      KyN1.push(accelerationFactor)
      En1.push(efficiency)
      Dn1.push(rang)
      calculate(2, 1, 1, i)
      KyN2.push(accelerationFactor)
      En2.push(efficiency)
      Dn2.push(rang)
      calculate(3, 1, 1, i)
      KyN3.push(accelerationFactor)
      En3.push(efficiency)
      Dn3.push(rang)
      calculate(4, 1, 1, i)
      KyN4.push(accelerationFactor)
      En4.push(efficiency)
      Dn4.push(rang)

      KyN.push([i, KyN1[i - 1], KyN2[i - 1], KyN3[i - 1], KyN4[i - 1]])
      En.push([i, En1[i - 1], En2[i - 1], En3[i - 1], En4[i - 1]])
      Dn.push([i, Dn1[i - 1], Dn2[i - 1], Dn3[i - 1], Dn4[i - 1]])

      calculate(i, 1, 1, 1)
      KyR1.push(accelerationFactor)
      Er1.push(efficiency)
      Dr1.push(rang)
      calculate(i, 1, 1, 2)
      KyR2.push(accelerationFactor)
      Er2.push(efficiency)
      Dr2.push(rang)
      calculate(i, 1, 1, 3)
      KyR3.push(accelerationFactor)
      Er3.push(efficiency)
      Dr3.push(rang)
      calculate(i, 1, 1, 4)
      KyR4.push(accelerationFactor)
      Er4.push(efficiency)
      Dr4.push(rang)

      KyR.push([i, KyR1[i - 1], KyR2[i - 1], KyR3[i - 1], KyR4[i - 1]])
      Er.push([i, Er1[i - 1], Er2[i - 1], Er3[i - 1], Er4[i - 1]])
      Dr.push([i, Dr1[i - 1], Dr2[i - 1], Dr3[i - 1], Dr4[i - 1]])
    }

    drawGraphic("1", "2", "3", "4", KyN, "n", "Ky", "ku-n")
    drawGraphic("1", "2", "3", "4", En, "n", "e", "e-n")
    drawGraphic("1", "2", "3", "4", Dn, "n", "D", "d-n")
    drawGraphic("1", "2", "3", "4", KyR, "r", "Ky", "ku-r")
    drawGraphic("1", "2", "3", "4", Er, "r", "e", "e-r")
    drawGraphic("1", "2", "3", "4", Dr, "r", "D", "d-r")
  }

  function drawGraphic(name1, name2, name3, name4, rows, horizontalTitle, verticalTitle, elementId) {
    var data = new google.visualization.DataTable()
    data.addColumn('number', 'X')
    data.addColumn('number', name1)
    data.addColumn('number', name2)
    data.addColumn('number', name3)
    data.addColumn('number', name4)
    data.addRows(rows)

    var options = {
      hAxis: {
        title: horizontalTitle
      },
      vAxis: {
        title: verticalTitle
      },
    }

    var chart = new google.visualization.LineChart(document.getElementById(elementId))
    chart.draw(data, options)
  }
})

// Lsum = Tn
// Lavg = T1 / r
// D = Lsum / Lavg

// Hint: This is a good place to declare your global variables


const width = 1000;
const height = 600;

const quickChartWidth = 1000;
const quickChartHeight = 600;

const dateColumns = []
let countryData = {}
let countryNames = []

const countryElem = document.getElementById('country')
const dateElem = document.getElementById('date')
const durationElem = document.getElementById('duration')
const bubbleDateFromElem = document.getElementById('bubbleDateFrom')

const barChartElem = document.getElementById('barChart')
const lollipopChartElem = document.getElementById('lollipopChart')
const bubbleChartElem = document.getElementById('bubbleChart')
const quickChartElem = document.getElementById('quickChart')

let currentDayIndex = 0

// This function is called once the HTML page is fully loaded by the browser

function showPieChartAdvices(type, targetCountry, dateFromIndex, dateToIndex) {
    ShowAdvices([
        {
            title: `Show ${type} cases from ${dateColumns[dateFromIndex]} to ${dateColumns[dateToIndex]}`,
            callback() {
                $('#quickChartModel').modal('show');

                let tmpData = []
                if (type === 'confirmed') {
                    tmpData = queryConfirmedInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
                } else if (type === 'deaths') {
                    tmpData = queryDeathsInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
                } else if (type === 'recovered') {
                    tmpData = queryRecoveredInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
                }
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },
        {
            title: `Show daily ${type} cases from ${dateColumns[dateFromIndex]} to ${dateColumns[dateToIndex]}`,
            callback() {
                $('#quickChartModel').modal('show');

                let tmpData = []
                if (type === 'confirmed') {
                    tmpData = queryDailyConfirmedInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
                } else if (type === 'deaths') {
                    tmpData = queryDailyDeathsInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
                } else if (type === 'recovered') {
                    tmpData = queryDailyRecoveredInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
                }
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },

    ])
}


function showBarChartAdvices(date) {
    ShowAdvices([
        {
            title: `Show each country confirmed case at ${formatShortDate(date)}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryAtDate(countryData, countryNames, dateColumns, date)
                DrawPieChart('#quickChartSvg', width, height, 50, tmpData.map(x => ({
                    key: x.key,
                    value: x.confirmed
                })))
                console.log(tmpData)
            }
        },
        {
            title: `Show each country deaths case at ${formatShortDate(date)}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryAtDate(countryData, countryNames, dateColumns, date)
                DrawPieChart('#quickChartSvg', width, height, 50, tmpData.map(x => ({
                    key: x.key,
                    value: x.deaths
                })))
                console.log(tmpData)
            }
        },
        {
            title: `Show each country recovered case at ${formatShortDate(date)}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDailyAtDate(countryData, countryNames, dateColumns, date)
                DrawPieChart('#quickChartSvg', width, height, 50, tmpData.map(x => ({
                    key: x.key,
                    value: x.recovered
                })))
                console.log(tmpData)
            }
        },
        {
            title: `Show each country daily confirmed case at ${formatShortDate(date)}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDailyAtDate(countryData, countryNames, dateColumns, date)
                DrawPieChart('#quickChartSvg', width, height, 50, tmpData.map(x => ({
                    key: x.key,
                    value: x.confirmed
                })))
                console.log(tmpData)
            }
        },
        {
            title: `Show each country daily deaths case at ${formatShortDate(date)}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDailyAtDate(countryData, countryNames, dateColumns, date)
                DrawPieChart('#quickChartSvg', width, height, 50, tmpData.map(x => ({
                    key: x.key,
                    value: x.deaths
                })))
                console.log(tmpData)
            }
        },
        {
            title: `Show each country daily recovered case at ${formatShortDate(date)}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryAtDate(countryData, countryNames, dateColumns, date)
                DrawPieChart('#quickChartSvg', width, height, 50, tmpData.map(x => ({
                    key: x.key,
                    value: x.recovered
                })))
                console.log(tmpData)
            }
        }
    ])
}

function showBubbleChartAdvices(country, durationDays) {
    let startIndex = currentDayIndex
    let endIndex = startIndex + durationDays
    if (endIndex >= dateColumns.length) {
        endIndex = dateColumns.length - 1
    }
    ShowAdvices([
        {
            title: `Show confirm cases from ${formatShortDate(dateColumns[startIndex])} to ${formatShortDate(dateColumns[endIndex])} in ${country}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryConfirmedInDateRange(countryData, countryNames, dateColumns, country, startIndex, endIndex)
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },
        {
            title: `Show deaths cases from ${formatShortDate(dateColumns[startIndex])} to ${formatShortDate(dateColumns[endIndex])} in ${country}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDeathsInDateRange(countryData, countryNames, dateColumns, country, startIndex, endIndex)
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },
        {
            title: `Show recovered cases from ${formatShortDate(dateColumns[startIndex])} to ${formatShortDate(dateColumns[endIndex])} in ${country}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryRecoveredInDateRange(countryData, countryNames, dateColumns, country, startIndex, endIndex)
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },
        {
            title: `Show daily confirm cases from ${formatShortDate(dateColumns[startIndex])} to ${formatShortDate(dateColumns[endIndex])} in ${country}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDailyConfirmedInDateRange(countryData, countryNames, dateColumns, country, startIndex, endIndex)
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },
        {
            title: `Show daily deaths cases from ${formatShortDate(dateColumns[startIndex])} to ${formatShortDate(dateColumns[endIndex])} in ${country}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDailyDeathsInDateRange(countryData, countryNames, dateColumns, country, startIndex, endIndex)
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },
        {
            title: `Show daily recovered cases from ${formatShortDate(dateColumns[startIndex])} to ${formatShortDate(dateColumns[endIndex])} in ${country}`,
            callback() {
                $('#quickChartModel').modal('show');
                const tmpData = queryDailyRecoveredInDateRange(countryData, countryNames, dateColumns, country, startIndex, endIndex)
                DrawBarChart('#quickChartSvg', quickChartWidth, quickChartHeight, 100, tmpData, {
                    mouseMoveCallback(d, i) {
                        showTooltipHtml(quickChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
                    }, mouseOutCallback(d, i) {
                        removeAllTooltip(quickChartElem)
                    }
                });
            }
        },

    ])
}

function generateReport() {
    const targetCountry = countryElem.value
    const dateFrom = dateElem.value
    const durationDays = parseInt(durationElem.value)
    let dateFromIndex = dateColumns.indexOf(dateFrom)
    let dateToIndex = dateFromIndex + durationDays
    if (dateToIndex + durationDays >= dateColumns.length) {
        dateToIndex = dateColumns.length - 1
    }
    quickChartElem.style.width = `${quickChartWidth}px`
    quickChartElem.style.height = `${quickChartHeight}px`


    $('.dateFrom').text(formatShortDate(dateFrom))
    $('.dateTo').text(formatShortDate(dateColumns[dateToIndex]))

    const dataForPieChart = queryTotalInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    DrawPieChart('#pieChartSvg', width, height, 50, dataForPieChart, {
        clickCallback(d, i) {
            const type = i.key
            showPieChartAdvices(type, targetCountry, dateFromIndex, dateToIndex)
        }
    });


    const dataForBarChart = queryDailyDeathsInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    DrawBarChart('#barChartSvg', width, height, 100, dataForBarChart, {
        clickCallback(d, i) {
            showBarChartAdvices(i.key)
        }, mouseMoveCallback(d, i) {
            showTooltipHtml(barChartElem, buildPropertyTableTooltip(['Date', 'Value'], [formatShortDate(i.key), i.value]), d.layerX, d.layerY)
        }, mouseOutCallback(d, i) {
            removeAllTooltip(barChartElem)
        }
    });

    const dataForLollipopChart1 = queryConfirmedInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    const dataForLollipopChart2 = queryDeathsInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    const dataForLollipopChart3 = queryRecoveredInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    DrawLollipopChart('#lollipopChartSvg', width, height, 100, dataForLollipopChart1, dataForLollipopChart2, dataForLollipopChart3);

    const tmp = queryAtDate(countryData, countryNames, dateColumns, dateFrom)
    const bubbleData = buildBubbleData(tmp, 'confirmed', 'deaths')
    DrawBubbleChart('#bubbleChartSvg', width, 800, 100, bubbleData, {
        clickCallback(d, i) {
            const country = i.datum.data.key
            showBubbleChartAdvices(country, durationDays)
        },
        mouseMoveCallback(d, i) {
            showTooltipHtml(bubbleChartElem, buildPropertyTableTooltip(['Country', 'Confirmed', 'Deaths', 'Recovered'], [i.datum.data.key, i.datum.data.confirmed, i.datum.data.deaths, i.datum.data.recovered]), d.layerX, d.layerY)
        }, mouseOutCallback(d, i) {
            removeAllTooltip(bubbleChartElem)
        }
    })

    currentDayIndex = dateFromIndex
    bubbleDateFromElem.innerText = dateColumns[currentDayIndex]

}

function onPrevDayClick() {
    const durationDays = parseInt(durationElem.value)

    if (currentDayIndex - 1 >= 0) {
        currentDayIndex--;
        const tmp = queryAtDate(countryData, countryNames, dateColumns, dateColumns[currentDayIndex])
        const bubbleData = buildBubbleData(tmp, 'confirmed', 'deaths')
        UpdateBubbleChart('#bubbleChartSvg', width, 800, 100, bubbleData, {
            clickCallback(d, i) {
                const country = i.datum.data.key
                showBubbleChartAdvices(country, durationDays)
            },
            mouseMoveCallback(d, i) {
                showTooltipHtml(bubbleChartElem, buildPropertyTableTooltip(['Country', 'Confirmed', 'Deaths', 'Recovered'], [i.datum.data.key, i.datum.data.confirmed, i.datum.data.deaths, i.datum.data.recovered]), d.layerX, d.layerY)
            }, mouseOutCallback(d, i) {
                removeAllTooltip(bubbleChartElem)
            }
        })
        bubbleDateFromElem.innerText = dateColumns[currentDayIndex]
    }
}

function onNextDayClick() {
    const durationDays = parseInt(durationElem.value)

    if (currentDayIndex + 1 < dateColumns.length) {
        currentDayIndex++;
        const tmp = queryAtDate(countryData, countryNames, dateColumns, dateColumns[currentDayIndex])
        const bubbleData = buildBubbleData(tmp, 'confirmed', 'deaths')
        UpdateBubbleChart('#bubbleChartSvg', width, 800, 100, bubbleData, {
            clickCallback(d, i) {
                const country = i.datum.data.key
                showBubbleChartAdvices(country, durationDays)
            },
            mouseMoveCallback(d, i) {
                showTooltipHtml(bubbleChartElem, buildPropertyTableTooltip(['Country', 'Confirmed', 'Deaths', 'Recovered'], [i.datum.data.key, i.datum.data.confirmed, i.datum.data.deaths, i.datum.data.recovered]), d.layerX, d.layerY)
            }, mouseOutCallback(d, i) {
                removeAllTooltip(bubbleChartElem)
            }
        })
        bubbleDateFromElem.innerText = dateColumns[currentDayIndex]
    }

}

document.addEventListener('DOMContentLoaded', function () {
    // This will load your two CSV files and store them into two arrays.
    Promise.all([d3.csv('data/time_series_covid19_confirmed_global.csv'), d3.csv('data/time_series_covid19_deaths_global.csv'), d3.csv('data/time_series_covid19_recovered_global.csv')])
        .then(function (values) {
            console.log('loaded from csv');
            const all_data = values[0];
            for (let i = 4; i < all_data.columns.length && i < 800; i++) {
                dateColumns.push(all_data.columns[i]);
            }

            const [countries, confirmed_data] = processCsvCombineCountries(values[0], dateColumns)
            const [countries2, death_data] = processCsvCombineCountries(values[1], dateColumns)
            const [countries3, recovered_data] = processCsvCombineCountries(values[2], dateColumns)

            countryNames = countries
            countryData = processCsvDataCombine(confirmed_data, death_data, recovered_data, countries, dateColumns)

            console.log(countryNames)
            console.log(countryData)

            buildCountryCombobox(countryElem, countryNames)
            buildDateCombobox(dateElem, dateColumns)
            buildDurationCombobox(durationElem, 10, 40)

            countryElem.value = 'US'
            dateElem.value = '10/26/20'

            generateReport()
        });
});


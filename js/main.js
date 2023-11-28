// Hint: This is a good place to declare your global variables


const width = 1000;
const height = 600;

const dateColumns = []
let countryData = {}
let countryNames = []

const myDataVisElem = document.getElementById('myDataVis')

const countryElem = document.getElementById('country')
const dateElem = document.getElementById('date')
const durationElem = document.getElementById('duration')

const barChartElem = document.getElementById('barChart')
const lollipopChartElem = document.getElementById('lollipopChart')
const bubbleChartElem = document.getElementById('bubbleChart')

// This function is called once the HTML page is fully loaded by the browser

function generateReport() {
    const targetCountry = countryElem.value
    const dateFrom = dateElem.value
    const durationDays = parseInt(durationElem.value)
    let dateFromIndex = dateColumns.indexOf(dateFrom)
    let dateToIndex = dateFromIndex + durationDays
    if (dateToIndex + durationDays >= dateColumns.length) {
        dateToIndex = dateColumns.length - 1
    }


    $('.dateFrom').text(formatShortDate(dateFrom))
    $('.dateTo').text(formatShortDate(dateColumns[dateToIndex]))

    const dataForPieChart =  queryTotalInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    DrawPieChart('#pieChartSvg', width, height, 50, dataForPieChart,  {

    });


    const dataForBarChart = queryDailyDeathsInDateRange(countryData, countryNames, dateColumns, targetCountry, dateFromIndex, dateToIndex)
    DrawBarChart('#barChartSvg', width, height, 50, dataForBarChart,  {
        clickCallback(d, i) {
            console.log(d)
            console.log(i)
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
    DrawBubbleChart('#bubbleChartSvg', width, 800, 100, bubbleData)
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

            countryElem.value = 'China'
        });
});


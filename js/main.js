// Hint: This is a good place to declare your global variables
let female_data = [];
let male_data = [];
let countries = [];
let minYear = 0;
let maxYear = 0;
let svg = null;
let selectElem = null;

const width = 1000;
const height = 600;

const dateColumns = []


// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
    // This will load your two CSV files and store them into two arrays.
    Promise.all([d3.csv('data/COVID-19_Confirmed_Cases.csv')])
        .then(function (values) {
            console.log('loaded from csv');
            const all_data = values[0];
            console.log(all_data)
            console.log(all_data.columns)
            for (let i = 4; i < all_data.columns.length; i++) {
                dateColumns.push(all_data.columns[i]);
            }
            console.log(dateColumns)
            console.log(all_data[0])

            const sampleItem = all_data[60]
            const sampleData = []
            for (let i = 0; i < 10; i++) {
                const date = dateColumns[i]
                const value = parseInt(sampleItem[date])
                sampleData.push({
                    key: date,
                    value: value
                })
            }
            console.log(sampleData)

            DrawBarChart("#bar_svg", width, height, 50, sampleData)
        });
});


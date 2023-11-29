function queryTotalInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let confirmed = 0
    let deaths = 0
    let recovered = 0
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]
        confirmed += item.confirmed
        deaths += item.deaths
        recovered += item.recovered
    }
    return [
        {key: 'confirmed', value: confirmed},
        {key: 'deaths', value: deaths},
        {key: 'recovered', value: recovered},
    ]
}

function queryConfirmedInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let result = []
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]

        result.push({key: date, value: item.confirmed})
    }
    return result
}

function queryDeathsInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let result = []
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]
        result.push({key: date, value: item.deaths})
    }
    return result
}

function queryRecoveredInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let result = []
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]
        result.push({key: date, value: item.recovered})
    }
    return result
}

function queryDailyConfirmedInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let result = []
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]

        result.push({key: date, value: item.daily_confirmed})
    }
    return result
}

function queryDailyDeathsInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let result = []
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]
        result.push({key: date, value: item.daily_deaths})
    }
    return result
}

function queryDailyRecoveredInDateRange(countryData, countryNames, dateColumns, targetCountryName, startDateIndex, endDateIndex) {
    let result = []
    for (let i = startDateIndex; i < endDateIndex; i++) {
        const date = dateColumns[i]
        const item = countryData[targetCountryName][date]
        result.push({key: date, value: item.daily_recovered})
    }
    return result
}


function queryAtDate(countryData, countryNames, dateColumns, targetDate) {
    let result = []

    for (const country of countryNames) {
        const item = countryData[country][targetDate]
        result.push({key: country, confirmed: item.confirmed, deaths: item.deaths, recovered: item.recovered})
    }
    return result
}

function queryDailyAtDate(countryData, countryNames, dateColumns, targetDate) {
    let result = []

    for (const country of countryNames) {
        const item = countryData[country][targetDate]
        result.push({key: country, confirmed: item.daily_confirmed, deaths: item.daily_deaths, recovered: item.daily_recovered})
    }
    return result
}

function buildBubbleData(data, xField, rField) {
    const result = []
    for (let item of data) {
        const x =  item[xField]
        const r =  item[rField]
        result.push({
            data: item,
            x, r,
        })
    }
    var colorScale = d3.scaleLinear()
        .domain([0, result.length]) // Set the input domain
        .range(["#7B002D", "#D3B0D5"]); // Set the output range of colors
    let index = 0
    for (let item of result) {
        item.color = colorScale(index)
        index++
    }

    return result
}


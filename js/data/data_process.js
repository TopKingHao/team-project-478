function processCsvCombineCountries(data, dateColumns) {
    const countryList = []
    const countrySet = new Set()
    const countryData = {}
    for (let i = 0; i < data.length; i++) {
        const country = data[i]['Country/Region']
        if (!countrySet.has(country)) {
            countrySet.add(country)
            countryList.push(country)
            countryData[country] = {}
        }
    }
    countryList.sort()

    for (let i = 0; i < dateColumns.length; i++) {
        const date = dateColumns[i]
        for (let j = 0; j < data.length; j++) {
            const country = data[j]['Country/Region']
            const value = parseInt(data[j][date])
            if (date in countryData[country]) {
                countryData[country][date] += value
            } else {
                countryData[country][date] = value
            }
        }
    }
    return [countryList, countryData]
}

function processCsvDataCombine(confirmed, deaths, recovered, countryList, dateColumns) {
    const countryData = {}
    for (const country of countryList) {
        countryData[country] = {}
        for (const date of dateColumns) {
            countryData[country][date] = {}
        }
    }

    for (const country of countryList) {
        for (const date of dateColumns) {
            countryData[country][date]['confirmed'] = confirmed[country][date]
            countryData[country][date]['deaths'] = deaths[country][date]
            countryData[country][date]['recovered'] = recovered[country][date]
        }
    }

    for (const country of countryList) {
        for (let i = 0; i < dateColumns.length; i++) {
            const date = dateColumns[i]
            if (i === 0) {
                countryData[country][date]['daily_confirmed'] = confirmed[country][date]
                countryData[country][date]['daily_deaths'] = deaths[country][date]
                countryData[country][date]['daily_recovered'] = recovered[country][date]
            } else {
                const prevDate = dateColumns[i - 1]

                let daily_confirmed = confirmed[country][date] - confirmed[country][prevDate]
                if (daily_confirmed < 0) {
                    daily_confirmed = 0
                }
                countryData[country][date]['daily_confirmed'] = daily_confirmed

                let daily_deaths = deaths[country][date] - deaths[country][prevDate]
                if(daily_deaths < 0) {
                    daily_deaths = 0;
                }
                countryData[country][date]['daily_deaths'] = daily_deaths

                let daily_recovered = recovered[country][date] - recovered[country][prevDate]
                if(daily_recovered < 0) {
                    daily_recovered = 0;
                }
                countryData[country][date]['daily_recovered'] = daily_recovered
            }
        }
    }


    return countryData
}

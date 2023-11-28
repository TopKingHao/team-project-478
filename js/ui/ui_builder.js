function buildCountryCombobox(targetElem, countryNames) {
    targetElem.innerHTML = ''
    for (const countryName of countryNames) {
        const option = document.createElement('option')
        option.value = countryName
        option.innerText = countryName
        targetElem.append(option)
    }
}


function formatShortDate(shortDateString) {
    const parts = shortDateString.split('/')
    return`${parts[0]}/${parts[1]}/20${parts[2]}`
}

function buildDateCombobox(targetElem, validDates) {
    targetElem.innerHTML = ''
    for (const date of validDates) {
        const option = document.createElement('option')
        option.value = date
        option.innerText = formatShortDate(date)
        targetElem.append(option)
    }
}

function buildDurationCombobox(targetElem, from, to) {
    for (let i = from; i <= to; i++) {
        const option = document.createElement('option')
        option.value = i
        option.innerText = i.toString()
        targetElem.append(option)
    }
}

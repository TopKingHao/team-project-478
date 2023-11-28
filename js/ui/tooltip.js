
function showTooltipHtml(svgTooltipLayer, htmlElem, x, y) {
    removeAllTooltip(svgTooltipLayer)
    svgTooltipLayer.append(htmlElem)
    htmlElem.style.left = `${x}px`
    htmlElem.style.top = `${y}px`

}

function removeAllTooltip(svgTooltipLayer) {
    const allTooltips = svgTooltipLayer.querySelectorAll('.tooltip')
    for (let i = 0; i < allTooltips.length; i++) {
        allTooltips[i].remove()
    }
}


function buildSimpleTooltip(text) {
    const div = document.createElement('div')
    div.className = 'tooltip'
    return div
}

function buildPropertyTableTooltip(propNames, propValues) {
    const div = document.createElement('div')
    div.className = 'tooltip'
    for (let i=0;i<propNames.length;i++) {
        const row = document.createElement('div')
        const label = document.createElement('span')
        label.className = 'label'
        label.innerText = propNames[i]+": "
        const value = document.createElement('span')
        value.innerText = propValues[i]
        value.className = 'value'
        row.append(label)
        row.append(value)
        div.append(row)
    }

    return div

}
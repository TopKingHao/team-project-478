
function createAdvice(title, callback) {
    let adviceElement = document.createElement('div')
    adviceElement.classList.add('advice')
    adviceElement.innerHTML = title
    adviceElement.addEventListener('click', callback)
    return adviceElement
}

function ShowAdvices(advices) {
    const advicesElem = document.getElementById('advices')
    advicesElem.innerHTML = ''
    for (let i = 0; i < advices.length; i++) {
        let advice = advices[i]
        let title = advice.title
        let callback = advice.callback
        const adviceElement = createAdvice(title, callback)
        advicesElem.append(adviceElement)
    }
}
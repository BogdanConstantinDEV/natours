const hideAlert = () => {
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

export const showAlert = (type, message) => {
    hideAlert()
    const el = `<div class='alert alert--${type}'>${message}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', el)
    window.setTimeout(hideAlert, 5000)
}
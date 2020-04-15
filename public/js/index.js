import '@babel/polyfill'
import { getMap } from './mapBox'
import { login, logout } from './login'
import { signup } from './signup'
import { updateSettings } from './updateSettings'


// DOM ELEMENTS
const mapDiv = document.querySelector('#map')
const loginForm = document.querySelector('.form__login')
const signupForm = document.querySelector('.form__singup')
const logoutButton = document.querySelector('.nav__el--logout')
const updateUserDataForm = document.querySelector('.form.form-user-data')
const updateUserPasswordForm = document.querySelector('.form-user-password')





// DECLARATIONS

// mapbox
if (mapDiv) {
    const locations = JSON.parse(mapDiv.dataset.locations)
    console.log(locations)
    getMap(locations)
}


// log in
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const email = loginForm.querySelector('#email').value
        const password = loginForm.querySelector('#password').value
        login(email, password)
    })
}


// log out
if (logoutButton) {
    logoutButton.addEventListener('click', logout)
}



// update my data 
if (updateUserDataForm) {
    updateUserDataForm.addEventListener('submit', e => {
        e.preventDefault()
        const form = new FormData()
        form.append('name', updateUserDataForm.querySelector('#name').value)
        form.append('email', updateUserDataForm.querySelector('#email').value)
        form.append('photo', updateUserDataForm.querySelector('#photo').files[0])
        updateSettings(form, 'data')
    })
}




// update my password
if (updateUserPasswordForm) {
    updateUserPasswordForm.addEventListener('submit', async e => {
        e.preventDefault()
        updateUserPasswordForm.querySelector('.btn--submit-password').textContent = 'Updating...'

        const oldPassword = updateUserPasswordForm.querySelector('#password-current').value
        const newPassword = updateUserPasswordForm.querySelector('#password').value
        const newPasswordConfirm = updateUserPasswordForm.querySelector('#password-confirm').value

        await updateSettings({ oldPassword, newPassword, newPasswordConfirm }, 'password')

        updateUserPasswordForm.querySelector('#password-current').value = ''
        updateUserPasswordForm.querySelector('#password').value = ''
        updateUserPasswordForm.querySelector('#password-confirm').value = ''

        updateUserPasswordForm.querySelector('.btn--submit-password').textContent = 'Save settings'
    })
}




// sign up
if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault()
        const name = signupForm.querySelector('#name').value
        const email = signupForm.querySelector('#email').value
        const password = signupForm.querySelector('#password').value
        const passwordConfirm = signupForm.querySelector('#password-confirm').value
        signup({ name, email, password, passwordConfirm })
    })
}
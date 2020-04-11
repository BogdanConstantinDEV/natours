const axios = require('axios')
import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:3000/api/v1/users/${type === 'password' ? 'update-my-password' : 'update-me'}`,
            data
        })

        if (res.data.status === 'success') showAlert('success', `${type.toUpperCase()} updated successfuly`)
    }
    catch (err) {
        showAlert('error', err.response.data.message)
    }
}
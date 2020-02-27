const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'user must have a name'],
            maxlength: [40, 'name length must be <= 40'],
            minlength: [4, 'name length must be >= 4']
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'user must have a email'],
            validate: [validator.isEmail, 'use a valid email']
        },
        photo: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'user must have a password'],
            minlength: [8, 'password length must be >= 8']
        },
        passwordConfirm: {
            type: String,
            required: [true, 'user must confirm the password'],
            validate: {
                validator: function (val) {
                    return val === this.password
                }
            },
            message: 'password should match'
        }
    }
)

const User = new mongoose.model('User', userSchema)
module.exports = User
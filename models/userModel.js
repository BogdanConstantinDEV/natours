const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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
            validate: [validator.isEmail, 'use a valid email'],
            lowercase: true
        },
        photo: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'user must have a password'],
            minlength: [8, 'password length must be >= 8'],
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'user must confirm the password'],
            validate: {
                validator: function (val) {
                    return val === this.password
                },
                message: 'password should match'
            }
        }
    }
)


// encrypt password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined

    next()
})

// verify if passwords match
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}


const User = new mongoose.model('User', userSchema)
module.exports = User
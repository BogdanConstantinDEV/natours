const crypto = require('crypto')
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
            type: String,
            default: 'default.jpg'
        },
        role: {
            type: String,
            enum: ['admin', 'lead-guide', 'guide', 'user'],
            default: 'user'
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
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
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

// add changed password timestamp
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000

    return next()
})

// filter out inactive users
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })

    next()
})





// verify if passwords match
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

// check if user changed passwords
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {

    if (this.passwordChangedAt) {
        changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }

    return false
}

// create reset token
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetExpires = Date.now() + 1000 * 60 * 10

    return resetToken
}




const User = new mongoose.model('User', userSchema)
module.exports = User
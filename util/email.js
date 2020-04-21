const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')

module.exports = class Email {
    constructor(user, url) {
        this.user = user
        this.url = url
        this.firstName = user.name.split(' ')[0]
        this.from = `Bogdan Constantin ${process.env.EMAIL_FROM}`
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }
    async send(template, subject) {

        // render html file
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            subject,
            firstName: this.firstName,
            url: this.url
        })

        // send options
        const mailOptions = {
            from: this.from,
            to: this.user.email,
            subject,
            html,
            text: htmlToText.fromString(html)
        }

        // send the email
        await this.newTransport().sendMail(mailOptions)
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to Natours Family')
    }
    async passwordReset() {
        await this.send('passwordReset', 'Your password reset token ( valid for 10 minutes )')
    }
}
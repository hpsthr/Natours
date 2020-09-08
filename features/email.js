const nodemailer = require('nodemailer')
const express = require('express')
const pug = require("pug")
const htmlToText = require('html-to-text')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name.split(" ")[0]
        this.url = url
        this.from = `Hitesh Suthar <admin@designhack.in>`
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.EHOST,
            port: process.env.EPORT,
            auth: {
                user: process.env.EUSER,
                pass: process.env.EPASS
            }
        })
    }

    async send(template, subject) {
        //render a template 

        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        //define a user eamil details
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send("welcome", "welcome inside designhack")
    }
    async sendVerification() {
        await this.send("verification", "Please Verify your Email")
    }
    async resetPassword(){
        await this.send("resetpassword", "Password Reset Link")
    }


}
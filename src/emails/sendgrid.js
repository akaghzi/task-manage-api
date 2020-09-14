const sgMail = require('@sendgrid/mail')
const sendGridAPI = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPI)

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'akaghzi@em9880.exp10x.com',
        text: 'Welcome to the application',
        subject: `Welcome ${name}`
    })
}

const sendGoodbyeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'akaghzi@em9880.exp10x.com',
        text: 'Sorry to see you go, hope you rethink your decision and resignup for our application',
        subject: `Goodbye ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
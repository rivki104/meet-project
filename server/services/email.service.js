const nodemailer = require("nodemailer");

//שליחת מייל להזמנה לשיחה
const sendJoinEmail = (email, room, userEmail) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'meet.application.project@gmail.com',
            pass: 'meetappproject‏',
        }
    });

    const mailOptions = {
        from: 'meet.application.project@gmail.com',
        to: email,
        subject: `${userEmail} invites you to a conversation`,
        // html: `<a id="btnConnectCall" href="https://meet-app-project.herokuapp.com/#connection/${room}">
        // Click to join the conversation</a> `
        html: `<a id="btnConnectCall" href="http://localhost:3000/#connection/${room}">
        Click to join the conversation</a> `
    };

    //הפעלת הפונקציה לשליחת המייל
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

module.exports = {
    sendJoinEmail,
}
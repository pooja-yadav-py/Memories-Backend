const nodemailer = require("nodemailer");

function EmailSent(id){     
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kumarbasant229@gmail.com',
            pass: 'dmhihezwbiktsckt'
        }
    });
    
    let mailDetails = {
        from: 'basantkumaralwar@gmail.com',
        to: 'mispooju@gmail.com',
        subject: 'Test mail',
        html: `<a href="http://localhost:3000/resetpassword/${id}">Confirm</a>`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}


module.exports = EmailSent;
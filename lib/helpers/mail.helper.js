const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
require('dotenv').config();

exports.sendEmail = async (obj) => {
    //Generating test SMT service account from ethreal.email
    //it is used when we don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        //create reusable transporter object using defaut SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        //setting up email data
        let mailOptions = {
            from: 'someone@somemail.com',//sender address
            to: obj.mail,//receiver
            subject: 'User confirmation',
            text: `Click this link to verify your email ` + obj.lnk,
            // html:'<b></b>'
        };
        //send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("i am here");
                return console.log(error);
            }
            //console.log(info);
            console.log('Message sent : %s', info.messageId);
            //Preview only available when sending through an Ethreal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        })
    })
    return;
};

exports.sendEmailSES = async (obj) => {

    let options = {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET,
        region: process.env.REGION
    };

    let transporter = nodemailer.createTransport(ses(options));

    let mailOptions = {
        from: 'nodebeats@gmail.com',//sender address
        to: obj.mail,//receiver
        subject: 'User confirmation',
        text: `Click this link to verify your email ` + obj.lnk,
        // html:'<b></b>'
    };
    transporter.sendMail(mailOptions)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            return console.log(err);
        });
}
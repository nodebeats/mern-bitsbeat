const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
require('dotenv').config();

exports.sendEmail = async (obj, req) => {

    //setting up email data
    let mailOptions = {
        from: 'someone@somemail.com',//sender address
        to: obj.mail,//receiver
        subject: 'User confirmation',
        //text: `Click this link to verify your email ` + obj.lnk,
        html:`<p>Click this link to verify your email</p>
        <br/>
        <a href=${obj.lnk}>
        ${obj.lnk}</a>
        `
    };

    let newsSubscriptionMail = {
        from: 'someone@somemail.com',//sender address
        to: obj.mail,//receiver
        subject: 'News Subscription',
        //text: `Thank you for subscribing for our news letter.`,
        html:`<p>Thank you for subscribing for our news letter.Click this link to unscubscribe: <a href="http://localhost:8000/api/user/unsubscribe/${obj.id}">unsubscribe</a></p>`
    };
    if (req.route.path === "/") {
        sendmail(mailOptions);
    }


    if (obj.sbscr === true || obj.sbscr === "true") {
        sendmail(newsSubscriptionMail);
    }
    return;
};

const sendmail = (option) => {
    //Generating test SMT service account from ethreal.email
    //it is used when we don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        //create reusable transporter object using defaut SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        transporter.sendMail(option, (error, info) => {
            if (error) {
                console.log("i am here");
                return console.log(error);
            }
            //console.log(info);
            console.log('Message sent : %s', info.messageId);
            //Preview only available when sending through an Ethreal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        })
    });
}

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
        //text: `Click this link to verify your email ` + obj.lnk,
        // html:'<b></b>'
        html:`<p>Click this link to verify your email</p>
        <br/>
        <a href=${obj.lnk}>
        ${obj.lnk}</a>
        `
    };
    transporter.sendMail(mailOptions)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            return console.log(err);
        });
}


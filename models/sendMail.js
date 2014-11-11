/**
 * Created by Administrator on 2014/5/24.
 */
var nodemailer = require("nodemailer");
//var smtpT = require('nodemailer-smtp-transport');

function sendmail(options){
    this.from = options.from;
    this.to = options.to;
    this.subject = options.subject;
    this.text = options.text;
    this.html = options.html;
    this.attachments = options.attachments;
}
module.exports = sendmail;

sendmail.prototype.send = function(callback) {
// create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport({
        host:"smtp.qq.com",
        secureConnection: true, // 使用 SSL
        port: 587, // SMTP 端口465/587
        auth: {
            user: "182820011@qq.com",
            pass: "yellowwen"
        }
    });
// setup e-mail data with unicode symbols
    /*
    var mailOptions = {
        from: "182820011@qq.com", // sender address
        to: "182820771@qq.com", // list of receivers
        subject: "邮件测试1", // Subject line
        text: "邮件测试标题", // plaintext body
        html: "<b>邮件测试主体内容</b>" // html body
        ,attachments: [
            {
                filename: 'text0.txt',
                content: 'hello world!'
            }
            ,{
                filename: 'text1.txt',
                path: './attach/text1.txt'
            }
        ] //发附件
    };
    */
    var mailOptions = {
        from: this.from, // sender address
        to: this.to, // list of receivers
        subject: this.subject, // Subject line
        text: this.text, // plaintext body
        html: this.html, // html body
        attachments: this.attachments //发附件
    };

// send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        /*
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        */
        callback(error, response);
        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
};
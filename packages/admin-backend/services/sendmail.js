'use strict'

var nodemailer = require('nodemailer');

var isSendGrid = false;
var user = 'envios.resit@gmail.com';
var password = 'resit.1313';
var from = user;
var host = 'smtp.gmail.com';
var port = 465;
var secure = true; //STARTTLS

function sendMail(email, callback){

    if (isSendGrid) {
        var sgTransport = require('nodemailer-sendgrid-transport');
        var options = {
            auth: {
                api_user: user,
                api_key: password
            }
        }
        var smtpTransport = nodemailer.createTransport(sgTransport(options));
    } else {
        if (host.indexOf('gmail') >= 0) {
            var serverOptions = {
                service: 'Gmail'
            };
        } else {
            var serverOptions = {
                host: host,
                port: port,
                secure: secure,
            };
        }

        serverOptions.auth = {
            user: user,
            pass: password
        }

        var smtpTransport = nodemailer.createTransport(serverOptions);
    }

    email.from = from;

    smtpTransport.sendMail(email, function(err, result) {
        callback(err, result);
    });
}

module.exports = {
	sendMail
}
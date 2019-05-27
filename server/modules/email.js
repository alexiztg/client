var nodemailer = require('nodemailer')
var user = 'cobranza_7@gabssa.com.mx'
var pass= 'g@bss@'

module.exports.enviar = function(to, body, subject, attachment) {
  return new Promise (function (resolve, reject) {
    var transporter = nodemailer.createTransport({
      host: 'smtp.gabssa.com.mx',
      port: 587,
      secure: false,
      ignoreTLS: true,
      auth: {
       user: user,
       pass: pass
      }
    })

    var message = {
      from: '"Notificaciones Sistema GABSSA"<' + user + '>',
      to: to,
      subject: subject,
      html: body,
      attachments: []
    }

    if(attachment) {
      attachment.forEach(function (att) {
        message.attachments.push(att)
      });
    }

    transporter.sendMail(message, function(err) {
      if (!err) {
        console.log('Email enviado')
      } else {
        console.log(err)
      }
      resolve()
    })
  })
}

var nodemailer = require('nodemailer');


module.exports = {

    
    transporter : nodemailer.createTransport({

       service: 'Gmail',
        auth: {
          user: 'team@novafinance.app',
          pass: 'RTE27XwQ43Y2HrS'
        }
    })
}
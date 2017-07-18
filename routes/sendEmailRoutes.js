require('dotenv').config();
const express = require('express'),
      fs = require('fs'),
      path = require('path'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      sanitizer = require('express-sanitizer'),
      RateLimit = require('express-rate-limit'),
      aes256 = require('aes256'),
      router = express.Router(),
      emailLimiter = new RateLimit({
        windowMs: 5*60*1000,
        max: 3,
        delay: 0,
        handler: function(req, res) {
          res.format({
            json:function(){
              res.status(429).json({status:'Email limit exceeded.<br> Please try again later.'});
            }
          });
        }
      });

router.use(bodyParser.urlencoded({extended:true}));
router.use(sanitizer());
router.use('/send-email', emailLimiter);

let transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:process.env.EMAILUSER,
    pass: decryptHash(process.env.EMAILPW)
  }
});

router.post('/send-email', (req, res) => {
  let clientName = req.sanitize(req.body.name),
      clientNumber = req.sanitize(req.body.number),
      clientEmail= req.sanitize(req.body.email),
      clientSubject = req.sanitize(req.body.subject),
      clientMessage = req.sanitize(req.body.message);
  
  sendMail(clientName, clientNumber, clientEmail, clientSubject, clientMessage, res);
});

//send email function
function sendMail(name, number, email, subject, message, res) {
  let mailSettings = {
        to: process.env.FORWARDEMAIL,
        subject: subject,
        html: '<strong>Customer name: </strong>  ' + name + '<br><br><strong>Customer email address:  </strong>' + email  + '<br><br><strong>Phone number: </strong>' + number + 
        '<br><br><strong>Message:  </strong><br>' + message,
      },
      logger = fs.createWriteStream(path.join(__dirname, '..', 'logs/email-logs.txt'), {flags:'a'});
  transport.sendMail(mailSettings, (err, info) => {
    if (err) {
      //console.log(err);
      logger.write('\n!!!!!!!!!!!!!!!!!!!!');
      logger.write('\nERROR: ' + err);
      logger.write('\n!!!!!!!!!!!!!!!!!!!!');
      logger.end();
      res.status(500).json({status:'Error sending email.<br> Please try again', error:err});
    } else {
      //console.log('email %s sent: %s', info.messageId, info.response);
      logger.write('\nEmail sent!');
      logger.write('\nResponse: ' + info.response);
      logger.write('\nEmail address forwarded to: ' + info.accepted);
      logger.end();
      res.status(200).json({status:'Email was sent!', error:null}); 
    }
  });
}

function decryptHash(hash) {
  let salt = new RegExp(process.env.SALT, 'g'),
      pepper = new RegExp(process.env.PEPPER, 'g'),
      decrypted = aes256.decrypt(process.env.KEY, hash),
      unsalted = decrypted.replace(salt, ''),
      unpeppered = unsalted.replace(pepper, '');
  return unpeppered;
}

module.exports = router;
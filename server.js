require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const request = require('request');
const compression = require('compression');
const app = express();
app.set('port', process.env.PORT || 3000 );
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.resolve(__dirname, 'public')));

let transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:process.env.EMAILUSER,
    pass:process.env.EMAILPW
  }
});

app.get(/^\/(index)?$/, (req, res) => {
  res.sendFile(getFile('index'));
});

app.post('/send-email', (req, res) => {
  let clientName = req.body.name;
  let clientNumber = req.body.number;
  let clientEmail= req.body.email;
  let clientSubject = req.body.subject;
  let clientMessage = req.body.message;
  sendMail(clientName, clientNumber, clientEmail, clientSubject, clientMessage, res);
});

app.listen(app.get('port'), () => {
  console.log('server listening at port ' + app.get('port'));
});

function sendMail(name, number, email, subject, message, res) {
  let mailSettings = {
    to: process.env.FORWARDADDRESS,
    subject: subject,
    html: '<strong>Customer name: </strong>  ' + name + '<br><br><strong>Customer email address:  </strong>' + email  + '<br><br><strong>Phone number: </strong>' + number + 
    '<br><br><strong>Message:  </strong><br>' + message,
  }
  transport.sendMail(mailSettings, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({status:'Email wasn\'t sent!', error:err});
    } else {
      console.log('email %s sent: %s', info.messageId, info.response);
      res.status(200).json({status:'Email was sent successfully!', error:null}); 
    }
  });
}
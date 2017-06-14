require('dotenv').config();
const express = require('express'),
      path = require('path'),
      nodemailer = require('nodemailer'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      sanitizer = require('express-sanitizer'),
      RateLimit = require('express-rate-limit'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      aes256 = require('aes256');
      app = express(),
      emailLimiter = new RateLimit({
        windowMs: 5*60*1000,
        max: 3,
        delay: 0,
        handler: function(req, res) {
          res.format({
            json:function(){
              res.status(429).json({status:'Email limit exceeded.<br> Please try again later.'});
            }
          })
        }
      });

app.enable('trust proxy');
app.set('port', process.env.PORT || 3000 );
app.use(compression());
app.use(sanitizer());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/private', express.static(path.resolve(__dirname, 'private')));
app.use('/send-email', emailLimiter);

let transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:process.env.EMAILUSER,
    pass:decryptHash(process.env.EMAILPW)
  }
});

app.get(/^\/(index)?$/, (req, res) => {
  res.sendFile(getFile('index'));
});

app.get('/login', (req, res) => {
  res.sendFile(getFile('login'));
});

app.post('/send-email', (req, res) => {
  let clientName = req.sanitize(req.body.name);
  let clientNumber = req.sanitize(req.body.number);
  let clientEmail= req.sanitize(req.body.email);
  let clientSubject = req.sanitize(req.body.subject);
  let clientMessage = req.sanitize(req.body.message);
  sendMail(clientName, clientNumber, clientEmail, clientSubject, clientMessage, res);
});

app.post('/admin-login', (req, res) => {
  let username = req.sanitize(req.body.username);
  let password = req.sanitize(req.body.password);
  let auth = fakeAuth(username, password);
  if (!auth) {
    res.sendFile(getFile('login-failed'))
  } else {
    let privatePath = path.resolve(__dirname, 'private');
    let privateFile = path.resolve(privatePath,  'admin-page.html');
    res.sendFile(privateFile);
  }
});

app.listen(app.get('port'), () => {
  console.log('server listening at port ' + app.get('port'));
});

//get and return file path
function getFile(pathname) {
  let publicPath = path.resolve(__dirname, 'public');
  let filePath = path.resolve(publicPath, pathname +'.html');
  return filePath;
}

//send email function
function sendMail(name, number, email, subject, message, res) {
  let mailSettings = {
    to: process.env.FORWARDEMAIL,
    subject: subject,
    html: '<strong>Customer name: </strong>  ' + name + '<br><br><strong>Customer email address:  </strong>' + email  + '<br><br><strong>Phone number: </strong>' + number + 
    '<br><br><strong>Message:  </strong><br>' + message,
  }
  transport.sendMail(mailSettings, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({status:'Error sending email.<br> Please try again', error:err});
    } else {
      console.log('email %s sent: %s', info.messageId, info.response);
      res.status(200).json({status:'Email was sent!', error:null}); 
    }
  });
}

// fake auth function that i am testing
function fakeAuth(user, pass) {
  let admin = (user !== process.env.CLIENTUSER) ? false : (pass !== decryptHash(process.env.CLIENTPW))? false: true;
  return admin 
}

function decryptHash(hash) {
  let salt = new RegExp(process.env.SALT, 'g'),
      pepper = new RegExp(process.env.PEPPER, 'g'),
      decrypted = aes256.decrypt(process.env.KEY, hash),
      unsalted = decrypted.replace(salt, ''),
      unpeppered = unsalted.replace(pepper, '');
  return unpeppered;
}
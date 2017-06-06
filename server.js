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

app.get(/^\/(index)?$/, (req, res) => {
  res.sendFile(getFile('index'));
});

app.listen(app.get('port'), () => {
  console.log('server listening at port ' + app.get('port'));
});
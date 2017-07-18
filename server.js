require('dotenv').config();
const https = require('https'),
      express = require('express'),
      privateRoutes = require('./routes/privateRoutes.js'),
      sendEmail = require('./routes/sendEmailRoutes.js'),
      path = require('path'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'), 
      helmet = require('helmet'),     
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('./models/photos.db'),
      app = express();

app.enable('trust proxy');
app.set('port', process.env.PORT || 3000 );
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));
app.use('/private', privateRoutes);
app.use(sendEmail);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/login-failed', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login-failed.html'));
});

app.get('/works', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/works.html'));
})

app.get('/works-images', (req, res) => {
  // prep db rows into json object and send the request
  db.all("SELECT * from images", (err, arr) => {
    res.json({images:arr});
  });
});

// redirect all non matching routes back to homepage
app.all('*', (req, res) => {
  res.redirect('/');
});

app.listen(app.get('port'), () => {
  console.log('server listening at port ' + app.get('port'));
});


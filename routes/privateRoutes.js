require('dotenv').config();
const express = require('express'),
      path = require('path'),
      bcrypt = require('bcryptjs'),
      sessions = require('client-sessions'),
      randomString = require('csprng'),   
      sanitizer = require('express-sanitizer'),
      Ratelimit = require('express-rate-limit'),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('./models/photos.db'),
      app = express(),
      router = express.Router();

let count = 0;
let incorrectLoginLimiter = new Ratelimit({
  windowMs: 120*60*1000,
  delayAfter: 0,
  delayMs:3*1000,
  max: 5,
  message: 'Too many incorrect account login attempts. Please try again after 1 hour'
});

router.use(sanitizer());
router.use(sessions({
  cookieName: 'session',
  secret: randomString(160,36),
  duration: 60*60*1000,
  activeDuration: 60*60*1000,
  httpOnly: true,
}));
router.use(express.static(path.join(__dirname, '../private')));

// create table user, with column id which autoincrements itself? then another col with username, and password col, and role col and credit col with decimals for variables
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS images (ROWID INTEGER PRIMARY KEY, imageName STRING, imageSource STRING, imageDescription STRING)');
});

router.get('/admin', checkSession, (req, res) => {
  res.sendFile(path.join(__dirname, '../private', 'admin-page.html'));
});

router.get('/edit', checkSession, (req, res) => {
  res.sendFile(path.join(__dirname, '../private', 'edit-images.html'));
});

router.get('/images-data', checkSession, (req, res) => {
  // prep db rows into json object and send the request
  db.all("SELECT * from images", (err, arr) => {
    res.json({images:arr});
  });
});

router.get('/logout', (req, res) => {
  // reset the session
  req.session.reset();
  res.redirect('/login');

});

router.post('/upload', verifyInput, (req, res) => {
  db.run('INSERT INTO images VALUES (NULL, ?, ?, ?)', [req.body.image_name, req.body.image_link, req.body.image_description], (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({status:'DB error! <br> Please contact me.', error:err});
    } else {
      res.status(200).json({status:'Success', error:null});
    }
  });

});

router.post('/admin-login', incorrectLoginLimiter, (req, res) => {
  let username = req.sanitize(req.body.username);
  let password = req.sanitize(req.body.password);
  if (username === process.env.CLIENTUSER) {
    bcrypt.compare(password, process.env.CLIENTPW, (err, auth) => {
      if (auth) {
        req.session.user = username;
        res.redirect('/private/admin');
      } else {
        res.redirect('/login-failed');
      }
    })
  } else {
    res.redirect('/login-failed');
  }
});

router.put('/edit', verifyInput, (req, res) => {
  db.run("UPDATE images SET imageDescription = $description, imageName = $name, imageSource = $src WHERE id = $id", {
    $id: req.body.imageid,
    $description: req.body.imageDescription,
    $name:req.body.imageName,
    $src:req.body.imageSrc,
  }, err => {
    if (err) {
      console.log(err);
      res.status(500).json({status:'Error', error:'err'});
    } else {
      res.status(200).json({status:'Success', error:null});
    }
  });

});

router.delete('/edit', (req, res) => {
  db.run("DELETE FROM images WHERE id = " + `${req.body.imageid}`, err => {
    if (err) {
      console.log(err);
      res.status(500).json({status:'Error', error:'err'});
    } else {
      res.status(200).json({status:'Success', error:null});
    }
  });
});

function verifyInput(req, res, next) {
  for (x in req.body) {
    if (!x) {
      return res.status(400).json({status:'Invalid request', error:'invalid request'});
    }
  }
  next();
}

function checkSession(req, res, next) {
  //bypass for testing
  //next();
  
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
  
}

module.exports = router;
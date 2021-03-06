const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var twilio = require('twilio');
var accountSid = "ACd32ab1f924e3c97cd9ea367247e2e404";
var authToken = "a5ac34baeb39086e519fd7a6e1956811";
var client = new twilio(accountSid, authToken);
function createMessage(message){
  client.messages.create({
    body: message,
    to: "6477858729",
    from: "2898001716"
  }).then((message) =>  console.log(message.sid));
  client.messages.create({
    body: message,
    to: "6477718718",
    from: "2898001716"
  }).then((message) =>  console.log(message.sid));
  client.messages.create({
    body: message,
    to: "6475259191",
    from: "2898001716"
  }).then((message) =>  console.log(message.sid));
  client.messages.create({
    body: message,
    to: "6476256012",
    from: "2898001716"
  }).then((message) =>  console.log(message.sid));
}

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});
//check for db errors
db.on('error', function(err){
  console.log(err);
});
//init
const app = express();

//bring in models
let Article = require('./models/article');
let Shift = require('./models/shift');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//bodyParser middleware
//parse app
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//home route
app.get('/articles', function (req, res) {
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }
    else{
    res.render('index', {
      title: 'Articles',
      articles: articles
    });
  }
  });
});

// Add route
app.get('/articles/add', function(req,res){
  res.render('add_article', {
    title: 'Add Article',
  });
})
//add submit post route
app.post('/articles/add', function(req,res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  });
});


app.get('/', function (req, res) {
  Shift.find({}, function(err, shifts){
    if(err){
      console.log(err);
    }
    else{
    res.render('shifts', {
      title: 'Available Shifts',
      shifts: shifts
    });
  }
  });
});

app.get('/shift/add', function(req,res){
  res.render('add_shift', {
    title: 'Add Shift',
  });
});

app.get('/splash', function(req,res){
  res.render('splash', {
    title: 'Add splash',
  });
});

app.get('/settings', function(req,res){
  res.render('settings', {
    title: 'Settings',
  });
})

app.get('/profile', function(req,res){
  res.render('profile', {
    title: 'Profile',
  });
})

//add submit post route
app.post('/shift/add', function(req,res){
  let shift = new Shift();
  shift.title = req.body.title;
  shift.start_time = req.body.start_time;
  shift.end_time = req.body.end_time;
  shift.user_id = req.body.user_id;

  shift.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      createMessage("Heads up a new shift at " + shift.title + " has been posted by " + shift.user_id + " on Shifter")
      res.redirect('/');
    }
  });
});

app.post('/shift/accept', function(req, res){
  var id = req.body.id;

  Shift.find({_id: id}).remove(function(err){
    createMessage("You have accepted to take the shift!");
    res.redirect('/');
  })
});

app.use('/jquery', express.static(__dirname + '/scripts/'));
app.get('/scripts/opendata.js', function(req, res){
  res.sendFile(path.join(__dirname + '/scripts/opendata.js'));
});

app.use(express.static('images'));

//start server
app.listen(7070, function () {
  console.log('Example app listening on port 7070!');
})


app.use(require('serve-static')(__dirname + '/../../public'));

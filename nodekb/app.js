const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//bodyParser middleware
//parse app
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//home route
app.get('/', function (req, res) {
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
//start server
app.listen(7070, function () {
  console.log('Example app listening on port 7070!');
})

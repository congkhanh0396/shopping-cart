
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Product = require('../models/product');
var csrfProtection = csrf({ cookie: true });

router.use(csrfProtection);
/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
    var productChunk = [];
    var chunkSize = 3;
    for(var i = 0; i < docs.length; i+= chunkSize){
      productChunk.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping cart here', products : productChunk});

  });

/* GET login page. */
router.get('/user/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages : messages, hasErrors: messages.length > 0});
  });
});

router.post('/user/signup', passport.authenticate('local.signup',{
    successRedirect : '/user/profile', 
    failureRedirect : '/user/signup',
    failureFlash : true  
}));

// router.post('/user/signup', passport.authenticate('local.signup', {
//   successRedirect : '/user/profile', 
//   failureRedirect : '/user/signup',
//   failureFlash : true  //enable flash messages
// }));

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});


module.exports = router;

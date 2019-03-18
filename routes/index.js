var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Product = require('../models/product');
var Cart = require('../models/cart');
/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err, docs){
    var productChunk = [];
    var chunkSize = 3;
    for(var i = 0; i < docs.length; i+= chunkSize){
      productChunk.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping cart here', products : productChunk, successMsg: successMsg, noMessages : !successMsg});

});
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});
  Product.findById(productId, function(err, product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
     return res.render('shop/shopping-cart', {products : null});
  }
  else{
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
  }
});

router.get('/checkout', function(req, res, next){
  if(!req.session.cart){
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', async function(req, res, next){
  if(!req.session.cart){
    return res.redirect('shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_An1dJQsDXZBuVvXGyzBFdiqQ");
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: "tok_mastercard", // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
      if(err){
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      req.flash('success', 'Successful bought product!');
      req.session.cart = null;
      res.redirect('/');
  });
});


module.exports = router;


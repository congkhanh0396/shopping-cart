var passport = require('passport');
var User = require('../models/user');
var LocalStratery = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {  
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStratery({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    //allow using the call route to check login or not
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min : 4});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email' : email}, function (err, user) { 
        if(err){
           return done(err);
        }
        if(user){
            return done(null, false, {message :'Email is already in use'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
     });
}));

passport.use('local.signin', new LocalStratery({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email' : email}, function (err, user) { 
        if(err){
           return done(err);
        }
        if(!user){
            return done(null, false, {message :'No user found.'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message :'Wrong pass.'});
        }
        return done(null, user);
     });
}));
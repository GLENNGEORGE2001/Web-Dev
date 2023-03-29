require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const googleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://127.0.0.1:27017/userDB')
// mongoose.set('useCreateIndex',true);
 
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username
      });
    });
  });
   
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
    });
  }
));

app.get('/', function(req, res){
    res.render('home');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google', function(req, res){
    passport.authenticate('google', {scope:["profile"]});
})

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
  });

app.get('/logout', function(req, res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
})

app.route('/login')
    .get(function(req,res){
        res.render('login');
    })
    .post(
        passport.authenticate("local",{
            successRedirect: "/secret",
            failureRedirect: "/login"
        }));

app.route('/register')
    .get(function(req, res){
        res.render('register');
    })
    .post(function(req, res){
        User.register({username: req.body.username}, req.body.password, function(err, user){
            if(err){
                console.log(err);
                res.redirect('/register');
            }else{
                passport.authenticate('local')(req, res, function(){
                    res.redirect('/secrets');
                });
            }
        })
    });

app.route('/secrets')
    .get(function(req, res){
        if(req.isAuthenticated()){
            User.find({'secret':{$ne:null}})
                .then(function(element){
                    res.render('secrets',{userwithSecrets:element});
                })
                .catch((err)=>console.log(err));
        }else{
            res.redirect('/login');
        }
    });

app.route('/submit')
    .get(function(req, res){
        if(req.isAuthenticated()){
            res.render('submit');
        }else{
            res.redirect('/login');
        }
    })
    .post(function(req, res){
        User.findById(req.user.id)
        .then(function(element){
            element.secret = req.body.secret;
            element.save();
            res.redirect('/secrets');
        })
        .catch((err)=>console.log(err));
    });

app.listen(3000, ()=>console.log('Server started on port 3000'));
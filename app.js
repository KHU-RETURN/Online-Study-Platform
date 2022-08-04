require("dotenv").config();

const express = require('express'),
  app = express(),
  path = require('path'),
  passport = require('passport'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  MongoStore = require('connect-mongo');

const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const pageRouter = require('./routes/page');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

mongoose.connect('mongodb+srv://'+process.env.DATABASE_USERNAME+':'+process.env.DATABASE_PASSWORD+'@'+process.env.DATABASE_NAME+'.0un5xhc.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('Connected to mongodb Server')
});

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl:'mongodb+srv://'+process.env.DATABASE_USERNAME+':'+process.env.DATABASE_PASSWORD+'@'+process.env.DATABASE_NAME+'.0un5xhc.mongodb.net/?retryWrites=true&w=majority', ttl: 14 * 24 * 60 * 60}),
  cookie:{maxAge:(3.6e+6)*24}
}));

// Passport setting
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api', apiRouter);
app.use('/', pageRouter);

module.exports = app;
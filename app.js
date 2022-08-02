const express = require('express'),
  app = express(),
  path = require('path');

const mainRouter = require('./routes/main');
const pageRouter = require('./routes/page');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter);
app.use('/', pageRouter);

module.exports = app;
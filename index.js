require('dotenv').config();
require('ejs');
require('ciscospark');

const express = require('express');

const createUser = require('./guest');

const browserify = require('browserify-middleware');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('main', {
    stage: 0,
    title: 'SDK Workshop'
  })
});

/**
 * Creates and displays a guest user token for debugging
 */
app.get('/guest', (req, res) => {
  const displayName = 'SDK Workshop';
  createUser({ displayName }).then((token) => {
    res.render('main', {token, displayToken: true, stage: 1, title: 'Guest Token'});
  });
});

app.get('/stage2', (req, res) => {
  // Get the display name from the querystring of the url "?displayName=Name"
  const displayName = req.query.displayName;

  // Show the form if we do not have a name
  if (!displayName) {
    return res.render('main', {
      showForm: true,
      stage: 2,
      title: 'Guest Token Entry'
    });
  }

  // Create JWT based on form name entered
  createUser({ displayName }).then((token) => {
    res.render('main', {
      displayToken: true,
      showForm: false,
      stage: 2,
      token,
      title: `Welcome ${displayName}`});
  });
})

app.get('/stage3', (req, res) => {
  // Get the display name from the querystring of the url "?displayName=Name"
  const displayName = req.query.displayName;

  // Show the form if we do not have a name
  if (!displayName) {
    return res.render('main', {
      showWidget: false,
      showForm: true,
      stage: 3,
      title: 'Guest Token Entry'
    });
  }

  // Create JWT based on form name entered
  createUser({ displayName }).then((token) => {
    res.render('main', {
      showWidget: true,
      showForm: false,
      stage: 3,
      token,
      title: `Welcome ${displayName}`});
  });
});

app.get('/stage4', (req, res) => {
  // Get the display name from the querystring of the url "?displayName=Name"
  const displayName = req.query.displayName;

  // Show the form if we do not have a name
  if (!displayName) {
    return res.render('main', {
      showWidget: false,
      showForm: true,
      stage: 3,
      title: 'Guest Token Entry'
    });
  }

  // Create JWT based on form name entered
  createUser({ displayName }).then((token) => {
    res.render('main', {
      useSDK: true,
      showWidget: false,
      showForm: false,
      stage: 4,
      token,
      title: `Welcome ${displayName}`});
  });
});

app.get('/stage5', (req, res) => {
  const displayName = req.query.displayName || 'SDK Workshop';
  createUser({ displayName }).then((token) => {
    res.render('stage5', {token});
  });
});

/**
 * JSONP method of creating a guest token
 */
app.get('/token', (req, res) => {
  const displayName = req.query.displayName || 'SDK Workshop';
  createUser({ displayName }).then((token) => {
    res.jsonp({
      displayName,
      token
    });
  });
});

//provide a bundle exposing `require` for a few npm packages.
app.get('/sdk.js', browserify('./sdk.js', {
  cache: true,
  precompile: true
}));

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('server started on port 3000');
});
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const ip = require('ip');
const Server = require('./Server.js');

const app = express();
const server = new Server();
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'megaPrivateKeyHere',
  resave: false,
  saveUninitialized: true,
}));

const PORT = 3001;

app.get('/api/search', function(req, res) {
  req.on('close', () => server.clearPlayer(req.session.guid));

  if (req.session.guid) {
    // player has guid - save response context for delayed response
    server.saveResponseContext(req.session.guid, res);
    server.searchGame(req.session.guid);
  } else {
    // generate guid for new player and add him to queue
    const guid = shortid.generate();
    server.saveResponseContext(guid, res);
    server.addPlayerToQueue(guid);

    req.session.guid = guid;
    res.sendStatus(200);
  }
});

app.get('/api/prepare', function(req, res) {
  req.on('close', () => server.clearPlayer(req.session.guid));

  const guid = req.session.guid;
  server.saveResponseContext(guid, res);
  server.processPrepare(guid);
});

app.post('/api/prepare', function(req, res) {
  req.on('close', () => server.clearPlayer(req.session.guid));

  if (!server.isPlayerAvailable(req.session.guid)) {
    req.session.destroy();
    res.sendStatus(500);
    return;
  }

  const guid = req.session.guid;
  server.preparePlayer(guid, req.body);
  res.sendStatus(200);
});

app.post('/api/shot', function(req, res) {
  req.on('close', () => server.clearPlayer(req.session.guid));

  const guid = req.session.guid;
  server.saveResponseContext(guid, res);
  server.processShotRequest(guid, req.body);
});

app.get('/api/shot', function(req, res) {
  req.on('close', () => server.clearPlayer(req.session.guid));

  const guid = req.session.guid;
  server.saveResponseContext(guid, res);
  server.processShotAnswer(guid);
});

app.get('/api/stop', function(req, res) {
  const guid = req.session.guid;
  if (guid) {
    req.session.destroy();
    server.clearPlayer(guid, true, true);
  }

  res.sendStatus(200);
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.use(function(error, req, res, next) {
  console.log('ERROR: ' + error.message);
  if (req.session && req.session.guid) {
    server.clearPlayer(req.session.guid, true, false);
  }

  if (req.session) {
    req.session.destroy();
  }
});

app.listen(PORT, '127.0.0.1', function() {
  console.log('App was started: ' + ip.address() + ':' + PORT);
});

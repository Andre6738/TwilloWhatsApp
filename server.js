const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const { incomingMessageHandler } = require('./Controllers/incommingMessageController');

const { SESSION_SECRET, PORT } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.post('/incomingMessage', (req, res) => {
  incomingMessageHandler(req, res);
});

app.post('/error', (req, res) => {
  errorHandler(req, res);
});

app.listen(PORT, () => {
  console.log('WhatsApp chatbot listening on port ' + PORT);
});
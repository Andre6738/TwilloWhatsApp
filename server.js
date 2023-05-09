const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const session = require('express-session');
require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = new twilio(accountSid, authToken);
const fromNumber = 'whatsapp:+14155238886';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.post('/incomingMessage', (req, res) => {
  const messageBody = req.body.Body;
  const sender = req.body.From;
  const twilloSessionId = req.session.id;
  const sessionData = req.session;

  const twiml = new twilio.twiml.MessagingResponse();

  if (!sessionData.newSession) {
    sessionData.newSession = true;
    sessionData.backToMainMenu = true;
  }

  if (messageBody.toLowerCase() === 'sstop') {
    twiml.message('Please take care. Goodbye :)');
    req.session.destroy();
  }
  else if (sessionData.backToMainMenu) {
    welcomeMessageStep(twiml, sessionData);

  } else if (sessionData.testSessionID){
    sessionData.UserInputSessionID = messageBody;
    if (testUserInputSessionID(sessionData)) {
      sessionData.testSessionID = false;
      sessionData.testSessionIDMenu = true;
      twiml.message('Please select the data you want to be displayed:\n1. Option 1\n2. Option 2\n3. Option 3\n4. Cancel');
    }
    else{
      twiml.message('Session ID does not exist. Please enter another session ID.');
    }
  } else if (sessionData.testSessionIDMenu){
    if (messageBody === '1') {
      twiml.message('Option 1 selected');
    }
    else if (messageBody === '2') {
      twiml.message('Option 2 selected');
    }
    else if (messageBody === '3') {
      twiml.message('Option 3 selected');
    }
    else if (messageBody === '4') {
      twiml.message('Canceled option');
      resetSessionVariables(sessionData);
      welcomeMessageStep(twiml, sessionData);
    }
    else{
      twiml.message('*Invalid option*\nPlease select the data you want to be displayed:\n1. Option 1\n2. Option 2\n3. Option 3\n4. Cancel');
    }
  }
  else {
    twiml.message('Sorry, something went wrong, please try again or contact support');
    resetSessionVariables(sessionData);
  }

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
  console.log(twilloSessionId); //Checking that the sessionId is of the same user
});

app.post('/error', (req, res) => {
  console.log('Error:', req.body);
  res.status(500).send('Something went wrong on the server!');
});

app.listen(3000, () => {
  console.log('WhatsApp chatbot listening on port 3000!');
});

function resetSessionVariables(sessionData) {
  sessionData.newSession = true;
  sessionData.backToMainMenu = true;
  sessionData.testSessionID = false;
  sessionData.UserInputSessionID = '';
  sessionData.testSessionIDMenu = false;
}

function testUserInputSessionID(sessionData) {
  return true;
}

function welcomeMessageStep(twiml, sessionData) {
  twiml.message('Welcome to Entelect Health Check Chatbot!\nPlease enter the session ID:');
  sessionData.backToMainMenu = false;
  sessionData.testSessionID = true;
}

function sendBasicMessage(from, to, body) {
  client.messages.create({
    body: body,
    from: from,
    to: to
  })
  .then(message => console.log(`Message sent: ${message.sid}`))
  .catch(error => console.log(`Error sending message: ${error}`));
}
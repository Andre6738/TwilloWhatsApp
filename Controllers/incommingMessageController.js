const twilio = require('twilio');
const { welcomeMessageStep, resetSessionVariables } = require('./sessionController');
const { testUserInputSessionID } = require('./healthCheckController');
const { sendBasicMessage } = require('./whatsappMessageController');

function incomingMessageHandler(req, res) {
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
    } else if (sessionData.backToMainMenu) {
      welcomeMessageStep(twiml, sessionData);
    } else if (sessionData.testSessionID) {
      sessionData.UserInputSessionID = messageBody;
      if (testUserInputSessionID(sessionData)) {
        sessionData.testSessionID = false;
        sessionData.testSessionIDMenu = true;
        twiml.message('Please select the data you want to be displayed:\n1. Option 1\n2. Option 2\n3. Option 3\n4. Cancel');
      } else {
        twiml.message('Session ID does not exist. Please enter another session ID.');
      }
    } else if (sessionData.testSessionIDMenu) {
      if (messageBody === '1') {
        twiml.message('Option 1 selected');
      } else if (messageBody === '2') {
        twiml.message('Option 2 selected');
      } else if (messageBody === '3') {
        twiml.message('Option 3 selected');
      } else if (messageBody === '4') {
        twiml.message('Canceled option');
        resetSessionVariables(sessionData);
        welcomeMessageStep(twiml, sessionData);
      } else {
        twiml.message('*Invalid option*\nPlease select the data you want to be displayed:\n1. Option 1\n2. Option 2\n3. Option 3\n4. Cancel');
      }
    } else {
      twiml.message('Sorry, something went wrong, please try again or contact support');
      resetSessionVariables(sessionData);
    }
  
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
    console.log(twilloSessionId); //Checking that the sessionId is of the same user
}
   
module.exports = {
    incomingMessageHandler,
};
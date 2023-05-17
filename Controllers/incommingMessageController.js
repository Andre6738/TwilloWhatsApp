const twilio = require('twilio');
const { welcomeMessageStep, resetSessionVariables, endSessionMessage, 
        testSessionIDExistsStep, invalidOptionOccur, viewParticipants, 
        viewSessionNotes, viewSessionSummary, viewTrends } = require('./sessionController');

async function incomingMessageHandler(req, res) {
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
        endSessionMessage(twiml, req);

    } else if (sessionData.backToMainMenu) {
        welcomeMessageStep(twiml, sessionData);

    } else if (sessionData.testSessionID) {
        testSessionIDExistsStep(twiml, sessionData, messageBody);

    } else if (sessionData.testSessionIDMenu) {
      if (messageBody === '1') {
        viewParticipants(twiml, sessionData);

      } else if (messageBody === '2') {
        viewSessionSummary(twiml, sessionData);

      } else if (messageBody === '3') {
        viewSessionNotes(twiml, sessionData);

      } else if (messageBody === '4') {
        viewTrends(twiml, sessionData, sender);

      } else if (messageBody === '5') {
        twiml.message('Canceled option');
        resetSessionVariables(sessionData);
        welcomeMessageStep(twiml, sessionData);

      } else {
        invalidOptionOccur(twiml);

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
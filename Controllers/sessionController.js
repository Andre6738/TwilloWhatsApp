const { testUserInputSessionID } = require('./healthCheckController');

function resetSessionVariables(sessionData) {
    sessionData.newSession = true;
    sessionData.backToMainMenu = true;
    sessionData.testSessionID = false;
    sessionData.UserInputSessionID = '';
    sessionData.testSessionIDMenu = false;
}

function welcomeMessageStep(twiml, sessionData) {
    twiml.message('Welcome to Entelect Health Check Chatbot!\nPlease enter the session ID:');
    sessionData.backToMainMenu = false;
    sessionData.testSessionID = true;
}

function endSessionMessage(twiml, req) {
    twiml.message('Please take care. Goodbye :)');
    req.session.destroy();
}

function testSessionIDExistsStep(twiml, sessionData, messageBody) {
    sessionData.UserInputSessionID = messageBody;
    if (testUserInputSessionID(sessionData)) {
      sessionData.testSessionID = false;
      sessionData.testSessionIDMenu = true;
      twiml.message('Please select the data you want to be displayed:\n1. Option 1\n2. Option 2\n3. Option 3\n4. Cancel');
    } else {
      twiml.message('Session ID does not exist. Please enter another session ID.');
    }
}

function invalidOptionOccur(twiml) {
    twiml.message('*Invalid option*\nPlease select the data you want to be displayed:\n1. Option 1\n2. Option 2\n3. Option 3\n4. Cancel');
}
  
module.exports = {
    resetSessionVariables,
    welcomeMessageStep,
    endSessionMessage,
    testSessionIDExistsStep,
    invalidOptionOccur,
};
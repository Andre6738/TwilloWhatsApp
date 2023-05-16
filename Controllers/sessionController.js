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
  
module.exports = {
    resetSessionVariables,
    welcomeMessageStep,
};
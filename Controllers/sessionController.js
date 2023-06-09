const { testUserInputSessionID } = require('./healthCheckController');
const { sendBasicMediaMessage, sendBasicMessage } = require('./whatsappMessageController');
const { lineChart, verticalBarChart, horizontalBarChart, pieChart, doughnutChart } = require('./generateImagesController');

function resetSessionVariables(sessionData) {
    sessionData.newSession = true;
    sessionData.backToMainMenu = true;
    sessionData.testSessionID = false;
    sessionData.UserInputSessionID = '';
    sessionData.testSessionIDMenu = false;
}

function welcomeMessageStep(twiml, sessionData) {
    twiml.message('*Welcome to Entelect Health Check Chatbot!* 😆\nReply _*sstop*_ to end the session anytime.\n\nPlease enter the session ID:');
    sessionData.backToMainMenu = false;
    sessionData.testSessionID = true;
}

function endSessionMessage(twiml, req) {
    twiml.message('Please take care. Goodbye 👋');
    req.session.destroy();
}

function testSessionIDExistsStep(twiml, sessionData, messageBody) {
    sessionData.UserInputSessionID = messageBody;
    if (testUserInputSessionID(sessionData)) {
      sessionData.testSessionID = false;
      sessionData.testSessionIDMenu = true;
      mainMenuMessage(twiml);
    } else {
      twiml.message('Session ID does not exist. Please enter another session ID.');
    }
}

function mainMenuMessage(twiml) {
    twiml.message('Please select the data you want to be displayed:\n1. View Participants 👥\n2. View Session Summary 📋\n3. View Session notes 📝\n4. View Trend 📊\n5. Cancel 🔙');
}

function invalidOptionOccur(twiml) {
    twiml.message('*Invalid option*\nPlease select the data you want to be displayed:\n1. View Participants 👥\n2. View Session Summary 📋\n3. View Session notes 📝\n4. View Trend 📊\n5. Cancel 🔙');
}

function viewParticipants(twiml, sessionData) {
    twiml.message('*The participants in the Team 1 - 09/03/2023 are as follows:*\n1. Zane - Host\n2. Wesley Chetty - Member');
}

function viewSessionSummary(twiml, sessionData) {
    twiml.message('*The categories for this session:*\n1. Trust (Sentiment - Green)\n2. Exposure (Sentiment - Amber)\n\n_*To view participant sentiments, reply with the category number:*_');
}

function viewSessionNotes(twiml, sessionData) {
    twiml.message('Session notes');
}

async function viewTrends(twiml, sessionData, sender) {
    const imageUrl = await pieChart();
    sendBasicMediaMessage(sender, 'Please select the data you want to be displayed:\n1. View Participants 👥\n2. View Session Summary 📋\n3. View Session notes 📝\n4. View Trend 📊\n5. Cancel 🔙', imageUrl);
}
  
module.exports = {
    resetSessionVariables,
    welcomeMessageStep,
    endSessionMessage,
    testSessionIDExistsStep,
    invalidOptionOccur,
    viewParticipants,
    viewSessionSummary,
    viewSessionNotes,
    viewTrends,
};
const twilio = require('twilio');
const { ACCOUNT_SID, AUTH_TOKEN } = process.env;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

function sendBasicMessage(from, to, body) {
  client.messages
    .create({
      body: body,
      from: 'whatsapp:+14155238886',
      to: to,
    })
    .then((message) => console.log(`Message sent: ${message.sid}`))
    .catch((error) => console.log(`Error sending message: ${error}`));
}

module.exports = {
  sendBasicMessage,
};
const express = require('express');
const { Router } = require('express');
const twilio = require('twilio');
const dotenv = require('dotenv');
const io = require('../socket');

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const router = Router();

router.post('/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => { 
      console.log(err);
      res.status(500).send(JSON.stringify({ success: false, error: err.message }));
    });
});

const incomingMessages = [];

router.post('/incoming', (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;
  const timestamp = new Date().toLocaleString();
  // Log the incoming message details
  console.log('Incoming request body:', req)
  console.log(`Received message from: ${from}`);
  console.log(`Message content: ${body}`);
  console.log(`Timestamp: ${timestamp}`);


  // Add the message to the array
  incomingMessages.push({ from, body, timestamp });

  res.sendStatus(200); // Send a successful response to Twilio
});

// Route to get incoming messages with timestamps
router.get('/incoming', (req, res) => {
  res.json({ messages: incomingMessages });
});

// router.post('/make-call', async (req, res) => {
//   const { to } = req.body;
//   const from = process.env.TWILIO_PHONE_NUMBER;
//   console.log("Request Body:", req.body); // Log the request body
//   console.log("To:", to); // Log the "to" value
//   console.log("From:", from); // Log the "from" value

//   try {
//     const twiml = new twilio.twiml.VoiceResponse();
//     const dial = twiml.dial();
//     dial.number(to); // Dial the recipient's number

//       const call = await client.calls.create({
//         to,
//         from,
//         twiml: twiml.toString(),
//       });
//       console.log("To:", to);
//       console.log("From:", from);

//       //return to client
//       res.json({ success: true, callSid: call.sid });
//     } catch (error) {
//       console.error(error);
//       res.json({ success: false, error: error.message });
//     }
// });
router.post('/make-call', async (req, res) => {
  const { to } = req.body;
  const from = process.env.TWILIO_PHONE_NUMBER;

  try {
    const twiml = new twilio.twiml.VoiceResponse();
    const dial = twiml.dial();
    dial.number(to); // Dial the recipient's number

    const call = await client.calls.create({
      to,
      from,
      twiml: twiml.toString(),
    });

    // Return the response to the client
    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});


// router.use((req, res, next) => {
//   req.io = io; // Add 'io' to the request object
//   next();
// });

// router.post('/inbound', (req, res) => {
//   const twiml = new twilio.twiml.VoiceResponse();
//   const dial = twiml.dial();
//   twiml.say('Thank you for calling!');
//   const incomingNumber = req.body.From;
//   console.log('Incoming number:', incomingNumber);
//   dial.client('user-client');

//   res.type('text/xml');
//   res.send(twiml.toString());
//   // io.emit('incomingCall', { from: incomingNumber });
//   if (req.io) {
//     req.io.emit('incomingCall', { from: incomingNumber });
//   } else {
//     console.warn("'io' is not defined; event not emitted.");
//   }
// });
// router.post('/inbound', (req, res) => {
//   const twiml = new twilio.twiml.VoiceResponse();
//   const dial = twiml.dial();
//   twiml.say('Thank you for calling!');
//   const incomingNumber = req.body.From;
//   console.log('Incoming number:', incomingNumber);
//   dial.client('user-client');

//   res.type('text/xml');
//   res.send(twiml.toString());
  
//   // Emit the event using req.io
//   // if (req.io) {
//   //   req.io.emit('incomingCall', { from: incomingNumber });
//   // } else {
//   //   console.warn("'io' is not defined; event not emitted.");
//   // }
// });

router.get('/generate-token', (req, res) => {
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
  console.log('TWILIO_API_KEY:', process.env.TWILIO_API_KEY);
  console.log('TWILIO_API_SECRET:', process.env.TWILIO_API_SECRET);
  console.log('TWIML_APP_SID:', process.env.TWIML_APP_SID);

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;
  const appSid = process.env.TWIML_APP_SID;
  console.log(twilioAccountSid);
  const identity = 'user';

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: appSid,
    incomingAllow: true,
  });

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity }
  );
  console.log(token);
  token.addGrant(voiceGrant);
  console.log(token.toJwt());
  const payloadtoken = token.toJwt();
  res.json({ payloadtoken });
});

router.get('/print-env', (req, res) => {
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;
  const twimlAppSid = process.env.TWIML_APP_SID;

  const envVariables = {
    TWILIO_ACCOUNT_SID: twilioAccountSid,
    TWILIO_API_KEY: twilioApiKey,
    TWILIO_API_SECRET: twilioApiSecret,
    TWIML_APP_SID: twimlAppSid,
  };

  res.json(envVariables);
});

module.exports = router;

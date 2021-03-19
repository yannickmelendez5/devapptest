// Initialize app
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

// Define JSON parsing mode for Events API requests
app.use(bodyParser.json())

// Get environment variables
var api_token = process.env.API_TOKEN;
var channel_id = process.env.CHANNEL_ID;

//
//
// You don't need to make changes to anything above this line
//
//


//Adding client ID and client secret per slack ngrok app setup documentation
//Generally would NOT have the client secret. 
var clientId = '1854737147415.1889414518769';
var clientSecret = '6f44d2f1fee28c3626d38cf5a019079d';

// Yannick - Define port 
const PORT= 12345;

//Yannick - Listen for requests
app.listen(12345, function () {
  console.log("App is listening on port 12345");
//   Yannick - Port number added to the above lines, declared the listener variable before calling app.listen function. 
//   Yannick - Changed to reflect that of index.js reference in slack documentation.
});


// Handle Events API events
app.get('/events', function(req, res){

  if(req.body.challenge) {
    // Respond to the challenge
    res.send({"challenge": req.body.challenge});

  } else {
    // Store details about the user
    var evt = req.body.event;
    var user_id = evt.user.id;
    var user_name = evt.user.real_name_normalized;
    var status_text = evt.user.profile.status_text;
    var status_emoji = evt.user.profile.status_emoji;

    // If no full name set, use the username instead
    if(user_name == "") {
      user_name = evt.user.name;
    }

    // Return a 200 to the event request
    res.status(200).end();

    // Build the message payload
    buildMessage(user_id, user_name, status_text, status_emoji);
  }
});


// Build the message payload
function buildMessage(user_id, user_name, status_text, status_emoji) {

  if(status_text.length > 0) {
    // If their status contains some text
    var message = [
      {
        "pretext": user_name + " updated their status:",
        "text": status_emoji + " *" + status_text + "*"
      }
    ];
  } else {
    // If their status is empty
    var message = [
      {
        "pretext": user_name + " cleared their status"
      }
    ];
  }

  postUpdate(message);
}

// Post the actual message to a channel
function postUpdate(attachments) {
  var data = {
    "token": api_token,
    "channel": channel_id,
    "text": JSON.stringify(attachments),
    "pretty": true
  };
  request.post(
    "https://slack.com/api/chat.postmessage",
    {
      form: data
    },
    function(err, resp, body) {
      if(err) {
        // If there's an HTTP error, log the error message
        console.log(err);
      } else{
        // Otherwise, log Slack API responses
        console.log(body);
      }
    }
  );
}



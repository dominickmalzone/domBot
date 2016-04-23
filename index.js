var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am the best chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'dom') {
                sendDomMessage(sender)
                continue
            }
            sendTextMessage(sender, "I feel like repeating what you said... " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

//<PAGE_ACCESS_TOKEN>
var token = "CAAY98J5R0d0BALGMyiFaQZAlnn3aZAu09pVfkN0fwO9JtvqyZCe5ZCYeGDvVcXFpBHaT0SZCfyHDqNmvCNOwmT2uSchRDFM6f87Vr8OFOFvs54BcZBG0XZA4w69UXZA52A52cjGGOfBVGWHJRHI64CaK8s46ZCc6lfmI1KDhwdvACGLZA5Yy7YRmWCNZCfTwjqciH4ZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
function sendDomMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Dominick Malzone",
                    "subtitle": "He likes building cool stuff!",
                    "image_url": "https://scontent.fsnc1-1.fna.fbcdn.net/hphotos-xfp1/v/t1.0-9/12743953_1128716870474552_2495718489447962368_n.jpg?oh=b5c7761e864501dd719524b7e0bd0fe4&oe=577770C3",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.Dominickmalzone.com",
                        "title": "His Site"
                    }, {
                        "type": "web_url",
                        "url": "http://www.Dominickmalzone.com/fb",
                        "title": "Resume for FB"
                    }],
                }, {
                    "title": "What does he build",
                    "subtitle": "Web, mobile and much more",
                    "image_url": "https://i.gyazo.com/ff15b191d1f1b5645cdbe53c25721a12.gif",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}






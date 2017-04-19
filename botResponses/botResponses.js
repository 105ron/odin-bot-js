'use strict'

var request = require('request')
var config = require('../config.js')
var time

var apiai = require('apiai')
var aiapp = apiai(config.apiai.apikey)

var helpers = require('../helpers/helpers.js')
var chatHelpers = require('../helpers/chatHelpers.js')
var {chooseRandomGif} = require('./giphy')

function botResponseChat({room, text}) {
  var request = aiapp.textRequest(text, {
    sessionId: '14'
  })
  request.on('response', function(response) {
    // console.log(response)
    const speech = response.result.fulfillment.speech
    const action = response.result.action
    if (speech) {
      chatHelpers.send(speech, room)
    }
    if (action == 'sendGif') {
      respondWithGif('hi', room)
    }
  })
  request.on('error', function(error) {
    console.log(error)
  })
  request.end()
}

function respondWithGif(searchTerm, room) {
  const gifs = ['hi', 'love', 'pizza', 'kiss']
  chooseRandomGif(gifs[helpers.randomInt(gifs.length)])
    .then(function(image) {
      var feedContent = `[![](${image.imageUrl})](${image.url})`
      chatHelpers.send(feedContent, room)
    })
    .catch(function() {
      chatHelpers.send('there was an error', room)
    })
}

function botResponseUseLinux({room}) {
  chatHelpers.send(
    `[Why you shouldn't use Windows for TOP.](https://medium.com/@codyloyd/why-cant-i-use-windows-for-the-odin-project-bf20a4bb135f#.29b6s6fp5)`,
    room
  )
}

function botResponseGandalf({room}) {
  chatHelpers.send(
    `[![](http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif)](http://giphy.com/gifs/B3hcUhLX3BFHa/tile)`,
    room
  )
}

function botResponseHug({room}) {
  chatHelpers.send(`⊂(´・ω・｀⊂)`, room)
}

function botResponseHello({room, data: {fromUser: {displayName: name}}}) {
  chatHelpers.send(`oh hi there ${name}`, room)
}

function botResponseHelp({room}) {
  chatHelpers.send(
    `> Odin Bot Commands
    > - give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\`
    > - view the points leaderboard with \`/leaderboard\`
    > - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms).
    > - share a nice gif with your friends with \`/giphy\` and another word
    > - For help with gitter commands (and \`code\` syntax)press \`ctl+shift+alt+m\`
    > - say my name, or \`/help\` to view this message again
    > - motivate your fellow odinites with \`/motivate\` and mention them
    > - I'm open source!  Hack me [HERE](https://github.com/codyloyd/odin-bot-js)!`,
    room
  )
}

function botResponsePartyParrot({room, text}) {
  var parrots = [
    'http://cultofthepartyparrot.com/parrots/parrotdad.gif',
    'http://cultofthepartyparrot.com/parrots/parrot.gif',
    'http://cultofthepartyparrot.com/parrots/shuffleparrot.gif',
    'http://cultofthepartyparrot.com/parrots/parrotcop.gif',
    'http://cultofthepartyparrot.com/parrots/fiestaparrot.gif',
    'http://cultofthepartyparrot.com/parrots/explodyparrot.gif',
    'http://cultofthepartyparrot.com/parrots/aussieparrot.gif'
    // 'http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png',
    // 'http://emojis.slackmojis.com/emojis/images/1472757675/1132/otter-dance.gif'
  ]

  if (text.toLowerCase().match('   p')) {
    var parrotUrl = 'http://cultofthepartyparrot.com/parrots/congaparrot.gif'
    chatHelpers.send(
      `![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})`,
      room
    )
  } else if (text.toLowerCase().match('!')) {
    chatHelpers.send(`![](${parrots[0]})`, room)
  } else {
    var index = helpers.randomInt(parrots.length)
    chatHelpers.send(`![]( ${parrots[index]} )`, room)
  }
}

function botResponseWindows({room}) {
  if (parseInt(Math.random() * 10) == 0) {
    chatHelpers.send('![](http://i.imgur.com/q9s5OKr.gif)', room)
    chatHelpers.send('##did I hear someone say something about WINDOWS?', room)
  }
}

function botResponseDontGiveUp({
  text,
  room,
  data: {fromUser: {username: user}}
}) {
  var mentions = helpers.getMentions(text)

  if (mentions) mentions = mentions.join(' ')
  else mentions = `@${user}` // if no one is mentioned, tag the requester

  chatHelpers.send(
    `${mentions} Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE`,
    room
  )
}

exports.botResponseUseLinux = botResponseUseLinux
exports.botResponseGandalf = botResponseGandalf
exports.botResponseHug = botResponseHug
exports.botResponseHello = botResponseHello
exports.botResponseHelp = botResponseHelp
exports.botResponsePartyParrot = botResponsePartyParrot
exports.botResponseWindows = botResponseWindows
exports.botResponseDontGiveUp = botResponseDontGiveUp
exports.botResponseChat = botResponseChat

"use strict"

let getHttpServer = require('./utils/get-http-server')
let express = require('express')
let app = express()
let path = require('path')
let bodyParser = require('body-parser')
let logger = require('./utils/logger').getLogger('console')
let {uniqId} = require('../src/utils/Func')
let _ = require('lodash')
logger.setLevel('DEBUG')

const Game = require('./stores/Game')
const Player = require('./stores/Player')
let game = new Game()

function insertRandomPlayer() {
  let player = new Player({
    id: uniqId(),
    name: uniqId(),
    status: uniqId()
  })
  player.isConfirmed = true
  player.isSurvey = true
  game.addPlayer(player)
}

// -- stage 1
let player = new Player({id: 'ee5fzqs737q', name: 'Matt', status: 'hi there😃'})
player.setIsConfirmed(true)
game.stage = 1
game.addPlayer(player)
// -- stage 2
player.setAnswers([{period: 'a', target: 'x'}, {period: 'b', target: 'y'}])
player.isSurvey = true
game.stage = 2

_.range(21).forEach(i => insertRandomPlayer())

let httpServer = getHttpServer(app)

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  logger.info(req.method + ': ' + req.originalUrl)
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Origin", req.headers.origin)
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method")
  next()
})

app.all('/', function(req, res) {
  res.json({ok: true})
})

app.get('/game', function(req, res) {
  res.json({
    result: true,
    game: game
  })
})

//
app.post('/game/init', function(req, res) {
  logger.info('Game Init')
  game.init()
  res.json({result: true})
})

app.get('/game/stage', function(req, res) {
  res.json({
    result: true,
    stage: game.stage
  })
})

app.post('/game/stage/:stageId', function(req, res) {
  logger.info('Game set stage, stageId =', req.params.stageId)
  let stageId = +req.params.stageId
  if (stageId === game.stage + 1) {
    game.setStage(+req.params.stageId)
    res.json({result: true})
    broadcastGame()
  } else {
    res.json({result: false, error: {msg: 'illegal stage value'}})
  }
})

app.get('/player/:playerId', function(req, res) {
  let {player} = game.getPlayerById(req.params.playerId)
  res.json({
    result: true,
    player
  })
})

// add or update player info
app.post('/player/:playerId', function(req, res) {
  let info = req.body
  if (game.playerExists(info.id)) { // update
    logger.info('Update player')
    game.updatePlayer(info)
  } else {
    logger.info('Add player')
    let player = new Player(info)   // add
    game.addPlayer(player)
    logger.info('Current players count = ' + game.getPlayersCount())
  }
  broadcastUserList()
  res.json({
    result: true
  })
})

app.get('/players', function(req, res) {
  res.json({
    result: true,
    players: game.players
  })
})

app.post('/player/:playerId/confirm', function(req, res) {
  let {confirm} = req.body
  let playerId = req.params.playerId
  game.setPlayerIsConfirmed(playerId, confirm)
  broadcastGame()
  res.json({
    result: true
  })
})

// set player answer
app.post('/player/:playerId/answers', function(req, res) {
  broadcastGame()
  let playerId = req.params.playerId
  let answers = req.body.answers
  if (answers!== undefined) {
    game.setPlayerAnswers(playerId, answers)
  }
  let isSurvey = req.body.isSurvey
  game.setPlayerIsSurvey(playerId, isSurvey)
  res.json({
    result: true
  })
})

app.post('/player/guess/player/:playerId/target/:targetId/choice/:choiceId', function(req, res) {
  const {playerId, targetId, choiceId} = this.req.params
  game.guess(playerId, targetId, choiceId)
})

app.post('/game/draw', function(req, res) {
  let ret = game.draw()
  broadcastGame()
  res.json({
    result: ret
  })
})

app.post('/game/end_draw', function(req, res) {
  let ret = game.endDraw()
  broadcastGame()
  res.json({
    result: ret
  })
})

// --

function broadcast(event, ...channels) {
  channels.forEach(channel => socketServer.to(channel))
  socketServer.emit.apply(socketServer, event)
}

function broadcastUserList() {
  broadcast(['player_list'], 'game', 'admin')
}

function broadcastGame() {
  broadcast(['game'], 'admin', 'game', 'public')
}

function broadcastGameStage() {
  broadcast(['game_stage'], 'admin', 'game')
}

let socketServer = require('socket.io')(httpServer)

socketServer.on('connection', (socket) => {
  logger.info('recieve connection')
  let channels = []
  socket.on('sub', function(data) {
    let channelId = data.channelId
    logger.info('playerId=' + data.playerId + ' subscribe ' + channelId)
    channels.push(channelId)
    socket.join(channelId)
  })

  socket.on('unsub', function(data) {
    let channelId = data.channelId
    _.pull(channels, channelId)
    socket.leave(channelId)
  })

  socket.on('disconnect', function() {
    logger.info('socket disconnect', socket.id)
    // @todo 离开的时候从玩家列表中去掉
  })

})

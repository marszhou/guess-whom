"use strict"

let getHttpServer = require('./utils/get-http-server')
let express = require('express')
let app = express()
let path = require('path')
let bodyParser = require('body-parser')
let logger = require('./utils/logger').getLogger('console')
logger.setLevel('DEBUG')

const Game = require('./stores/Game')
const Player = require('./stores/Player')
let game = new Game()

let httpServer = getHttpServer(app)

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json())

// app.all('/', function(req, res, next) {
//   console.log(req.headers.origin)
//   res.header("Access-Control-Allow-Credentials", "true")
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//   res.header("Access-Control-Allow-Origin", req.headers.origin)
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization")
//   next();
// })

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

//
app.post('/game/init', function(req, res) {
  logger.info('Game Init')
  game.init()
  res.json({result: true})
})

app.post('/game/stage/:stageId', function(req, res) {
  logger.info('Game set stage, stageId =', req.params.stageId)
  let stageId = +req.params.stageId
  if (stageId === game.stage + 1) {
    game.setStage(+req.params.stageId)
    res.json({result: true})
  } else {
    res.json({result: false, error: {msg: 'illegal stage value'}})
  }
})

app.post('/game/round/start/:number', function(req, res) {
  let number = +req.params.number
  logger.info('Try to start new round, with ',
              number,
              'candidates')
  if (number > 0 && game.stage === 2 && !game.currentRound) {
    let round = game.startNewRound()
    if (round) {
      logger.info('Start new round')
      res.json({result: true, round})
      return
    }
  }
  res.json({result: false})
})

app.post('/game/round/result/:index', function(req, res) {
  let candidate = game.currentRound.getCandidate(+index)
  res.json(candidate)
})

app.post('/game/round/end', function(req, res) {
  game.endRound()
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
  game.setPlayerIsConfirm(playerId, confirm)
  broadcastUserList()
  res.json({
    result: true
  })
})

// set player answer
app.post('/player/answer/:playerId', function(req, res) {
  let answers = res.body.answers
  game.setPlayerAnswer(playerId, answers)
})

app.post('/player/guess/player/:playerId/target/:targetId/choice/:choiceId', function(req, res) {
  const {playerId, targetId, choiceId} = this.req.params
  game.guess(playerId, targetId, choiceId)
})

function broadcast(event, ...channels) {
  channels.forEach(channel => socketServer.to(channel))
  socketServer.emit.apply(socketServer, event)
}

function broadcastUserList() {
  broadcast(['player_list'], 'game', 'admin')
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

"use strict"

let getHttpServer = require('./utils/get-http-server')
let express = require('express')
let app = express()
let path = require('path')
let bodyParser = require('body-parser')
let logger = require('./utils/logger').getLogger('console')
logger.setLevel('DEBUG')

let httpServer = getHttpServer(app)

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json())

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Origin", req.headers.origin)
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization")
  next();
})


const Game = require('./stores/Game')
const Player = require('./stores/Player')

let game = new Game()

app.post('/', function(req, res) {
  // io.to('test')
  // io.emit('test', '1', '2')

  res.json({result: true})
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


game.setStage(2)
game.addPlayer(new Player)
game.addPlayer(new Player)
game.addPlayer(new Player)

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

// add or update player info
app.post('/player/info/:playerId', function(req, res) {
  let info = req.body.player
  if (game.playerExists(info.id)) { // update
    game.updatePlayer(info)
  } else {
    let player = new Player(info)   // add
    game.addPlayer(player)
  }
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

let io = require('socket.io')(httpServer)

io.on('connection', (socket) => {
  socket.on('sub', function(data) {
    let channelId = data.channelId
    socket.join(channelId)
  })

  socket.on('unsub', function(data) {
    let channelId = data.channelId
    socket.leave(channelId)
  })

  socket.on('disconnect', function() {

  })
})

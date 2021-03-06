const {extendObservable, computed, action } = require('mobx')
// import {extendObservable} from 'mobx'
import socket from 'src/utils/get-client-socket'
import PlayerStore from './Player'
import {SOCKET_EVENTS} from 'src/consts'
import request from 'utils/Request'
import {Debounce} from 'lodash-decorators'
import _ from 'lodash'
import $ from 'jquery'

class Game {
  constructor(role='player') {
    this.role = role
    // this.disconnectOccured = false

    extendObservable(this, {
      stage: -1,
      players: [],
      candidate: null,
      candidates: [],
      result: null,
      showResult: false,
      contentWidth: 0,
      contentHeight: 0
    })
    if (role === 'player') {
      this.player = new PlayerStore(socket)
    }
    this.init()
    this.initSocket(socket)

    $(window).on('resize', this.recalculateContentDimension)
    this.recalculateContentDimension()
  }

  @action
  recalculateContentDimension = () => {
    this.contentWidth = window.document.documentElement.clientWidth - 30 * 2
    this.contentHeight = window.document.documentElement.clientHeight - 85 - 44
  }

  init() {
    this.stage = -1
    this.players = []

    // this.fetchPlayers()
  }

  // @return table layout
  // ex: return(5)
  //  then it represent there will be a 5x5 table
  //  which its inside has a 3x3 blank area
  // if there were 21 players
  //  then will be 7x7 : Math.ceil((21-4)/4) + 2 = 7
  calculateGameLayoutSize() {
    let count = this.players.length
    if (count <= 8) { // minimal is 3x3
      return 3
    } else {
      return Math.ceil((count - 8)/4) + 3
    }
  }

  initSocket(socket) {
    this.socket = socket
    this.socket.on('connect', () => {
      console.log('client connect to socket server')
      if (this.role === 'admin') {
        this.socket.emit('sub', {
          channelId: 'admin',
          playerId: '__admin__'
        })
      } else if (this.role === 'game') {
        this.socket.emit('sub', {
          channelId: 'game',
          playerId: '__public__'
        })
      } else {
        this.socket.emit('sub', {
          channelId: 'public',
          playerId: this.player.id
        })
        this.socket.emit('sub', {
          channelId: 'private_' + this.player.id,
          playerId: this.player.id
        })
      }

      this.fetchGame()
    })

    // this.socket.on('disconnect', () => {
    //   console.log('client lost connection to server')
    //   this.disconnectOccured = true
    // })

    SOCKET_EVENTS.public.forEach(event => { // 监听事件
      this.socket.on(event, this.handleSocketEvent.bind(this, event))
    })
  }

  handleSocketEvent = (event, ...rest) => {
    console.log(event, rest)
    switch(event) {
      case 'player_list':
        this.fetchPlayers()
      break
      case 'game_stage':
        this.fetchGameStage()
      break
      case 'game':
        this.fetchGame()
      break
      default:
    }
  }

  getPlayerById(playerId) {
    return _.find(this.players, {id: playerId})
  }

  @action
  addUser(user) {
    this.users.push(user)
  }

  @action
  removeUser(user) {
    let index = this.users.findIndex(u => user.id === u.id)
    if (index > -1) {
      this.users.splice(index, 1)
    }
  }

  @computed get playersLength() {
    return this.players.length
  }
  @computed get confirmedLength() {
    return _.filter(this.players, {isConfirmed: true}).length
  }
  @computed get stage0Ready() {
    if (this.stage === 0) {
      return this.confirmedLength === this.playersLength
    }
    return false
  }
  @computed get surveyLength() {
    return _.filter(this.players, {isSurvey: true}).length
  }
  @computed get stage1Ready() {
    if (this.stage === 1) {
      return this.surveyLength === this.playersLength
    }
    return false
  }
  @computed get availablePlayersLength() {
    return _.filter(this.players, {isUsed: false}).length
  }
  @computed get undisposedPlayers() {
    return _.filter(this.players, {isDisposed: false, isUsed: true})
  }
  @computed get undisposedPlayersLength() {
    return this.undisposedPlayers.length
  }

  draw() {
    this.sendDraw()
  }

  endDraw() {
    this.sendEndDraw()
  }

  drawResult() {
    this.sendDrawResult()
  }

  // ----- request methods -----
  @Debounce(500)
  fetchPlayers() {
    request.get('/players')
    .then(action(({players}) => {
      this.players = players
    }))
  }
  @Debounce(500)
  fetchGame() {
    let url = '/game'
    if (this.player) {
      url += '/' + this.player.id
    }
    request.get(url)
    .then(action(({game}) => {
      console.log(game)
      this.stage = game.stage
      this.players = game.players
      this.candidate = game.candidate
      this.candidates = game.candidates
      if (this.result !== null &&
        game.result !== null &&
        this.result.id !== game.result.id) {
        this.showResult = false
      } else if (this.result === null || game.result === null) {
        this.showResult = false
      }
      this.result = game.result
      if (this.player) {
        console.log(game.player)
        this.player.setData(game.player)
      }
    }))
  }
  @Debounce(500)
  fetchGameStage() {
    request.get('/game/stage')
    .then(action(({stage}) => {
      this.stage = stage
    }))
  }
  sendDraw() {
    request.post('/game/draw')
  }
  sendEndDraw() {
    request.post('/game/end_draw')
  }

  sendStage(stage) {
    request.post('/game/stage/'+stage)
  }

  @action
  setShowResult(b) {
    this.showResult = b
  }

  @action
  sendChoice(candidateId, playerId, choiceId) {
    let find = _.find(this.candidate.chosens, {playerId})
    if (find) {
      find.choiceId = choiceId
    } else {
      this.candidate.chosens.push({playerId, choiceId})
    }
    find = _.find(this.player.choices, {candidateId})
    if (find) {
      find.choiceId = choiceId
    } else {
      this.player.choices.push({candidateId, choiceId})
    }
    request.post('/game/candidate/'+candidateId+'/player/'+playerId+'/choice/'+choiceId)
  }

  @computed get guessStatus() {
    if (!this.candidate) return []
    return this.candidate.chosens.map(({playerId}) => {
      return playerId
    })
  }

  sendDrawResult() {
    request.post('/game/drawResult')
  }

  @computed get scores() {
    return this.players.map(player => {
      let score = player.choices.filter(c => c.candidateId === c.choiceId).length
      return {name: player.name, score}
    })
  }
}
module.exports = Game
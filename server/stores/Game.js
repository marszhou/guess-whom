"use strict"

const _ = require('lodash')
const Round = require('./Round')

// stage 是传送给客户端，用于客户端决定显示什么游戏界面的
const STAGE = {
  info: 0,
  survey: 1,
  guess: 2,
  result: 3,
  end: 4
}

class Game {
  constructor(props) {
    this.init()
  }

  init() {
    this.players = []
    this.candidates = []
    this.stage = STAGE.init
  }

  addPlayer(player) {
    this.players.push(player)
  }

  removePlayer(player) {
    let {index} = this.getPlayerById(player.id)
    if (index > -1) this.players.splice(index, 1)
  }

  updatePlayer(playerInfo) {
    let {player} = this.getPlayerById(playerInfo.id)
    if (player) {
      player.update(playerInfo)
    }
  }

  setPlayerIsConfirmed(playerId, confirm) {
    let {player} = this.getPlayerById(playerId)
    if (player) {
      player.setIsConfirmed(confirm)
    }
  }

  getPlayerById(playerId) {
    let index = _.findIndex(this.players, {id: playerId})
    if (index > -1) {
      return {
        index, player: this.players[index]
      }
    }
    return {}
  }

  playerExists(playerId) {
    let {player} = this.getPlayerById(playerId)
    return !!player
  }

  getPlayersCount() {
    return this.players.length
  }

  setStage(stage) {
    this.stage = stage
  }

  _availableCandidates() {
    return _.filter(this.players, player => !player.isUsed)
  }

  draw() {
    if (this.stage === STAGE.guess) {
      if (!this.candidate) {
        let candidate = this._drawCandidate()
        if (candidate) {
          candidate.isUsed = true
          this.candidate = candidate
          return true
        }
      }
    }
    return false
  }

  endDraw() {
    if (this.stage === STAGE.guess) {
      if (this.candidate) {
        this.candidates.push(this.candidate.id)
        this.candidate = null
        return true
      }
    }
    return false
  }

  _drawCandidate() {
    let availables = this._availableCandidates()
    return _.sample(availables)
  }

  setPlayerAnswers(playerId, answers) {
    let {player} = this.getPlayerById(playerId)
    if (player) {
      player.setAnswers(answers)
    }
  }

  setPlayerIsSurvey(playerId, isSurvey) {
    let {player} = this.getPlayerById(playerId)
    console.log(player)
    if (player) {
      player.isSurvey = isSurvey
    }
  }

  guess(playerId, targetId, choiceId) {
    let {player} = this.getPlayerById(playerId)
    let {player: target} = this.getPlayerById(targetId)
    let {player: choice} = this.getPlayerById(choiceId)

    if (player && target && choice) {
      player.addChoice({target: target, choice: choice})
    }
  }

  isCandidate(playerId) {
    return !!this.currentRound &&
           this.currentRound.hasCandidate(playerId)
  }
}

module.exports = Game
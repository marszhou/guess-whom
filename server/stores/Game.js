"use strict"

const _ = require('lodash')
const Round = require('./Round')

// stage 是传送给客户端，用于客户端决定显示什么游戏界面的
const STAGE = {
  init: 0,
  playerLogin: 1,
  playing: 2,
  end: 3
}

class Game {
  constructor(props) {
    this.init()
  }

  init() {
    this.players = []
    this.stage = STAGE.init
    this.rounds = []
    this.currentRound = null
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

  _drawCandidate(n) {
    let availables = this._availableCandidates()
    return _.sampleSize(availables, n)
  }

  startNewRound(candidateCount) {
    let round = new Round()
    let candidates = this._drawCandidate(candidateCount)
    if (candidates.length > 0) {
      round.start(candidates)
      this.rounds.push(round)
      this.currentRound = round
      return round
    }
  }

  endRound() {
    if (this.currentRound) {
      this.currentRound.end()
      this.currentRound = null
    }
  }

  setPlayerAnswer(playerId, answers) {
    let {player} = this.getPlayerById(playerId)
    if (player) {
      player.setAnswers(answers)
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
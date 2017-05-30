"use strict"

const {uniqId} = require('../../src/utils/Func')
const _ = require('lodash')

class Player {
  constructor(info) {
    this.id = info.id
    this.isUsed = false       // 是否被使用
    this.isDisposed = false   // 是否完成使用
    this.isConfirmed = false
    this.isSurvey = false
    this.name = info.name
    this.status = info.status
    this.answers = info.answers
    this.choices = []         // 当前选手的选择
    this.chosens = []         // 当前选手被选的结果
  }

  update(info) {
    const {name, status} = info
    this.name = name
    this.status = status
  }

  setAnswers(answers) {
    // if (this.answers) {
    this.answers = answers
      // return true
    // }
  }

  setIsConfirmed(confirm) {
    this.isConfirmed = confirm
  }

  setIsSurvey(v) {
    this.isSurvey = v
  }

  addChoice({candidateId, choiceId}) {
    let find = _.find(this.choices, {candidateId})
    if (find) {
      find.choiceId = choiceId
    } else {
      this.choices.push({candidateId, choiceId})
    }
  }

  addChosen({playerId, choiceId}) {
    let find = _.find(this.chosens, {playerId})
    if (find) {
      find.choiceId = choiceId
    } else {
      this.chosens.push({playerId, choiceId})
    }
  }
}

module.exports = Player
"use strict"

const {uniqId} = require('../../src/utils/Func')
const _ = require('lodash')

class Player {
  constructor(info) {
    this.isUsed = false       // 是否被使用
    this.isFinished = false   // 是否完成使用
    this.isConfirmed = false
    this.isSurvey = false
    this.id = info.id
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
    if (this.answers.length === 0) {
      this.answers = answers
      return true
    }
  }

  setIsConfirmed(confirm) {
    this.isConfirmed = confirm
  }

  setIsSurvey(v) {
    this.isSurvey = v
  }

  addChoice(target, choice) {
    this.choices.push({target, choice})
  }

  addChosen(player, choice) {
    this.chosens({player, choice})
  }
}

module.exports = Player
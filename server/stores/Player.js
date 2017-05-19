"use strict"

const {uniqId} = require('../../src/utils/Func')
const _ = require('lodash')

class Player {
  constructor(props) {
    this.isUsed = false       // 是否被使用
    this.isFinished = false   // 是否完成使用
    this.id = uniqId()
    this.name = ''
    this.status = ''
    this.answers = []
    this.choices = []         // 当前选手的选择
    this.chosens = []         // 当前选手被选的结果
  }

  update(info) {
    {name: this.name, status: this.status} = info
  }

  setAnswers(answers) {
    if (this.answers.length === 0) {
      this.answers = answers
      return true
    }
  }

  addChoice(target, choice) {
    this.choices.push({target, choice})
  }

  addChosen(player, choice) {
    this.chosens({player, choice})
  }
}

module.exports = Player
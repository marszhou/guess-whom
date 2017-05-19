"use strict"
const {extendObservable, computed} = require('mobx')
// import {extendObservable} from 'mobx'

class Game {
  constructor(props) {
    extendObservable(this, {
      stage: 0,
      users: [],
      rounds: []
    })
    this.init()
  }

  init() {
    this.stage = 0
    this.users = []
    this.rounds = []
  }

  addUser(user) {
    this.users.push(user)
  }

  removeUser(user) {
    let index = this.users.findIndex(u => user.id === u.id)
    if (index > -1) {
      this.users.splice(index, 1)
    }
  }

  @computed
  get userCount() {
    return this.users.length
  }
}
module.exports = Game
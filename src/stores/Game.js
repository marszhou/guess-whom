const {extendObservable, computed, action } = require('mobx')
// import {extendObservable} from 'mobx'
import PlayerStore from './Player'

class Game {
  constructor(props) {
    extendObservable(this, {
      stage: 0,
      users: []
    })
    this.player = new PlayerStore()
    this.init()
  }

  init() {
    this.stage = 0
    this.users = []
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

  @computed get userCount() {
    return this.users.length
  }
}
module.exports = Game
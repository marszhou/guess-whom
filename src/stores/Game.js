const {extendObservable, computed, action } = require('mobx')
// import {extendObservable} from 'mobx'
import PlayerStore from './Player'

const CHANNELS = [
  'private',
  'public'
]

const SOCKET_EVENTS = {
  public: [
    'game_info',
    'user_list'
  ],
  private: [
    'user_info'
  ]

}

class Game {
  constructor(socket) {
    extendObservable(this, {
      stage: 0,
      users: []
    })
    this.player = new PlayerStore()
    this.init()
    this.initSocket(socket)
  }

  init() {
    this.stage = 0
    this.users = []
  }

  initSocket(socket) {
    this.socket = socket
    this.socket.on('connect', () => {
      console.log('client connect to socket server')

      CHANNELS.forEach(channel => (
        this.socket.emit('sub', {channelId: channel, playerId: this.player.id})
      ))

      SOCKET_EVENTS.public.forEach(event => {
        this.socket.on(event, this.handleSocketEvent.bind(this, event))
      })
    })
  }

  handleSocketEvent = (event, ...rest) => {

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
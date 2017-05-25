const {extendObservable, computed, action } = require('mobx')
// import {extendObservable} from 'mobx'
import socket from 'src/utils/get-client-socket'
import PlayerStore from './Player'
import {CHANNELS, SOCKET_EVENTS} from 'src/consts'

class Game {
  constructor(role='player') {
    this.role = role
    extendObservable(this, {
      stage: 0,
      users: []
    })
    if (role === 'player') {
      this.player = new PlayerStore(socket)
    }
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
      if (this.role === 'admin') {
        this.socket.emit('sub', {
          channelId: 'admin',
          playerId: '__admin__'
        })
      } else {
        this.socket.emit('sub', {
          channelId: 'admin',
          playerId: this.player.id
        })

        this.socket.emit('sub', {
          channelId: 'private_' + this.player.id,
          playerId: this.player.id
        })
      }
    })

    SOCKET_EVENTS.public.forEach(event => { // 监听事件
      this.socket.on(event, this.handleSocketEvent.bind(this, event))
    })
  }

  handleSocketEvent = (event, ...rest) => {
    console.log(event, rest)
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
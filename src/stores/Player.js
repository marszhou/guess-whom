import request from 'utils/Request'
import Func from 'utils/Func'
import {observable, action, computed} from 'mobx'
import _ from 'lodash'
import {Debounce} from 'lodash-decorators'

class Player {
  constructor(socket) {
    this.socket = socket
    this.queryInfo()
  }

  @observable isEditing = true
  @action
  setIsEditing(v) {
    this.isEditing = v
  }
  @observable id = null
  @observable name = ''
  @observable status = ''
  score = 0
  _isOnline = false
  _lastHeartBeat = 0
  @observable answers = []
  @observable guesses = []

  @observable _isModified = false // 是否人为修改过
  @observable isConfirmed = false

  @action
  confirm() {
    this.isConfirmed = true
    this.sendIsConfirmed(true)
  }

  @action
  reset() {
    this.isConfirmed = false
    this.isEditing = true
    this.sendIsConfirmed(false)
  }

  @computed get hasError() {
    if (this._isModified && !this.name.trim()) {
      return {name: true}
    }
    return false
  }

  @action
  loadInfo(info) {
    for (let key in info) {
      if (info.hasOwnProperty(key)) {
        this[key] = info[key]
      }
    }
  }

  getPlayerInfo() {
    return _.pick(this, 'id', 'name', 'status', 'answers')
  }

  @action
  set(name, value) {
    this._isModified = true
    this[name] = value
    this.pushInfo()
  }

  // ---- request methods ---
  /*
    get /player/:playerId
  */
  @action
  queryInfo() {
    let id = window.localStorage.getItem('playerId')
    if (id) {
      this.id = id
      request.get('/player/' + id)
      .then(({player}) => {
        if (player) {
          this.loadInfo(player)
        }
      })
    } else {
      this.id = Func.uniqId()
      window.localStorage.setItem('playerId', this.id)
    }
    console.log('player id = ' + id)
  }

  /*
    post /player/:playerId
  */
  @Debounce(500)
  pushInfo() {
    let info = this.getPlayerInfo()
    request.post('/player/' + this.id, {body: info})
    .then(response => {
    })
  }
  /**
    post /player/:playerId/confirm
   */
  sendIsConfirmed(confirm = true) {
    let body = {confirm}
    request.post('/player/' + this.id + '/confirm', {body})
    .then(response => {

    })
  }
}

export default Player
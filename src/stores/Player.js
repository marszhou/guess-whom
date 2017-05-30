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
  @observable chosens = []
  @observable choices = []

  @observable _isModified = false // 是否人为修改过
  @observable isConfirmed = false
  @observable isSurvey = false

  @action
  addAnswer(period = '') {
    let answer = {
      period,
      target: ''
    }
    this.answers.push(answer)
  }

  @action
  removeAnswer(index) {
    this.answers.splice(index, 1)
  }

  @action
  updateAnswer(index, field, value) {
    let answer = this.answers[index]
    answer[field] = value
  }

  @computed get answerValidates() {
    return this.answers.map(answer => {
      return {
        period: answer.period.trim().length > 0,
        target: answer.target.trim().length > 0
      }
    })
  }

  checkAnswers() {
    let error = {}
    if (_.some(this.answerValidates, v => (
        !(v.period && v.target)
      ))) {
      error.message = '有部分选项未填写完整'
      return error
    }

    let periods = _.map(this.answers, 'period')
    if (_.uniq(periods).length !== periods.length) {
      error.message = '时期填写重复'
      return error
    }

    if (this.answers.length < 2) {
      error.message = '至少填写两项'
      return error
    }
    return null
  }

  @action
  confirm() {
    this.isConfirmed = true
    this.sendIsConfirmed(true)
  }

  @action
  resetConfirm() {
    this.isConfirmed = false
    this.isEditing = true
    this.sendIsConfirmed(false)
  }

  @computed get hasInfoError() {
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
  @action
  sendAnswers() {
    this.isSurvey = true
    let body = {
      answers: this.answers,
      isSurvey: this.isSurvey
    }
    console.log(body)
    request.post('/player/' + this.id + '/answers', {body})
  }
  @action
  cancelAnswers() {
    this.isSurvey = false
    let body = {
      isSurvey: this.isSurvey
    }
    request.post('/player/' + this.id + '/answers', {body})
  }
}

export default Player
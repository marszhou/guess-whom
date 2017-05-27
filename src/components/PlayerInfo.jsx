import React from 'react'
import {inject, observer} from 'mobx-react'
import cx from 'classnames'

import Page from 'src/stores/Page'

@inject('game')
@observer
class PlayerInfo extends React.Component {
  componentWillMount() {
    Page.pushTitle('设置')
  }

  componentWillUnmount() {
    Page.popTitle()
  }

  handleChange = (e) => {
    let {player} = this.props.game
    player.set(
      e.target.getAttribute('name'),
      e.target.value
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let {player} = this.props.game
    if (!player.hasInfoError) {
      player.setIsEditing(false)
    }
  }

  handleConfirm = (e) => {
    e.preventDefault()
    let {player} = this.props.game
    player.confirm()
  }

  handleReset = (e) => {
    e.preventDefault()
    let {player} = this.props.game
    player.resetConfirm()
  }

  renderForm() {
    let {player} = this.props.game
    return (
      <form className="form-horizontal">
        <div id="legend" className>
          <legend className>填写必要信息</legend>
        </div>

        <div className={cx({
          "form-group": true,
          "has-error": !!player.hasInfoError
        })}>
          <label className="col-sm-2 control-label">
            名字
            {
              player.hasInfoError ? (<span>- 必须填写名字</span>) : null
            }
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="怎么称呼你？"
              name='name'
              value={player.name}
              onChange={this.handleChange}
            />

          </div>
        </div>

        <div className="form-group">
          <label className="col-sm-2 control-label">状态信息</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="随便写点什么..."
              name='status'
              value={player.status}
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={this.handleSubmit}
            >
              确认
            </button>
          </div>
        </div>
      </form>
    )
  }

  renderResult() {
    let {player} = this.props.game
    return (
      <form className="form-horizontal">
        <div id="legend" className>
          <legend className>确认填写信息</legend>
        </div>

        <div className="form-group">
          <label className="col-sm-2 control-label">名字</label>
          <div className="col-sm-10">
            {player.name}
          </div>
        </div>

        <div className="form-group">
          <label className="col-sm-2 control-label">状态信息</label>
          <div className="col-sm-10">
            {player.status || "(无)"}
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={this.handleConfirm}
              disabled={player.isConfirmed}
            >
              {
                (player.isConfirmed) ? (<span>一切就绪<img src="static/assets/svg/loading-bubbles.svg" alt="Loading icon" style={{width: 16}}/></span>) : 'I\'m Ready!'
              }
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button
              type="button"
              className="btn btn-default btn-block"
              onClick={this.handleReset}
            >
              再改改...
            </button>
          </div>
        </div>
      </form>
    )
  }

  render() {
    const {player} = this.props.game
    const {isEditing} = player
    let content = null
    if (isEditing) {
      content = this.renderForm()
    } else {
      content = this.renderResult()
    }
    return content
  }
}

export default PlayerInfo
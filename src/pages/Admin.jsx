import React from 'react'
import GameStore from 'src/stores/Game'
import {observer} from 'mobx-react'
import Page from 'src/stores/Page'
import cx from 'classnames'

@observer
class AdminPage extends React.Component {
  componentWillMount() {
    Page.pushTitle('管理员')
    this.game = new GameStore('admin')
  }

  goStage0 = () => {
    this.game.sendStage(0)
  }

  goStage1 = () => {
    this.game.sendStage(1)
  }

  goStage2 = () => {
    this.game.sendStage(2)
  }

  goStage3 = () => {
    this.game.sendStage(3)
  }

  goStage4 = () => {
    this.game.sendStage(4)
  }

  drawPlayer = () => {
    this.game.draw()
  }

  endDrawPlayer = () => {
    this.game.endDraw()
  }

  drawResult = () => {
    this.game.drawResult()
  }

  renderStartBtn() {
    return (
      <button
        type='button'
        className={cx({btn: true, [this.game.stage === -1 ? "btn-primary" : "btn-default"]: true, "btn-block": true})}
        disabled={this.game.stage !== -1}
        onClick={this.goStage0}
      >
      开始
      </button>
    )
  }

  renderStage0Btn() {
    return (
      <button
        type='button'
        className={cx({btn: true, [this.game.stage0Ready ? "btn-primary" : "btn-default"]: true, "btn-block": true})}
        disabled={!this.game.stage0Ready}
        onClick={this.goStage1}
      >
      confirm({this.game.confirmedLength})
      </button>
    )
  }

  renderStage1Btn() {
    return (
      <button
        type='button'
        className={cx({btn: true, [this.game.stage1Ready ? "btn-primary" : "btn-default"]: true, "btn-block": true})}
        disabled={!this.game.stage1Ready}
        onClick={this.goStage2}
      >
      start({this.game.surveyLength})
      </button>
    )
  }

  renderDrawButton() {
    let disabled = false
    if (this.game.stage !== 2) {
      disabled = true
    }

    let ret = null
    if (this.game.candidate) {
      ret = (<button
        key='endDraw'
        type='button'
        className={cx({btn: true, "btn-block": true, [disabled?'btn-default':'btn-primary']: true})}
        onClick={this.endDrawPlayer}
      >
        结束当前抽取（{this.game.candidate.chosens.length + '/' + this.game.playersLength})
      </button>)
    } else {
      ret = (<button
        key='draw'
        type='button'
        className={cx({btn: true, "btn-block": true, [disabled?'btn-default':'btn-primary']: true})}
        disabled={disabled || !this.game.availablePlayersLength}
        onClick={this.drawPlayer}
      >
        抽取（{this.game.availablePlayersLength}剩余）
      </button>)
    }

    if (!this.game.candidate &&
      this.game.availablePlayersLength === 0) {
      ret = [ret]
      ret.push(<button
          type='button'
          className={cx({btn: true, 'btn-block': true, [disabled?'btn-default':'btn-primary']: true})}
          key='goStage3'
          onClick={this.goStage3}
          disabled={disabled && !this.game.availablePlayersLength}
        >查看结果</button>)
    }

    return ret
  }

  renderResultButton() {
    let disabled = false
    if (this.game.stage !== 3) {
      disabled = true
    }

    let ret = null
    let nextBtn = (
      <button
        type='button'
        className={cx({btn: true, 'btn-block': true, [disabled?'btn-default':'btn-primary']: true})}
        key='showResult'
        onClick={this.drawResult}
        disabled={disabled || this.game.undisposedPlayersLength === 0}
      >
        抽取一个结果({this.game.undisposedPlayersLength}剩余)
      </button>
    )

    if (this.game.undisposedPlayersLength === 0) {
      ret = [
        nextBtn,
        (
          <button
            type='button'
            key='endGame'
            disabled={disabled}
            className={cx({btn: true, 'btn-block': true, [disabled?'btn-default':'btn-primary']: true})}
            onClick={this.goStage4}
          >
            结束游戏
          </button>)
      ]
    } else {
      ret = nextBtn
    }

    return ret
  }

  renderResult() {
    return (<ul>
      {
        this.game.players.map(player => {
          return (
            <li key={player.id}>
              {player.name}
              <ul>

                {
                  player.answers.map((answer, index) => {
                    return (<li key={index}>{answer.period}:{answer.target}</li>)
                  })
                }
              </ul>
            </li>

          )
        })
      }

    </ul>)
  }

  render() {
    return (
      <div>
        <div>当前状态: {this.game.stage}, 人数: {this.game.playersLength}</div>
        { this.renderStartBtn()}
        { this.renderStage0Btn() }
        { this.renderStage1Btn() }
        { this.renderDrawButton() }
        { this.renderResultButton() }
        { this.renderResult() }
      </div>
    )
  }
}

export default AdminPage
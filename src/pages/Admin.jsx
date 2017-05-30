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

  goStage1 = () => {
    this.game.sendStage(1)
  }

  goStage2 = () => {
    this.game.sendStage(2)
  }

  drawPlayer = () => {
    this.game.draw()
  }

  endDrawPlayer = () => {
    this.game.endDraw()
  }

  renderDrawButton() {
    if (this.game.stage !== 2) {
      return null
    }

    let ret = null
    if (this.game.candidate) {
      ret = (<button
        type='button'
        className={cx({btn: true, "btn-block": true, 'btn-primary': true})}
        onClick={this.endDrawPlayer}
      >
        结束当前抽取
      </button>)
    } else {
      ret = (<button
        type='button'
        className={cx({btn: true, "btn-block": true, 'btn-primary': true})}
        disabled={!this.game.availablePlayersLength}
        onClick={this.drawPlayer}
      >
        抽取（{this.game.availablePlayersLength}剩余）
      </button>)
    }

    return ret
  }

  render() {
    return (
      <div>
        <div>当前状态: {this.game.stage}, 人数: {this.game.playersLength}</div>
        <button
          type='button'
          className={cx({btn: true, [this.game.stage0Ready ? "btn-primary" : "btn-default"]: true, "btn-block": true})}
          disabled={!this.game.stage0Ready}
          onClick={this.goStage1}
        >
        confirm({this.game.confirmedLength})
        </button>

        <button
          type='button'
          className={cx({btn: true, [this.game.stage1Ready ? "btn-primary" : "btn-default"]: true, "btn-block": true})}
          disabled={!this.game.stage1Ready}
          onClick={this.goStage2}
        >
        start({this.game.surveyLength})
        </button>

        { this.renderDrawButton() }

      </div>
    )
  }
}

export default AdminPage
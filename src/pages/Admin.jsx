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
      </div>
    )
  }
}

export default AdminPage
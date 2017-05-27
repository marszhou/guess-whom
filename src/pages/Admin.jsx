import React from 'react'
import GameStore from 'src/stores/Game'
import {observer} from 'mobx-react'
import Page from 'src/stores/Page'

@observer
class AdminPage extends React.Component {
  componentWillMount() {
    Page.pushTitle('管理员')
    this.game = new GameStore('admin')
  }

  render() {
    return (
      <div>
        <div>当前状态: {this.game.stage}</div>
        <button
          type='button'
          className="btn btn-default btn-block"
        >
        全部成员Confirm,进入stage=2
        </button>
      </div>
    )
  }
}

export default AdminPage
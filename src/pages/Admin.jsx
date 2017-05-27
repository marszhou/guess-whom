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
        <button type='button'></button>
      </div>
    )
  }
}

export default AdminPage
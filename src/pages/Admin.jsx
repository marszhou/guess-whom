import React from 'react'
import GameStore from 'src/stores/Game'
import {observer} from 'mobx-react'

@observer
class AdminPage extends React.Component {
  componentWillMount() {
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
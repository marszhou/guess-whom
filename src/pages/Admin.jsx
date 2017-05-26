import React from 'react'
import GameStore from 'src/stores/Game'
import {observer} from 'mobx-react'

@observer
class AdminPage extends React.Component {
  componentWillMount() {
    this.game = new GameStore('admin')
  }

  renderPlayers() {
    return (
      <ul>
        {
          this.game.players.map(player => {
            return (
              <li key={player.id}>{player.name}</li>
            )
          })
        }
      </ul>
    )
  }

  render() {
    return (
      <div>

        {this.renderPlayers()}
      </div>
    )
  }
}

export default AdminPage
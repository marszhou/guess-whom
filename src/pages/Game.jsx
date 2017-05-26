import React from 'react'
import GameStore from 'src/stores/Game'
import {observer} from 'mobx-react'

@observer
class GamePage extends React.Component {
  componentWillMount() {
    this.game = new GameStore('game')
  }

  render() {
    return (
      <div>
        Game
      </div>
    )
  }
}

export default GamePage
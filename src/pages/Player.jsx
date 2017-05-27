import React from 'react'
import {Provider, observer} from 'mobx-react'

import PlayerInfo from 'components/PlayerInfo'
import GameStore from 'src/stores/Game'

import Page from 'src/stores/Page'

@observer
class Player extends React.Component {
  componentWillMount() {
    Page.pushTitle('用户')
    this.game = new GameStore('player')
  }

  render() {
    const game = this.game
    console.log(game.stage)
    const {stage} = game
    let content = null
    switch (stage) {
      case 0:
        content = (<PlayerInfo/>)
        break
      case 1:
      case 2:
      case 3:
      default:
        content = null
    }
    return (
      <Provider game={game}>
        <div>
          {content}
        </div>
      </Provider>
    )
  }
}

export default Player
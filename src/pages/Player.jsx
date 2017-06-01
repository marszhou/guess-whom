import React from 'react'
import {Provider, observer} from 'mobx-react'

import PlayerInfo from 'components/PlayerInfo'
import PlayerAnswer from 'components/PlayerAnswer'
import PlayerGuess from 'components/PlayerGuess'
import PlayerStatus from 'components/PlayerStatus'

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
    const {stage} = game
    let content = null

    switch (stage) {
      case 0:
        content = (<PlayerInfo/>)
        break
      case 1:
        content = (<PlayerAnswer/>)
        break
      case 2:
        content = [
          (<PlayerStatus key='status'/>),
          (<PlayerGuess key='guess'/>)
        ]
        break
      case 3:
        content = (<PlayerStatus/>)
        break
      case 4:
        content = (<h1 style={{textAlign: 'center'}}>The end</h1>)
        break
      default:
        content = null
        break
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
import React from 'react'
import {Provider, observer} from 'mobx-react'

import PlayerInfo from 'components/PlayerInfo'
import PlayerAnswer from 'components/PlayerAnswer'
import PlayerGuess from 'components/PlayerGuess'
import PlayerStatus from 'components/PlayerStatus'

import GameStore from 'src/stores/Game'

import Page from 'src/stores/Page'
import CalculatedCss from 'components/CalculatedCss'

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
      case -1:
        content = (<h1 style={{textAlign: 'center'}}><img src='/static/assets/90eef340gw1f3in3k0fzdg20780aax6p.gif' alt='wait'/></h1>)
        break
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
        content = (<h1 style={{textAlign: 'center'}}>The End<br/><img src='/static/assets/IMG_4227.JPG' className='img-responsive' alt='the end'/></h1>)
        break
      default:
        content = null
        break
    }
    return (
      <Provider game={game}>
        <div>
          <CalculatedCss/>
          {content}
        </div>
      </Provider>
    )
  }
}

export default Player
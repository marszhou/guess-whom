import React from 'react'
import {observer, inject} from 'mobx-react'
import {computed} from 'mobx'

@inject('game')
@observer
class GuessPlayerCell extends React.Component {
  @computed get isGuessed() {
    let isGuessed = false
    const {player, game} = this.props
    if (player && game) {
      isGuessed = game.guessStatus.indexOf(player.id) > -1
    }
    return isGuessed
  }
  render() {
    let {player} = this.props
    return (
      <div className='player' style={{}}>
        <h4>{player.name}</h4>
        <desc>{player.status}</desc>
        {this.isGuessed ? '✔︎' : ''}
      </div>
    )
  }
}

export default GuessPlayerCell
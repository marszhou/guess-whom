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
    return (<div className=''>
      <div className='player light-primary-color' style={{}}>
        <name className='text-primary-color accent-color'>
          <span style={{'fontFamily': 'FontAwesome', display: 'none'}}>&#xf00c;</span>
          {player.name}
        </name>
        <desc className='text-primary-color default-primary-color'>
          {player.status}
        </desc>
        {this.isGuessed ? (<sign><i className="choosed fa fa-check"/></sign>) : ''}
      </div>
    </div>)
  }
}

export default GuessPlayerCell
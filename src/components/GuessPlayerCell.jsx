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
    return (<div className={'theme-' + player.theme}>
      <div className='player fade-transition light-primary-color' style={{}}>
        <name className='text-primary-color fade-transition accent-color'>
          <span style={{'fontFamily': 'FontAwesome', display: 'none'}}>&#xf00c;</span>
          {player.name}
        </name>
        {
          player.status ? (
            <desc className='text-primary-color fade-transition default-primary-color'>
              {player.status.substring(0,20)}
            </desc>) : null
        }

        {this.isGuessed ? (<sign><i className="fade-transition choosed fa fa-check"/></sign>) : ''}
      </div>
    </div>)
  }
}

export default GuessPlayerCell
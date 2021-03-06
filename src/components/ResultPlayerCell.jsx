import React from 'react'
import {observer, inject} from 'mobx-react'
import {computed} from 'mobx'
import _ from 'lodash'

@inject('game')
@observer
class ResultPlayerCell extends React.Component {

  @computed get myGuess() {
    const {player, game} = this.props
    if (game.result) {
      let choice = _.find(player.choices, {candidateId: game.result.id})
      if (choice) {
        let guess = game.getPlayerById(choice.choiceId)
        return guess
      }
    }
    return undefined
  }

  @computed get myGuessCorrect() {
    if (!this.myGuess) {
      return false
    } else {
      return this.myGuess.id === this.props.game.result.id
    }
  }

  renderGuess() {
    const {game} = this.props
    if (this.myGuess === undefined) {
      return null
    }
    return (
      <guess className={'primary-text-color fade-transition' + (game.showResult ? (this.myGuessCorrect ? ' correct':'') : '')}>
        {this.myGuess ? this.myGuess.name : '(未选择)'}
      </guess>
    )
  }

  render() {
    let {player} = this.props
    return (<div className={'theme-' + player.theme}>
      <div className='player fade-transition light-primary-color' style={{}}>
        <name className='text-primary-color fade-transition accent-color'>{player.name}</name>
        {
          player.status ? (
            <desc className='text-primary-color fade-transition default-primary-color'>
              {player.status.substring(0,20)}
            </desc>) : null
        }

        {this.renderGuess()}
      </div>
    </div>)
  }
}

export default ResultPlayerCell
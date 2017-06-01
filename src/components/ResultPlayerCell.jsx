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
      <guess className={game.showResult ? (this.myGuessCorrect ? 'correct︎':'') : ''}>
        {this.myGuess ? this.myGuess.name : '(未选择)'}
        {game.showResult ? (this.myGuessCorrect ? '✔︎':'') : ''}
      </guess>
    )
  }

  render() {
    let {player} = this.props
    return (
      <div className='player' style={{}}>
        <name>{player.name}</name>
        <desc>{player.status}</desc>
        {this.renderGuess()}
      </div>
    )
  }
}

export default ResultPlayerCell
import React from 'react'
import {inject, observer} from 'mobx-react'
import {computed} from 'mobx'
import cx from 'classnames'
import _ from 'lodash'

@inject('game')
@observer
class PlayerGuess extends React.Component {
  @computed get choice() {
    const {candidate, player} = this.props.game
    let find = _.find(candidate.chosens, {playerId: player.id})
    if (find) {
      return find.choiceId
    }
    return find
  }

  handleChange = (e) => {
    let choice = e.target.value
    this.props.game.sendChoice(this.props.game.candidate.id, this.props.game.player.id, choice)
  }

  renderChoose() {
    const {players} = this.props.game
    return (
      <form className="form-horizontal">
        <div id="legend" className>
          <legend className>你要怎么选择呢？</legend>

          <div className={cx({
            "form-group": true
          })}>
            <label className="col-sm-2 control-label">
              候选人
            </label>
            <div className="col-sm-10">
              {
                players.map(player => {
                  return (
                  <div className="radio" key={player.id}>
                    <label>
                      <input
                        type="radio"
                        name="ret"
                        onClick={this.handleChange}
                        value={player.id}
                        checked={player.id === this.choice}
                        />
                      {player.name}
                    </label>
                  </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </form>
    )
  }

  renderPending() {
    return 'pending'
  }
  render() {
    let {candidate} = this.props.game
    return (
      <div>
        {
          candidate ? this.renderChoose() : this.renderPending()
        }
      </div>
    )
  }
}

export default PlayerGuess
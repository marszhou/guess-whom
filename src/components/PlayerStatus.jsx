import React from 'react'
import cx from 'classnames'
import {observer, inject} from 'mobx-react'

@inject('game')
@observer
class PlayerStatus extends React.Component {
  handleChange = (e) => {
    let {player} = this.props.game
    player.set(
      e.target.getAttribute('name'),
      e.target.value
    )
    player.pushInfo()
  }

  render() {
    let player = this.props.game.player
    return (
      <form className="form-horizontal">
        <div className={cx({
            "form-group": true
          })}>
          <label className="col-sm-2 control-label">
            状态
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="随便写点什么..."
              name='status'
              value={player.status}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </form>
    )
  }
}

export default PlayerStatus
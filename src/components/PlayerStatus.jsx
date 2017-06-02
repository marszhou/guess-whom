import React from 'react'
import cx from 'classnames'
import {observer, inject} from 'mobx-react'
import _ from 'lodash'

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

  handleThemeChange = (theme) => {
    let {player} = this.props.game
    player.set(
      'theme',
      theme
    )
    player.pushInfo()
  }

  renderThemeSelector() {
    let themes = ['pink', 'red', 'purple', 'deep-purple', 'indego', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']
    let {player} = this.props.game
    return themes.map(theme => (
      <div className={'theme-'+theme + ' box' + (player.theme === theme ? ' highlight' : '')} key={theme}>
        <div className='default-primary-color box-item' onClick={_.partial(this.handleThemeChange, theme)}></div>
      </div>
    ))
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

        <div className={cx({
            "form-group": true
          })}>
          <label className="col-sm-2 control-label">
            颜色主题
          </label>
          <div className="col-sm-10 theme-selector-frame">
            { this.renderThemeSelector()}
          </div>
        </div>
      </form>
    )
  }
}

export default PlayerStatus
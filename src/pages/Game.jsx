import React from 'react'
import GameStore from 'src/stores/Game'
import {observer} from 'mobx-react'
import Page from 'src/stores/Page'

@observer
class GamePage extends React.Component {
  componentWillMount() {
    this.game = new GameStore('game')
    Page.pushTitle('我猜')
  }

  renderBool(bool) {
    return bool ? (
                    <span className="glyphicon glyphicon-ok-sign"
                      style={{color: 'green'}}
                      aria-hidden="true"
                    />
                  ) :
                  (
                    <span className="glyphicon glyphicon glyphicon-remove-sign"
                      style={{color: 'red'}}
                      aria-hidden="true"
                    />
                  )
  }

  renderTableListPlayers() {
    return (
      <table
        className="table table-striped"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>名字</th>
            <th>状态</th>
            <th>资料就绪</th>
            <th>问卷就绪</th>
          </tr>
        </thead>
        <tbody>
        {
          this.game.players.map((player, index) => {
            return (
              <tr key={player.id}>
                <td>{index+1}</td>
                <td>{player.name}</td>
                <td>{player.status}</td>
                <td className={player.isConfirmed ? 'success' : 'danger'}>
                {this.renderBool(player.isConfirmed)}
                </td>
                <td className={player.isSurvey ? 'success' : 'danger'}>
                {this.renderBool(player.isSurvey)}
                </td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    )
  }

  renderPrepareScene() {
    return this.renderTableListPlayers()
  }

  renderGuess() {
    return (
      <div style={{display: "flow"}}></div>
    )
  }

  renderResult() {

  }

  renderEnd() {

  }

  render() {
    let content = null
    if (this.game.stage === 0 || this.game.stage === 1) {
      content = this.renderPrepareScene()
    } else if (this.game.stage === 2) {
      content = this.renderGuess()
    } else if (this.game.stage === 3) {
      content = this.renderResult()
    } else if (this.game.stage === 4) {
      content = this.renderEnd()
    }
    return (
      <div className='game'>
        <h2>game stage = {this.game.stage}</h2>
        {content}
      </div>
    )
  }
}

export default GamePage
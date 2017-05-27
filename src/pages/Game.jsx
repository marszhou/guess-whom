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

  renderPlayers() {
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
                <td className={player.isConfirm ? 'success' : 'danger'}>
                {this.renderBool(player.isConfirm)}
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

  render() {
    return (
      <div className='game'>

        {this.renderPlayers()}
      </div>
    )
  }
}

export default GamePage
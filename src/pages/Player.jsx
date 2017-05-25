import React from 'react'
import {Provider} from 'mobx-react'

import PlayerInfo from 'components/PlayerInfo'
import GameStore from 'src/stores/Game'

export default () => {
  const game = new GameStore('player')

  const {stage} = game
  let content = null
  switch (stage) {
    case 0:
      content = (<PlayerInfo/>)
      break
    case 1:
    case 2:
    case 3:
    default:
  }
  return (
    <Provider game={game}>
      <div>
        <nav className="navbar navbar-default navbar-fixed-top navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#"><div className="emoji">⁉️</div> Guess Whom</a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

            </div>
          </div>
        </nav>
        <div className="panel panel-default">
          <div className='panel-body'>
          {content}
          </div>
        </div>
      </div>
    </Provider>
  )
}
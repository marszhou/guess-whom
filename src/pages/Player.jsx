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
      content = null
  }
  return (
    <Provider game={game}>
      <div>
        {content}
      </div>
    </Provider>
  )
}
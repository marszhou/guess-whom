import React from 'react'
import {inject, observer} from 'mobx-react'

export default inject('game')(observer(function({game}) {
  let size = game.calculateGameLayoutSize()
  return (<style>
    {`
.game-content {
  width: ${game.contentWidth}px;
  height: ${game.contentHeight}px;
  padding: 0;
  margin: 0;
  border: 1px solid #EEE;
  border-spacing: 0px;
  border-collapse: separate;
}
.game-content td{
  margin: 0;
  padding: 0;
  bordre: 0;
}
.game-content td.cell {
  width: ${100/size}%;
  height: ${game.contentHeight/size}px
}
.game-content td.cell div.player{
  width: ${game.contentWidth/size}px;
  height: ${game.contentHeight/size}px;
  padding-left: 3px;
  overflow: hidden;
}
.game-content td.content div.frame{
  width: ${game.contentWidth/size*(size-2)}px;
  height: ${game.contentHeight/size*(size-2)}px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
}
.game-content td.content div.frame div.main{
  text-align: center;
}
.game-content .content {
  border: 1px solid #EEE;
}
.game-content tr.top .cell,
.game-content tr.bottom .cell {
  border-right: 1px solid #EEE;
}
.game-content tr.top .cell:last-of-type,
.game-content tr.bottom .cell:last-of-type {
  border-right: 0;
}
.game-content td.cell.left,
.game-content td.cell.right {
  border-bottom: 1px solid #EEE;
}
.game-content tr.bottom td.cell.left,
.game-content tr.bottom td.cell.right {
  border-bottom: 0;
}

.loading-frame {
  display: flex;
  align-items: center;
  justify-content: center;
}
    `}
  </style>)
}))
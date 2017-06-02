import React from 'react'
import GameStore from 'src/stores/Game'
import {observer, Provider} from 'mobx-react'
import Page from 'src/stores/Page'
import _ from 'lodash'
import cx from 'classnames'

import GuessPlayerCell from 'components/GuessPlayerCell'
import GuessContentCell from 'components/GuessContentCell'
import ResultPlayerCell from 'components/ResultPlayerCell'
import ResultContentCell from 'components/ResultContentCell'

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

@observer
class GamePage extends React.Component {
  _cellLoopIndex = 0

  componentWillMount() {
    this.game = new GameStore('game')
    Page.pushTitle('我猜')
  }

  renderCalculatedCss() {
    let size = this.game.calculateGameLayoutSize()
    return (<style>
      {`
.game-content {
  width: ${this.game.contentWidth}px;
  height: ${this.game.contentHeight}px;
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
  height: ${this.game.contentHeight/size}px
}
.game-content td.cell div.player{
  width: ${this.game.contentWidth/size}px;
  height: ${this.game.contentHeight/size}px;
  padding-left: 3px;
  overflow: hidden;
}
.game-content td.content div.frame{
  width: ${this.game.contentWidth/size*(size-2)}px;
  height: ${this.game.contentHeight/size*(size-2)}px;
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
      `}
    </style>)
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

  renderTable(size, PlayerCell, ContentCell) {
    this._cellLoopIndex = 0
    return (
      <table className='game-content' cellSpacing='0' cellPadding="0"><tbody>
        {
          _.range(size).map(row => {
            let classNames = {}
            if (row === 0) {classNames.top = true}
            if (row === size - 1) {classNames.bottom = true}

            return (
              <tr key={row} className={cx(classNames)}>
                {
                  _.range(size).map(column => {
                    return (
                      this.renderCell(size, column, row, PlayerCell, ContentCell)
                    )
                  })
                }
              </tr>
            )
          })
        }
      </tbody></table>
    )
  }

  renderCell(size, column, row, PlayerCell, ContentCell) {
    if (column === 0 || row === 0 || column === size - 1 || row === size - 1) {
      let props = {}
      let classNames = {cell: true}
      if (column === 0) { classNames.left = true}
      if (column === size - 1) {classNames.right = true}

      let cellIndex = this._cellLoopIndex
      let player = cellIndex < this.game.playersLength? this.game.players[cellIndex] : null
      ++this._cellLoopIndex

      return (
        <td className={cx(classNames)} key={column} {...props}>
          {
            player ?
              (<PlayerCell
                width={this.game.contentWidth / size}
                height={this.game.contentHeight / size}
                player={player}
              />) : '　'
          }
        </td>
      )
    } else if (column === 1 && row === 1){
      return (
        <td
          key="content"
          className="content"
          colSpan={size - 2}
          rowSpan={size - 2}
        >
          <ContentCell
            width={this.game.contentWidth / size * (size - 2)}
            height={this.game.contentHeight / size * (size - 2)}
          />
        </td>
      )
    }
    return null
  }

  renderGuess() {
    let size = this.game.calculateGameLayoutSize()
    return (
      <div>
        {this.renderCalculatedCss()}
        {this.renderTable(size, GuessPlayerCell, GuessContentCell)}
      </div>
    )
  }

  renderResult() {
    let size = this.game.calculateGameLayoutSize()
    return (
      <div>
        {this.renderCalculatedCss()}
        {this.renderTable(size, ResultPlayerCell, ResultContentCell)}
      </div>
    )
  }

  renderEnd() {
    let scores = this.game.scores
    return (
      <BarChart
        width={this.game.contentWidth}
        height={this.game.contentHeight}
        data={scores}
        layout='vertical'
        >
        <Tooltip/>
        <Bar dataKey='score' fill='#8884d8'/>
        <XAxis type='number' allowDecimals={false}/>
        <YAxis dataKey="name" type='category'/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Legend />
      </BarChart>
    )
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
      <Provider game={this.game}>
        <div className='game'>
          {content}
        </div>
      </Provider>
    )
  }
}

export default GamePage
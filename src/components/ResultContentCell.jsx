import React from 'react'
import {inject, observer} from 'mobx-react'
import {computed} from 'mobx'
import _ from 'lodash'
import {BarChart, Bar, XAxis, YAxis} from 'recharts'


@inject('game')
@observer
class ResultContentCell extends React.Component {
  renderResult(result) {
    return (
      <div className='frame'>
        {
          this.props.game.showResult ? ("🙉 " + result.name + " 🙉") : (<button type='button' className='btn btn-default btn-lg' onClick={() => this.props.game.setShowResult(true)}>🙈 他/她是谁? 🙈</button>)
        }

        <div className='main'>
          <div>
            {
              result.answers.map(({period, target}) => {
                return (
                  <div key={period}>🕐 {period} 👤 {target}</div>
                )
              })
            }
          </div>
          {
            this.renderChosenStatics()
          }
        </div>
      </div>
    )
  }

  @computed get chosenStatics() {
    const game = this.props.game
    let statics = _.reduce(game.result.chosens, (ret, c) => {
      let player = game.getPlayerById(c.choiceId)
      if (player && ret[player.name]) {
        ret[player.name] += 1
      } else {
        ret[player.name] = 1
      }
      return ret
    }, {})
    return _.map(_.keys(statics), name => ({name, score: statics[name]}))
  }

  renderChosenStatics() {
    let statics = this.chosenStatics
    return (
      <BarChart
        width={400}
        height={100}
        layout='vertical'
        data={statics}
        margin={{right: 0, left: 50}}
        >
        <Bar dataKey='score' fill='#8884d8'/>
        <XAxis type='number' allowDecimals={false} axisLine={false} tickLine={false} tick={false}/>
        <YAxis dataKey="name" type='category' mirror={false} interval={0}/>
      </BarChart>
    )
  }

  renderPending() {
    return (<div className='frame'><div className='loading'/></div>)
  }

  render() {
    let {result} = this.props.game

    return result ? this.renderResult(result) :
                    this.renderPending()
  }
}

export default ResultContentCell
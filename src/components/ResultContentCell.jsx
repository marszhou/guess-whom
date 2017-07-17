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
      <div className='frame  default-primary-color'>


        <div className='main  content-cell'>
          {
            this.props.game.showResult ? (<div className='result'>{result.name}</div>) : (<div className='question' onClick={() => this.props.game.setShowResult(true)}>他/她是谁?</div>)
          }
          {
            result.answers.map(({period, target}) => {
              return (<div className='option' key={period}><span className='period'>{period}</span> <span className='target'>{target}</span></div>)
            })
          }
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
    // let statics = []
    // _.range(10).forEach(i => {
    //   statics[i] = {name: i+'', score: Math.random() * 100}
    // })
    let {result} = this.props.game
    return (
      <BarChart
        width={this.props.width}
        height={this.props.height - (45 * (result.answers.length + 1))}
        layout='vertical'
        data={statics}
        margin={{right: 10, left: 25}}
        >
        <Bar dataKey='score' fill='#8884d8'/>
        <XAxis type='number' hide={true}/>
        <YAxis dataKey="name" type='category' mirror={false} interval={0}/>
      </BarChart>
    )
  }

  renderPending() {
    return (<div className='frame' style={{alignItems: "center"}}><div className='loading'/></div>)
  }

  render() {
    let {result} = this.props.game

    return result ? this.renderResult(result) :
                    this.renderPending()
  }
}

export default ResultContentCell
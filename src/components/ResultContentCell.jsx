import React from 'react'
import {inject, observer} from 'mobx-react'

@inject('game')
@observer
class ResultContentCell extends React.Component {
  renderResult(result) {
    return (
      <div className='frame'>
        {
          this.props.game.showResult ? (result.name) : (<button type='button' className='btn btn-default' onClick={() => this.props.game.setShowResult(true)}>他/她是谁？</button>)
        }

        <div className='main'>
          <ul>
            {
              result.answers.map(({period, target}) => {
                return (
                  <li key={period}>🕐 {period} 👤 {target}</li>
                )
              })
            }
          </ul>
        </div>
        <label style={{color: "#AAA"}}>请作答</label>
        <div>
          {
            result.chosens.length + "/" + this.props.game.playersLength + '人已选择'
          }
        </div>
      </div>
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
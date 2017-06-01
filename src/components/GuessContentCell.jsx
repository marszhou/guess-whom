import React from 'react'
// import {computed} from 'mobx'
import {inject, observer} from 'mobx-react'

@inject('game')
@observer
class GuessContentCell extends React.Component {
  renderCandidate(candidate) {
    return (<div className='frame'>

        <div className='main'>
          <h4>🙈 他/她是谁? 🙈</h4>
          <ul>
            {
              candidate.answers.map(({period, target}) => {
                return (<li key={period}>🕐 {period} 👤 {target}</li>)
              })
            }
          </ul>
        </div>
        <label style={{color: "#AAA"}}>请作答</label>
        <div>
          {
            candidate.chosens.length + "/" + this.props.game.playersLength + '人已选择'
          }
        </div>
      </div>)
  }

  renderPending() {
    return (<div className='frame'><div className='loading'/></div>)
  }

  render() {
    let {candidate} = this.props.game

    return candidate ? this.renderCandidate(candidate) :
                       this.renderPending()
  }
}

export default GuessContentCell
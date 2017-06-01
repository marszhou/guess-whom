import React from 'react'
import {inject, observer} from 'mobx-react'

@inject('game')
@observer
class ResultContentCell extends React.Component {
  renderCandidate(candidate) {
    return (<div className='frame'>
        <img src="static/assets/no-avatar.jpg"
            alt="no avatar" style={{width: 100, height: 100, margin: 5}}/>

        <div className='main'>
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
    let {candidate} = this.props

    return candidate ? this.renderCandidate(candidate) :
                       this.renderPending()
  }
}

export default ResultContentCell
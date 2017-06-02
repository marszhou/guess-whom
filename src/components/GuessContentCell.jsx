import React from 'react'
// import {computed} from 'mobx'
import {inject, observer} from 'mobx-react'

@inject('game')
@observer
class GuessContentCell extends React.Component {
  renderCandidate(candidate) {
    return (<div className='frame default-primary-color'>

        <div className='main content-cell'>
          <div className={'question'}>他/她是谁</div>
          {
            candidate.answers.map(({period, target}) => {
              return (<div className='option' key={period}><span className='period'>{period}</span> <span className='target'>{target}</span></div>)
            })
          }
          <div className='progressing'>
            {
              candidate.chosens.length + "/" + this.props.game.playersLength + '人已选择'
            }
          </div>
        </div>

      </div>)
  }

  renderPending() {
    return (<div className='frame' style={{alignItems: "center"}}><div className='loading'/></div>)
  }

  render() {
    let {candidate} = this.props.game

    return candidate ? this.renderCandidate(candidate) :
                       this.renderPending()
  }
}

export default GuessContentCell
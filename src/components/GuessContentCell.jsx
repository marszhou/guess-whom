import React from 'react'

class GuessContentCell extends React.Component {
  renderCandidate(candidate) {
    return (<div className='frame'>
        <h2>
          ???“他/她”是谁???
        </h2>
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
            // candidate.chosens.map()
          }
        </div>
      </div>)
  }

  renderPending() {
    return (<div className='frame'><div>pending</div></div>)
  }

  render() {
    let {candidate} = this.props

    return candidate ? this.renderCandidate(candidate) :
                       this.renderPending()
  }
}

export default GuessContentCell
import React from 'react'

class GuessPlayerCell extends React.Component {
  render() {
    let {player} = this.props
    return (
      <div className='player' style={{}}>
        <h4>{player.name}</h4>
        <desc>{player.status}</desc>
        {this.props.isDone ? '✔︎' : ''}
      </div>
    )
  }
}

export default GuessPlayerCell
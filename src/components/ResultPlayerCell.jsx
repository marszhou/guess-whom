import React from 'react'

class ResultPlayerCell extends React.Component {
  render() {
    let {player} = this.props
    console.log(player)
    return (
      <div className='player' style={{}}>
        <h4>{player.name}111</h4>
        <desc>{player.status}</desc>
      </div>
    )
  }
}

export default ResultPlayerCell
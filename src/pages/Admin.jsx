import React from 'react'
import GameStore from 'src/stores/Game'

class AdminPage extends React.Component {
  componentWillMount() {
    this.admin = new GameStore('admin')
  }

  render() {
    return (
      <div>admin</div>
    )
  }
}

export default AdminPage
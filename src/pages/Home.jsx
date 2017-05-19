import React from 'react'
import DatePicker from 'antd/lib/date-picker'
// import Promise from 'bluebird'
const request = require('../utils/Request')
// const io = require('socket.io-client')
const QR = require('jr-qrcode')

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // let socket = io('http://localhost:8080')
    // socket.on('connect', () => {
    //   console.log('connect')
    //   socket.emit('sub', {channelId: 'test'})

    //   socket.on('test', (...args) => console.log(args))
    // })

    // socket.on('disconnect', () => {
    //   console.log('disconnect')
    // })

    // this.socket = socket
    let image = QR.getQrBase64(location.href+'/game')
    console.log(location.href+'game', image)
    this.setState({image: image})
  }

  handleClick = (e) => {
    request.post('/', {body: {name: 'matt'}})
    .then((...rest) => {
      console.log(rest)
    })
  }

  render() {
    return (
      <div>
        <DatePicker/>
        <button onClick={this.handleClick} type='button'>
          click
        </button>
        <img src={this.state.image}/>
      </div>
    )

  }
}

export default Home
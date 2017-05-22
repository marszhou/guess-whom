import React from 'react'

const QR = require('jr-qrcode')

export default () => {
  let qrcode = QR.getQrBase64(location.origin+'/player')
  let style = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 300,
    margin: 'auto',
    width: 256,
    height: 256,
    position: 'absolute',
    textAlign: 'center'
  }
  return (
    <div style={style}>
      <h1>欢迎进入</h1>
      <img src={qrcode} alt="二维码"/>
      <h2>
        请先连接WIFI: CU_q23M<br/>
        Password <br/>
        <span style={{color: 'red'}}>8nre9pde</span>
      </h2>
    </div>
  )
}
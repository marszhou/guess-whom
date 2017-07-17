import React from 'react'

const QR = require('jr-qrcode')

export default () => {
  let qrcode = QR.getQrBase64(location.origin+'/player')
  let style = {
    display: 'flex',
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignItems': 'center',
    'alignContent': 'center'
  }
  return (
    <div style={style}>
      <h2 style={{textAlign: 'center'}}>
        请先连接WIFI: <span style={{color: 'red'}}>CU_q23M</span><br/>
        Password:
        <span style={{color: 'red'}}>8nre9pde</span>
      </h2>

      <div style={{display: 'flex',
                  'justifyContent': 'center',
                  'alignItems': 'center',
                  'alignContent': 'center'}}>
      <img src='/static/assets/WechatIMG635.jpeg' style={{width: 300}}/>
      <img src={qrcode} alt="二维码" style={{width: 381, height: 381}}/>
      </div>

      <h1>扫码进入</h1>
    </div>
  )
}
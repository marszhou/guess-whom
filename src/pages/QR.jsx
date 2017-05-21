import React from 'react'

const QR = require('jr-qrcode')

export default () => {
  let qrcode = QR.getQrBase64(location.origin+'/welcome')

  return (
    <div style={{left:0, top:0, right:0, bottom: 100, margin: 'auto', width: 256, height: 256, position: 'absolute', textAlign: 'center'}}>
      <img src={qrcode}/>
      <h2>
        WIFI Password <br/>
        8nre9pde
      </h2>
    </div>
  )
}
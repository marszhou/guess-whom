import './App.css'
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  // Link
} from 'react-router-dom'
import Home from './pages/Home'
import QR from './pages/QR'
// import UI from './pages/UI'
import Player from './pages/Player'
import Admin from './pages/Admin'

const App = () => {
  return (
    <Router>
      <div className='container-fluid'>

        <Route exact path='/' component={Home}/>
        <Route exact path='/qr' component={QR}/>
        <Route exact path='/player' component={Player}/>
        {
          // <Route exact path='/ui' component={UI}/>
        }
        <Route exact path='/admin' component={Admin}/>
      </div>
    </Router>
  )
}

export default App
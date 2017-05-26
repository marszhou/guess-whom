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
import Game from './pages/Game'

const App = () => {
  return (
    <Router>
      <div className='container-fluid'>
        <div>
          <nav className="navbar navbar-default navbar-fixed-top navbar-inverse">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="#"><div className="emoji">⁉️</div> Guess Whom</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

              </div>
            </div>
          </nav>
          <div className="panel panel-default">
            <div className='panel-body'>
              <Route exact path='/' component={Home}/>
              <Route exact path='/qr' component={QR}/>
              <Route exact path='/player' component={Player}/>
              <Route exact path='/game' component={Game}/>
              <Route exact path='/admin' component={Admin}/>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
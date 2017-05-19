import './App.css'
import 'antd/dist/antd.css'
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Home from './pages/Home'

const App = () => {
  return (
    <Router>
      <div>
        <h1>Guess Whom</h1>
        <Route exact path='/a/b/c' component={Home}/>
      </div>
    </Router>
  )
}

export default App
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()
window.routerHistory = history

const BasicExample = () => {
  let onClick = (e) => {
    console.log(e)
  }
  return (
    <Router history={history}>
      <div>
        <button onClick={onClick}>go</button>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
        </ul>

        <hr/>

        <Route exact={false} path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/topics" component={Topics}/>
      </div>
    </Router>
  )
}

const Home = (router) => {
  window.router = router

  return(
  <div>
    <h2>Home</h2>
    <Sub/>
  </div>
  )
}

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = (router) => {
  console.log(router)
  const { match } = router
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>
            Rendering with React
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>
            Components
          </Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      <Route path={`${match.url}/:topicId`} component={Topic}/>
      <Route exact path={match.url} render={() => (
        <h3>Please select a topic.</h3>
      )}/>
    </div>
  )
}

const Topic = (router) => {
  console.log(router.history === window.router.history, history === router.history)
  const { match } = router
  const onClick = () => {
    router.history.push('/')
  }
  return (
    <div>
      <button onClick={onClick}>go</button>
      <h3>{match.params.topicId}</h3>
    </div>
  )
}

class Sub extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any
  }

  onClick = () => {
    // window.routerHistory.push('/')
    // window.router.history.push('/')
    let history = this.context.router.history
    history.push('/')
  }
  render() {
    return (<div><button onClick={this.onClick}>sub click</button></div>)
  }
}

export default BasicExample
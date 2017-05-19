class User {
  constructor(props) {

  }

  id = null
  name = null
  status = null
  score = 0
  _isOnline = false
  _lastHeartBeat = 0
  answers = []
  guesses = []
}

export default User
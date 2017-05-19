"use strict"

class Round {
  constructor(props) {
    this.candidates = []
    this.isRunning = false
  }

  start(candidates) {
    candidates.forEach(can => {
      can.isUsed = true
    })
    this.candidates = candidates
    this.isRunning = true
  }

  end() {
    this.candidates.forEach(can => {
      can.isFinished = true
    })
    this.isRunning = false
  }
}

module.exports = Round
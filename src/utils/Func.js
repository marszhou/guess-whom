module.exports = {
  uniqId() {
    return Math.random().toString(36).substring(2)
  }
}
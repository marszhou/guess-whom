const SocketIo = require('socket.io-client')

const client = SocketIo("http://"+location.hostname + ":8080" )

export default client
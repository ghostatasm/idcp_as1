const socketIO = require('socket.io');

/**
 * Starts socket.io WebSockets and returns the socket
 * @param {Object} server - Your Express server (returned from .listen
 * @returns The socket object
 */
const start = (server) => {
  const io = socketIO(server);
  const { sockets } = io;

  // Public events
  sockets.on('connect', (socket) => {
    console.log(`CONNECTED: socket ${socket.id}`);

    const newMSG = {
      date: new Date().toLocaleDateString(),
      msg: `CONNECTED: socket ${socket.id}`,
    };
    io.sockets.emit('messageALL', newMSG); // send msg to all sockets

    // Socket events
    socket.on('disconnect', () => {
      console.log(`DISCONNECTED: socket ${socket.id}`);
    });

    socket.on('error', (err) => {
      console.log(`ERROR: socket ${socket.id}, error: ${err}`);
    });

    socket.on('message', (msg) => {
      console.log('MESSAGE:', msg);
      const obj = msg;
      obj.date = new Date().toLocaleTimeString();
      socket.broadcast.emit('message', obj); // broadcast it to everyone else
    });
  });

  return io;
};

module.exports = {
  start,
};

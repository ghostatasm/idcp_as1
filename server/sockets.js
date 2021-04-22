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
    // Individual socket events
    socket.on('error', (err) => {
      console.log(`ERROR: socket ${socket.id} - Error: ${err}`);
    });

    socket.on('account', (accountData) => {
      const { account } = accountData;

      socket.on('joinRoom', (roomData) => {
        const roomID = roomData.id;
        const room = sockets.to(`room:${roomID}`);

        socket.join(`room:${roomID}`);

        room.emit('message', {
          text: `${account.username} has joined the room`,
          date: new Date().toLocaleTimeString(),
          username: 'server',
        });

        // Room events
        socket.on('disconnect', () => {
          room.emit('message', {
            text: `${account.username} has left the room`,
            date: new Date().toLocaleTimeString(),
            username: 'server',
          });
        });

        socket.on('leaveRoom', () => {
          room.emit('message', {
            text: `${account.username} has left the room`,
            date: new Date().toLocaleTimeString(),
            username: 'server',
          });
        });

        socket.on('turn', (turnData) => {
          // TODO
          console.log(turnData);
        });

        socket.on('message', (msg) => {
          const obj = msg;
          obj.date = new Date().toLocaleTimeString();
          obj.username = account.username;
          room.emit('message', obj);
        });

        socket.on('surrender', () => {
          // TODO
        });
      });
    });
  });

  return io;
};

module.exports = start;

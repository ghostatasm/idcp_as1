const socketIO = require('socket.io');

const { Message } = require('./classes');

/**
 * Starts socket.io WebSockets and returns the socket
 * @param {Object} server - Your Express server (returned from .listen
 * @returns The socket io object
 */
const start = (server) => {
  const io = socketIO(server);
  const { sockets } = io;

  // On socket connected
  sockets.on('connect', (socket) => {
    // Individual socket events
    socket.on('error', (err) => {
      console.log(`ERROR: socket ${socket.id} - Error: ${err}`);
    });

    // On account received
    socket.on('account', (accountData) => {
      const { account } = accountData;

      // On socket joined a room
      socket.on('joinRoom', (roomData) => {
        const { _id } = roomData;
        const roomSocketName = `ROOM:${_id}`; // Room string identifier
        const room = sockets.to(roomSocketName); // Room Emitter

        socket.join(roomSocketName);
        socket.emit('joinRoom', roomData);

        room.emit('message', new Message(
          'server',
          `${account.username} has joined the room`,
        ));

        // Room events
        socket.on('disconnect', () => {
          socket.leave(roomSocketName);

          room.emit('message', new Message(
            'server',
            `${account.username} has left the room`,
          ));
        });

        socket.on('leaveRoom', () => {
          socket.leave(roomSocketName);

          room.emit('message', new Message(
            'server',
            `${account.username} has left the room`,
          ));
        });

        // Game Events
        socket.on('turn', (turnData) => {
          room.emit('turn', turnData);
        });

        socket.on('winner', (winnerData) => {
          room.emit('gameover', winnerData);
        });

        // Chat Events
        socket.on('message', (msg) => {
          room.emit('message', new Message(
            account.username,
            msg.text,
          ));
        });
      });
    });
  });

  return io;
};

module.exports = start;

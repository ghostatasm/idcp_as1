const socketIO = require('socket.io');

const { Message } = require('./classes');

// Helper functions
const isPlayerInGame = (account, room) => {
  const isPlayer1 = room.players[0] === account.username;
  const isPlayer2 = room.players[1] === account.username;
  return isPlayer1 || isPlayer2;
};

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
      socket.on('joinRoom', (joinRoomData) => {
        let roomData = joinRoomData.room; // Cache of room state in DB
        const { _id } = roomData; // Immutable ID of room
        const roomName = `GAME_ROOM:${_id}`; // Room string identifier
        const room = sockets.to(roomName); // Room Emitter

        // Join the socket to the room
        socket.join(roomName);

        // If this is a player
        if (isPlayerInGame(account, roomData)) {
          // Let sockets in room know about changes to room in DB
          roomData = joinRoomData.room;
          room.emit('updateRoom', {
            room: joinRoomData.room,
          });


          // Let sockets in room know a player joined
          room.emit('playerJoined', {
            player: account,
            room: joinRoomData.room,
          });

          // Emit a join message to the chat
          room.emit('message', new Message(
            'server',
            `${account.username} has joined the room`,
          ));

          // Player is in Room Events
          socket.on('disconnect', () => {
            room.emit('message', new Message(
              'server',
              `${account.username} has disconnected from the room`,
            ));
          });

          socket.on('leaveRoom', (leaveRoomData) => {
            // Leave the socket from the room
            socket.leave(roomName);

            // Let sockets in room know about changes to room in DB
            roomData = leaveRoomData.room;
            room.emit('updateRoom', {
              room: leaveRoomData.room,
            });

            // Let sockets in room know a player left the room
            room.emit('playerLeft', {
              player: account,
              room: leaveRoomData,
            });

            // Emit a leave message to the chat
            room.emit('message', new Message(
              'server',
              `${account.username} has left the room`,
            ));

            // Check if there was a winner
            if (roomData.winner !== '') {
              // If so, emit a game over
              socket.emit('gameover', {
                winner: roomData.winner,
              });

              room.emit('message', new Message(
                'server',
                `${roomData.winner} wins the game!`,
              ));
            }
          });

          // Game Events
          socket.on('turn', (turnData) => {
            // Let sockets in room know about changes to room in DB
            roomData = turnData.room;
            room.emit('updateRoom', {
              room: turnData.room,
            });

            room.emit('turn', {
              player: account,
              room: turnData,
            });

            // Check if there was a winner
            if (roomData.winner !== '') {
              // If so, emit a game over
              socket.emit('gameover', {
                winner: roomData.winner,
              });

              room.emit('message', new Message(
                'server',
                `${roomData.winner} wins the game!`,
              ));
            }
          });

          socket.on('surrender', (surrenderData) => {
            // Let sockets in room know about changes to room in DB
            roomData = surrenderData.room;
            room.emit('updateRoom', {
              room: surrenderData.room,
            });

            // Check if there was a winner
            if (roomData.winner !== '') {
              // If so, emit a game over
              socket.emit('gameover', {
                winner: roomData.winner,
              });

              room.emit('message', new Message(
                'server',
                `${roomData.winner} wins the game!`,
              ));
            }
          });

          // Chat Events
          socket.on('message', (msg) => {
            room.emit('message', new Message(
              account.username,
              msg.text,
            ));
          });
        } else {
          // This is a spectator
          const spectatorRoomName = `GAME_ROOM:SPECTATORS:${_id}`; // Spectator room identifier
          const spectatorRoom = sockets.to(spectatorRoomName);

          // Join spectator room
          socket.join(spectatorRoomName);

          spectatorRoom.emit('message', new Message(
            'server',
            `${account.username} has joined the room as a spectator`,
          ));

          socket.on('leaveRoom', () => {
            // Leave the socket from the room
            socket.leave(spectatorRoomName);

            // Emit a leave message to the chat
            spectatorRoom.emit('message', new Message(
              'server',
              `spectator ${account.username} has left the room`,
            ));
          });

          // Chat Events
          socket.on('message', (msg) => {
            spectatorRoom.emit('message', new Message(
              account.username,
              msg.text,
            ));
          });
        }
      });
    });
  });

  return io;
};

module.exports = start;

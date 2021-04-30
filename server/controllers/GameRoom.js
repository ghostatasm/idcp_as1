const { GameRoom } = require('../models');
const { Response } = require('../classes');

const { GameRoomModel /* GAMEROOM_STATE */ } = GameRoom;

// Helper functions
// const takeTurn = (doc, req, res) => {
//   const { utttCell, tttCell } = req.body;

//   // Check that it is actually within the board
//   if (utttCell < 0 || utttCell > 8) {
//     return res.status(400).json({ error: 'utttCell out of range [0-8]' });
//   }
//   if (tttCell < 0 || tttCell > 8) {
//     return res.status(400).json({ error: 'tttCell out of range [0-8]' });
//   }

//   // This turn must be in the outer cell in the same position
//   // as the inner cell that was played last turn
//   if (doc.prevTurn.length > 0 && utttCell !== doc.prevTurn[1]) {
//     return res.status(400).json({ error: 'This cell is not available to play this turn' });
//   }

//   GameRoomModel.takeTurn(doc, utttCell, tttCell);

//   return doc.save((saveErr) => {
//     if (saveErr) {
//       console.log(saveErr);

//       return res.status(500).json({ error: 'An error ocurred trying to take this turn' });
//     }

//     return res.json({
//       message: 'Turn taken',
//       type: 'TURN_SUCCESS',
//       board: doc.board,
//     });
//   });
// };

// Exported functions
const rooms = (req, res) => GameRoomModel.find({}, (findErr, doc) => {
  if (findErr) {
    console.log(findErr);
    return res.status(500).json({ error: 'An error ocurred retrieving the rooms' });
  }

  if (!doc) {
    return res.status(400).json({ error: 'No rooms found' });
  }

  return res.json({
    message: 'Rooms obtained successfully',
    type: 'ROOM_LIST',
    rooms: doc,
  });
});

const create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Room name is undefined in request body' });
  }

  const newRoom = new GameRoomModel({
    name: req.body.name,
    creator: req.session.account.username,
  });

  return newRoom.save((err) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error ocurred creating the room' });
    }

    return res.json({
      message: 'Room created successfully',
      type: 'ROOM_CREATE',
      room: newRoom,
    });
  });
};

const join = (req, res) => {
  // Check that all parameters are sent in request
  if (!req.body.id) {
    return res.status(400).json({ error: 'Room ID is undefined in request body' });
  }

  // Join room
  return GameRoomModel.join(req.body.id, req.session.account.username, {
    // Find callback
    find: (findErr, doc) => {
      if (findErr) {
        console.log(findErr);
        return res.status(500).json({ error: 'An error ocurred retrieving the room' });
      }

      if (!doc) {
        return res.status(400).json({ error: 'No room found with the ID specified' });
      }

      return doc;
    },
    // Save callback
    save: (saveErr, doc) => {
      if (saveErr) {
        console.log(saveErr);

        return res.status(500).json({ error: 'An error ocurred trying to join the room' });
      }

      // Set session room cookie
      req.session.room = doc;

      // Return server response
      return res.json(new Response('ROOM_JOIN', 'Room joined successfully',
        {
          room: doc,
        }));
    },
  });
};

const leave = (req, res) => {
  if (!req.session.room) {
    return res.status(400).json({ error: 'Room is undefined in request session' });
  }

  return GameRoomModel.leave(req.session.room._id, req.session.account.username, {
    // Find callback
    find: (findErr, doc) => {
      if (findErr) {
        console.log(findErr);
        return res.status(500).json({ error: 'An error ocurred retrieving the room' });
      }

      if (!doc) {
        return res.status(400).json({ error: 'No room found with the ID specified' });
      }

      return doc;
    },
    // Delete callback
    delete: (deleteErr, doc) => {
      if (deleteErr) {
        console.log(deleteErr);

        return res.status(500).json({ error: 'An error ocurred trying to leave the room' });
      }

      // Return server response
      return res.json(new Response('ROOM_LEAVE', 'Room left successfully',
        {
          room: doc,
        }));
    },
    // Save callback
    save: (saveErr, doc) => {
      if (saveErr) {
        console.log(saveErr);

        return res.status(500).json({ error: 'An error ocurred trying to leave the room' });
      }

      // Clear session room cookie
      req.session.room = null;

      // Return server response
      return res.json(new Response('ROOM_LEAVE', 'Room left successfully',
        {
          room: doc,
        }));
    },
  });
};


const turn = (req, res) => {
  // Board indexes
  // 0|1|2
  // -----
  // 3|4|5
  // -----
  // 6|7|8

  if (!req.body.utttCell) {
    return res.status(400).json({ error: 'utttCell is undefined in request body' });
  }

  if (!req.body.tttCell) {
    return res.status(400).json({ error: 'tttCell is undefined in request body' });
  }

  if (!req.session.room) {
    return res.status(400).json({ error: 'room is undefined in request session' });
  }

  return GameRoomModel.turn(req.session.room._id, req.session.account.username,
    [
      req.body.utttCell,
      req.body.tttCell,
    ],
    {
      // Find callback
      find: (findErr, doc) => {
        if (findErr) {
          console.log(findErr);
          return res.status(500).json({ error: 'An error ocurred retrieving the room' });
        }

        if (!doc) {
          return res.status(400).json({ error: 'No room found with the ID specified' });
        }

        return doc;
      },
      // Delete callback
      delete: (deleteErr) => {
        if (deleteErr) {
          console.log(deleteErr);

          return res.status(500).json({ error: 'An error ocurred trying delete the finished game' });
        }

        // Return server response
        return res.json(new Response('ROOM_DELETE', 'Room deleted successfully'));
      },
      // Save callback
      save: (saveErr, doc) => {
        if (saveErr) {
          console.log(saveErr);

          return res.status(500).json({ error: 'An error ocurred trying to save the turn' });
        }

        // Clear session room cookie
        req.session.room = null;

        // Return server response
        return res.json(new Response('TURN_TAKEN', 'Turn taken successfully',
          {
            board: doc.board,
          }));
      },
      // Turn error callback
      turn: (turnError) => res.status(400).json({ error: turnError }),
    });
};


module.exports = {
  rooms,
  create,
  join,
  leave,
  turn,
};

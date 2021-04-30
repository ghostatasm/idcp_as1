const mongoose = require('mongoose');

let GameRoomModel = {};

const GAMEROOM_STATE = {
  WAITING: 'Waiting',
  PLAYING: 'Playing',
  FINISHED: 'Finished',
};

// Helper functions

// Returns whether conditions have been met for server to delete the room
const isReadyForDelete = (room) => room.state === GAMEROOM_STATE.FINISHED; // Game finished
//  && !room.players[0] && !room.players[1] // Players left
//  && room.spectators.size <= 0; // Spectators left

// Sets room state to FINISHED
// Sets winner property
// And updates account stats
// (Winner should be a username or 'TIE')
const gameOver = (room, winner, deleteCallback) => {
  const roomEdits = room;

  // Edit room
  roomEdits.state = GAMEROOM_STATE.FINISHED;
  roomEdits.winner = winner;

  // Update Account stats
  // TODO

  // Delete room from database
  return GameRoomModel.deleteOneByID(room._id, deleteCallback);
};

// Returns symbol that won
// Returns 'TIE' if there is a tie
// Returns ' ' if no winner or tie yet
const getTTTWinner = (tttBoard) => {
  // Horizontal Top
  if (tttBoard[0] === tttBoard[1] && tttBoard[1] === tttBoard[2]) return tttBoard[0];
  // Horizontal Middle
  if (tttBoard[3] === tttBoard[4] && tttBoard[4] === tttBoard[5]) return tttBoard[3];
  // Horizontal Bottom
  if (tttBoard[6] === tttBoard[7] && tttBoard[7] === tttBoard[8]) return tttBoard[6];
  // Vertical Left
  if (tttBoard[0] === tttBoard[3] && tttBoard[3] === tttBoard[6]) return tttBoard[0];
  // Vertical Middle
  if (tttBoard[1] === tttBoard[4] && tttBoard[4] === tttBoard[7]) return tttBoard[1];
  // Vertical Right
  if (tttBoard[2] === tttBoard[5] && tttBoard[5] === tttBoard[8]) return tttBoard[2];
  // Diagonals
  if (tttBoard[0] === tttBoard[4] && tttBoard[4] === tttBoard[8]) return tttBoard[0];
  if (tttBoard[2] === tttBoard[4] && tttBoard[4] === tttBoard[6]) return tttBoard[2];

  // Check tie
  for (let i = 0; i < tttBoard.length; i++) {
    // If there is any empty cell, there is no winner or tie yet
    if (tttBoard[i] === ' ') {
      return ' ';
    }
  }

  // No empty cell found and no winner, tie
  return 'TIE';
};

const GameRoomSchema = new mongoose.Schema({
  // Required
  name: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: String,
    required: true,
  },
  // Defaults
  players: {
    // Array of players in the game
    // (contains players usernames)
    type: Array,
    default: new Array(2),
  },
  state: {
    // State of the game
    type: String,
    default: GAMEROOM_STATE.WAITING,
  },
  winner: {
    // Winner of the game
    type: String,
    default: '',
  },
  turn: {
    // Turn counter
    type: Number,
    default: 0,
  },
  nextPlayer: {
    // Next person that has to play
    type: Boolean,
    default: Math.random() > 0.5, // 0 == players[0], 1 == players[1]
  },
  lastTurn: {
    // Previous turn/move
    // [utttCell, tttCell]
    type: Array,
    default: new Array(2),
  },
  board: {
    // UTTT Board
    type: Array,
    default: new Array(9).fill(new Array(9).fill(' ')),
  },
  localWins: {
    // Array with winner of each local TTT game
    type: Array,
    default: new Array(9).fill(' '),
  },
  spectators: {
    // Hashmap of spectators
    type: Map,
    default: new Map(),
  },
  date: {
    // Creation date
    type: Date,
    default: Date.now,
  },
});

GameRoomSchema.statics.findOneByID = async (id, callback) => {
  const search = {
    _id: id,
  };

  return GameRoomModel.findOne(search, callback);
};

GameRoomSchema.statics.deleteOneByID = async (id, callback) => {
  const search = {
    _id: id,
  };

  return GameRoomModel.deleteOne(search, callback);
};

GameRoomSchema.statics.join = async (id, username, callbacks) => {
  const findResults = await GameRoomModel.findOneByID(id, callbacks.find);

  // If error finding the room or no room found, return early with error
  if (findResults.error) {
    console.log(findResults.error);
    return findResults;
  }

  // Edit room
  const doc = findResults;


  if (doc.state === GAMEROOM_STATE.WAITING) {
    if (!doc.players[0]) {
      // Join as player 1
      doc.players[0] = username;
      doc.markModified('players');
    } else if (!doc.players[1]) {
      // Join as player 2
      doc.players[1] = username;
      doc.markModified('players');
      // Start the game
      doc.state = GAMEROOM_STATE.PLAYING;
    }
  } else {
    // Join as a spectator
    doc.spectators.set(username, username);
  }

  // Save room in database
  return doc.save(callbacks.save);
};

GameRoomSchema.statics.leave = async (id, username, callbacks) => {
  const findResults = await GameRoomModel.findOneByID(id, callbacks.find);

  // If error finding the room or no room found, return early with error
  if (findResults.error) {
    console.log(findResults.error);
    return findResults;
  }

  // Edit room
  const doc = findResults;

  if (doc.spectators.has(username)) {
    // If in the spectators, leave
    doc.spectators.delete(username);
  }

  if (username === doc.players[0] && username === doc.players[1]) {
    // If the player is playing against itself
    doc.state = GAMEROOM_STATE.FINISHED;
  } else if (username === doc.players[0]) {
    // If this is player 1

    if (doc.state === GAMEROOM_STATE.PLAYING) {
      // If the player leaves while the game is ongoing,
      // Declare player 2 the winner and finish the game
      return gameOver(doc, doc.players[1], callbacks.delete);
    }

    // Leave
    doc.players[0] = null;
    doc.markModified('players');
  } else if (username === doc.players[1]) {
    // If this is player 2

    if (doc.state === GAMEROOM_STATE.PLAYING) {
      // If the player leaves while the game is ongoing,
      // Declare player 1 the winner and finish the game
      return gameOver(doc, doc.players[0]);
    }

    // Leave
    doc.players[1] = null;
  }

  if (isReadyForDelete(doc)) {
    // Delete room from database
    return GameRoomModel.deleteOneByID(id, callbacks.delete);
  }

  // Save room in database
  return doc.save(callbacks.save);
};

GameRoomSchema.statics.turn = async (id, username, turn, callbacks) => {
  const findResults = await GameRoomModel.findOneByID(id, callbacks.find);

  // If error finding the room or no room found, return early with error
  if (findResults.error) {
    console.log(findResults.error);
    return findResults;
  }

  const doc = findResults;

  // Check that the game has started
  if (doc.state === GAMEROOM_STATE.PLAYING) {
    // JS Typecasting wizardry (new Number(false) === 0, new Number(true) === 1)
    if (username === doc.players[+doc.nextPlayer]) {
      // If this is the right player
      const [utttCell, tttCell] = turn;

      // Make sure indexes do not cause indexOutOfRange exceptions
      if (utttCell >= 0 && utttCell <= 8 && tttCell >= 0 && tttCell <= 8) {
        // If this is the first move do it,
        // If not, check that it was played in the right UTTT cell
        if (!doc.lastTurn[0] || doc.lastTurn[1] === utttCell) {
          doc.turn++; // Increase turn counter

          // Update board
          doc.board[utttCell][tttCell] = doc.turn % 2 === 0 ? 'O' : 'X';
          doc.markModified('board');
          // Update local wins at UTTT cell played
          doc.localWins[utttCell] = getTTTWinner(doc.board[utttCell]);
          doc.markModified('localWins');

          // Check global win of UTTT board
          const winner = getTTTWinner(doc.localWins);
          if (winner === ' ') {
            // Game isn't over yet
            doc.nextPlayer = !doc.nextPlayer; // Toggle next player
            doc.lastTurn = [utttCell, tttCell]; // Save move as the last one
            doc.markModified('lastTurn');

            // Save changes
            return doc.save(callbacks.save);
          }
          // There was a winner/tie
          return gameOver(doc, winner, callbacks.delete);
        }
        else {
          return callbacks.turn('Must play in the correct cell');
        }
      } else {
        return callbacks.turn('Cell index out of range');
      }
    } else {
      return callbacks.turn('It is not your turn');
    }
  } else {
    return callbacks.turn('The game has not started');
  }

  return callbacks.turn('Bad turn request');
};

GameRoomModel = mongoose.model('GameRoom', GameRoomSchema);

module.exports = {
  GameRoomModel,
  GameRoomSchema,
  GAMEROOM_STATE,
};

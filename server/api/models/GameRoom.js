// Dependencies
const mongoose = require('mongoose');
const { AccountModel } = require('./Account.js');

// Classes
const { Error } = require('../classes');

// Enums
const GAMEROOM_STATE = {
  WAITING: 'Waiting',
  PLAYING: 'Playing',
  FINISHED: 'Finished',
};

// Forward declare model
let GameRoomModel = {};

// Helper functions

// Sets room state to FINISHED
// Sets winner property
// And updates account stats
// (Winner should be a username or 'TIE')
const gameOver = (room, winner) => {
  const roomEdits = room;

  // Edit room
  roomEdits.state = GAMEROOM_STATE.FINISHED;
  roomEdits.winner = winner;

  // Update Account stats
  AccountModel.findOneByUsername(room.players[0], (findErr, doc) => {
    const docEdits = doc;

    if (!findErr && docEdits) {
      docEdits.gamesPlayed++;

      if (winner === 'TIE') {
        docEdits.gamesTied++;
      } else if (docEdits.username === winner) {
        docEdits.gamesWon++;
      } else {
        docEdits.gamesLost++;
      }
    } else {
      if (findErr) {
        console.log(findErr);
      }
      if (!docEdits) {
        console.log('Could not find account of player 1');
      }
    }

    docEdits.save().catch((err) => {
      console.log(err);
    });
  });

  AccountModel.findOneByUsername(room.players[1], (findErr, doc) => {
    const docEdits = doc;

    if (!findErr && docEdits) {
      docEdits.gamesPlayed++;

      if (winner === 'TIE') {
        docEdits.gamesTied++;
      } else if (docEdits.username === winner) {
        docEdits.gamesWon++;
      } else {
        docEdits.gamesLost++;
      }
    } else {
      if (findErr) {
        console.log(findErr);
      }
      if (!docEdits) {
        console.log('Could not find account of player 2');
      }
    }

    docEdits.save().catch((err) => {
      console.log(err);
    });
  });
};

/**
 * Returns whether the string provided is a special symbol
 * used in TTT winner checks
 * @param {String} winner - Winner result in question
 * @returns
 */
const isSpecialSymbol = (winner) => winner === ' ' || winner === '' || winner === 'TIE';

// Returns symbol that won
// Returns 'TIE' if there is a tie
// Returns ' ' if no winner or tie yet
const getTTTWinner = (tttBoard) => {
  let i; // Index of check

  // Horizontal Top
  i = tttBoard[0] === tttBoard[1] && tttBoard[1] === tttBoard[2] && !isSpecialSymbol(tttBoard[0]);
  if (i) return tttBoard[0];
  // Horizontal Middle
  i = tttBoard[3] === tttBoard[4] && tttBoard[4] === tttBoard[5] && !isSpecialSymbol(tttBoard[3]);
  if (i) return tttBoard[3];
  // Horizontal Bottom
  i = tttBoard[6] === tttBoard[7] && tttBoard[7] === tttBoard[8] && !isSpecialSymbol(tttBoard[6]);
  if (i) return tttBoard[6];
  // Vertical Left
  i = tttBoard[0] === tttBoard[3] && tttBoard[3] === tttBoard[6] && !isSpecialSymbol(tttBoard[0]);
  if (i) return tttBoard[0];
  // Vertical Middle
  i = tttBoard[1] === tttBoard[4] && tttBoard[4] === tttBoard[7] && !isSpecialSymbol(tttBoard[1]);
  if (i) return tttBoard[1];
  // Vertical Right
  i = tttBoard[2] === tttBoard[5] && tttBoard[5] === tttBoard[8] && !isSpecialSymbol(tttBoard[2]);
  if (i) return tttBoard[2];
  // Diagonals
  i = tttBoard[0] === tttBoard[4] && tttBoard[4] === tttBoard[8] && !isSpecialSymbol(tttBoard[0]);
  if (i) return tttBoard[0];
  i = tttBoard[2] === tttBoard[4] && tttBoard[4] === tttBoard[6] && !isSpecialSymbol(tttBoard[2]);
  if (i) return tttBoard[2];

  // Check tie
  for (let j = 0; j < tttBoard.length; j++) {
    // If there is any empty cell, there is no winner or tie yet
    if (tttBoard[j] === ' ' || tttBoard[j] === '') {
      return ' ';
    }
  }

  // No empty cell found and no winner, tie
  return 'TIE';
};

// Returns symbol that won in full UTTT board
// Returns TIE if there is a tie
// Returns ' ' if no winner or tie yet
const getUTTTWinner = (utttBoard) => {
  // Array that contains wins of every TTT board
  const localWins = new Array(9).fill(' ');
  // Fill localWins array
  for (let i = 0; i < localWins.length; i++) {
    localWins[i] = getTTTWinner(utttBoard[i]);
  }

  // Return the winner of the larger game
  return getTTTWinner(localWins);
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

GameRoomSchema.statics.findOneByID = (id) => {
  const search = {
    _id: id,
  };

  return GameRoomModel.findOne(search).catch((err) => {
    console.log(err);
    throw new Error(500, 'An error ocurred trying to find the room');
  });
};

GameRoomSchema.statics.deleteOneByID = (id) => {
  const search = {
    _id: id,
  };

  return GameRoomModel.deleteOne(search).catch((err) => {
    console.log(err);
    throw new Error(500, 'An error ocurred trying to delete the room');
  });
};

/**
 * Creates a room in the database
 * @param {String} roomName - Name of the room to create
 * @param {String} username - Username of creator account
 */
GameRoomSchema.statics.createOne = (roomName, username) => {
  const newRoom = new GameRoomModel({
    name: roomName,
    creator: username,
  });

  return newRoom.save().catch((err) => {
    console.log(err);
    throw new Error(500, 'An error ocurred trying to create the room');
  });
};

GameRoomSchema.statics.join = async (id, username) => {
  // Find room
  const doc = await GameRoomModel.findOneByID(id).catch((err) => {
    console.log(err);
    throw err;
  });

  if (!doc) {
    throw new Error(404, 'No room found with the ID specified');
  }

  // Edit room
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

  // Save changes to room in database
  return doc.save().catch((err) => {
    console.log(err);
    throw new Error(500, 'An error ocurred trying to join the room');
  });
};

GameRoomSchema.statics.leave = async (id, username) => {
  // Find room
  const doc = await GameRoomModel.findOneByID(id).catch((err) => {
    console.log(err);
    throw err;
  });

  if (!doc) {
    throw new Error(404, 'No room found with the ID specified');
  }

  // Edit room
  if (doc.spectators.has(username)) {
    // If in the spectators, leave
    doc.spectators.delete(username);
  }

  if (username === doc.players[0] && username === doc.players[1]) {
    doc.players[0] = null;
    doc.players[1] = null;
    doc.markModified('players');

    // If the player is playing against itself, finish game with no winner
    doc.state = GAMEROOM_STATE.FINISHED;
  } else {
    // Player 1 and 2 are different

    // If this is player 1
    if (username === doc.players[0]) {
      // If player 1 left while the game is ongoing
      if (doc.state === GAMEROOM_STATE.PLAYING) {
        // Declare player 2 the winner
        gameOver(doc, doc.players[1]);
      }

      // Leave player 1
      doc.players[0] = null;
      doc.markModified('players');
    }
    // If this is player 2
    if (username === doc.players[1]) {
      // If player 2 left while the game is ongoing
      if (doc.state === GAMEROOM_STATE.PLAYING) {
        // Declare player 1 the winner
        gameOver(doc, doc.players[0]);
      }

      // Leave player 2
      doc.players[1] = null;
      doc.markModified('players');
    }
  }

  // Save changes to room in database
  const editedDoc = await doc.save().catch((err) => {
    console.log(err);
    throw new Error(500, 'An error ocurred trying to leave the room');
  });

  // If there are no players left in the room
  if (!doc.players[0] && !doc.players[1]) {
    // Delete room from database
    GameRoomModel.deleteOneByID(doc._id).catch((err) => {
      console.log(err);
    });
  }

  // If any player leaves and the game is finished
  if (doc.state === GAMEROOM_STATE.FINISHED) {
    // Delete room from database
    GameRoomModel.deleteOneByID(doc._id).catch((err) => {
      console.log(err);
    });
  }

  // Return edited room
  return editedDoc;
};

GameRoomSchema.statics.turn = async (id, username, turn) => {
  // Find room
  const doc = await GameRoomModel.findOneByID(id).catch((err) => {
    console.log(err);
    throw err;
  });

  if (!doc) {
    throw new Error(404, 'No room found with the ID specified');
  }

  // Edit room

  // Check that the user is a player
  if (username === doc.players[0] || username === doc.players[1]) {
    // Check that the game has started
    if (doc.state === GAMEROOM_STATE.PLAYING) {
      // JS Typecasting wizardry (new Number(false) === 0, new Number(true) === 1)
      if (username === doc.players[+doc.nextPlayer]) {
        // If this is the right player
        const [utttCell, tttCell] = turn;

        // Make sure indexes do not cause indexOutOfRange exceptions
        if (utttCell >= 0 && utttCell <= 8 && tttCell >= 0 && tttCell <= 8) {
          // If this is the first move
          // Or the previous move points to a cell already won
          // Do it.
          // Otherwise, check that it was played in the right UTTT cell
          if (doc.turn <= 0 || getTTTWinner(doc.board[doc.lastTurn[1]]) !== ' ' || doc.lastTurn[1] === utttCell) {
            // Check that this cell that has not been won yet
            if (getTTTWinner(doc.board[utttCell]) === ' ') {
              // Check that this cell has not been played in already
              if (doc.board[utttCell][tttCell] === ' ') {
                doc.turn++; // Increase turn counter

                // Update board
                doc.board[utttCell][tttCell] = doc.turn % 2 === 0 ? 'O' : 'X';
                doc.markModified('board');

                // Check winner
                const winner = getUTTTWinner(doc.board);
                if (winner === ' ') {
                  // Game isn't over yet
                  doc.nextPlayer = !doc.nextPlayer; // Toggle next player
                  doc.lastTurn = [utttCell, tttCell]; // Save move as the last one
                  doc.markModified('lastTurn');
                }

                // There was a winner/tie
                if (winner !== ' ' && winner !== 'TIE') {
                  // The player that was going next is the winner
                  gameOver(doc, doc.players[+doc.nextPlayer]);
                }

                // Save changes to room in database
                const editedDoc = await doc.save().catch((err) => {
                  console.log(err);
                  throw new Error(400, 'An error ocurred trying to save your turn');
                });

                // There was a winner/tie
                if (winner !== ' ' && winner !== 'TIE') {
                  // Delete room from database
                  GameRoomModel.deleteOneByID(doc._id).catch((err) => {
                    console.log(err);
                  });
                }

                // Return edited room
                return editedDoc;
              }
              throw new Error(400, 'Cell is not empty');
            }
            throw new Error(400, 'Cell finished already');
          }
          throw new Error(400, 'Must play in the correct cell');
        }
        throw new Error(400, 'Cell index out of range');
      }
      throw new Error(400, 'It is not your turn');
    }
    throw new Error(400, 'The game has not yet started');
  }
  throw new Error(400, 'You are not a player in this game');
};

GameRoomSchema.statics.surrender = async (id, username) => {
  // Find room
  const doc = await GameRoomModel.findOneByID(id).catch((err) => {
    console.log(err);
    throw err;
  });

  if (!doc) {
    throw new Error(404, 'No room found with the ID specified');
  }

  // Edit room
  if (username === doc.players[0] && username === doc.players[1]) {
    // If player is playing against itself just finish the game
    doc.state = GAMEROOM_STATE.FINISHED;
  } else if (doc.state === GAMEROOM_STATE.PLAYING) {
    // If this is player 1
    if (username === doc.players[0]) {
      // Declare player 2 the winner
      gameOver(doc, doc.players[1]);
    } else if (username === doc.players[1]) {
      // If this is player 2
      // Declare player 1 the winner
      gameOver(doc, doc.players[0]);
    } else {
      throw new Error(400, 'You are not a player in this game');
    }
  } else {
    throw new Error(400, 'The game has not yet started, you cannot surrender');
  }

  // Save changes to room in database
  return doc.save().catch((err) => {
    console.log(err);
    throw new Error(500, 'An error ocurred trying to surrender');
  });
};

GameRoomModel = mongoose.model('GameRoom', GameRoomSchema);

module.exports = {
  GameRoomModel,
  GameRoomSchema,
  GAMEROOM_STATE,
};

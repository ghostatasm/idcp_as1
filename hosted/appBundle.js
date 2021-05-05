"use strict";

var socket; // Client connection socket
// Init

var init = function init() {
  // Connect to the base URL
  socket = io(window.location.origin); // DOM Events

  var accountButton = document.querySelector("#accountButton");
  accountButton.addEventListener('click', function (e) {
    e.preventDefault();
    createAccountWindow();
  });
  var gamesButton = document.querySelector("#gamesButton");
  gamesButton.addEventListener('click', function (e) {
    e.preventDefault();
    createGameList(); // Check if the player is in a game

    sendRequest('GET', 'room', null, function (response) {
      // If there is a game in session show it
      if (response && response.board) {
        socket.emit('joinRoom', response);
        createGame(response.board);
      }
    });
  }); // Default View

  createGameList(); // Get session information

  sendRequest('GET', '/account', "_csrf=".concat(csrf), function (account) {
    socket.emit('account', {
      account: account
    }); // Check if the player is in a game

    sendRequest('GET', '/room', null, function (response) {
      // If there is a game in session show it
      if (response && response.board) {
        socket.emit('joinRoom', response);
        createGame(response.board);
      }
    });
  });
};
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Helper functions
var isPlayersTurn = function isPlayersTurn(account, room) {
  return room.players[+room.nextPlayer] === account.username;
}; // Returns index of cell to highlight
// -1 means all should be highlighted
// Anything except 0-8 means none highlighted


var getCellToHighlight = function getCellToHighlight(room) {
  if (room.turn <= 0 || getTTTWinner(room.board[room.lastTurn[1]]) !== ' ') {
    return -1;
  } else {
    return room.lastTurn[1];
  }
}; // React Components


var AccountWindow = function AccountWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "accountWindow"
  }, /*#__PURE__*/React.createElement("h1", null, "Account"), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username:"), /*#__PURE__*/React.createElement("p", {
    className: "username"
  }, props.account.username), /*#__PURE__*/React.createElement("label", {
    htmlFor: "gamesPlayed"
  }, "Games Played:"), /*#__PURE__*/React.createElement("p", {
    className: "gamesPlayed"
  }, props.account.gamesPlayed), /*#__PURE__*/React.createElement("label", {
    htmlFor: "wonLost"
  }, "Won/Tied/Lost:"), /*#__PURE__*/React.createElement("p", {
    className: "wonLost"
  }, props.account.gamesWon, "/", props.account.gamesTied, "/", props.account.gamesLost)));
};

var GameList = function GameList(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gameList"
  }, /*#__PURE__*/React.createElement("h1", null, "Games"), /*#__PURE__*/React.createElement("form", {
    action: "/create",
    method: "post",
    onSubmit: handleCreate,
    id: "createForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Room Name:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "name",
    id: "roomName"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Create Room"
  })), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Room Name"), /*#__PURE__*/React.createElement("th", null, "Creator"), /*#__PURE__*/React.createElement("th", null, "State"), /*#__PURE__*/React.createElement("th", null, "Turn"), /*#__PURE__*/React.createElement("th", null, "Join"))), /*#__PURE__*/React.createElement("tbody", null, props.rooms.map(function (room) {
    return /*#__PURE__*/React.createElement("tr", {
      key: room._id
    }, /*#__PURE__*/React.createElement("th", null, room.name), /*#__PURE__*/React.createElement("th", null, room.creator), /*#__PURE__*/React.createElement("th", null, room.state), /*#__PURE__*/React.createElement("th", null, room.turn), /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("button", {
      className: "btnJoin",
      onClick: function onClick(e) {
        return handleJoin(e, room._id);
      }
    }, "Join")));
  }))));
};

var TTTGrid = function TTTGrid(props) {
  var _React$useState = React.useState('tttGrid'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      classes = _React$useState2[0],
      setClasses = _React$useState2[1];

  socket.on('joinRoom', function (room) {
    var index = +getCellToHighlight(room);

    if (index === -1 || index === props.utttcell) {
      setClasses('tttGrid highlight');
    } else {
      setClasses('tttGrid');
    }
  });
  socket.on('turn', function (response) {
    var index = +getCellToHighlight(response);

    if (index === -1 || index === props.utttcell) {
      setClasses(classes + ' highlight');
    } else {
      setClasses('tttGrid');
    }
  });
  return /*#__PURE__*/React.createElement("table", {
    className: classes
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 0);
    }
  }, props.board[0])), /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 1);
    }
  }, props.board[1])), /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 2);
    }
  }, props.board[2]))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 3);
    }
  }, props.board[3])), /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 4);
    }
  }, props.board[4])), /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 5);
    }
  }, props.board[5]))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 6);
    }
  }, props.board[6])), /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 7);
    }
  }, props.board[7])), /*#__PURE__*/React.createElement("th", {
    className: "tttCell"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick(e) {
      return handleTurn(e, props.utttcell, 8);
    }
  }, props.board[8])))));
};

var UTTTGrid = function UTTTGrid(props) {
  var _React$useState3 = React.useState(props.board),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      board = _React$useState4[0],
      setBoard = _React$useState4[1]; // Listen for board updates


  socket.on('turn', function (response) {
    // Update board
    setBoard(response.board);
  });
  return /*#__PURE__*/React.createElement("table", {
    className: "utttGrid"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 0,
    board: board[0]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 1,
    board: board[1]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 2,
    board: board[2]
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 3,
    board: board[3]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 4,
    board: board[4]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 5,
    board: board[5]
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 6,
    board: board[6]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 7,
    board: board[7]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 8,
    board: board[8]
  })))));
};

var Chat = function Chat(props) {
  var _React$useState5 = React.useState(props.messages ? props.messages : []),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      messages = _React$useState6[0],
      setMessages = _React$useState6[1];

  socket.on('message', function (response) {
    setMessages([].concat(_toConsumableArray(messages), [response]));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "chat"
  }, /*#__PURE__*/React.createElement("ul", null, messages.map(function (msg) {
    return /*#__PURE__*/React.createElement("li", {
      key: msg.id
    }, /*#__PURE__*/React.createElement("b", null, msg.username), ": ", msg.text);
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "message",
    id: "textMessage",
    onKeyPress: handleKeypressSend
  }), /*#__PURE__*/React.createElement("button", {
    id: "btnSendMessage",
    onClick: handleSend
  }, "Send"));
};

var TurnLabel = function TurnLabel(props) {
  var _React$useState7 = React.useState(''),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      turnText = _React$useState8[0],
      setTurnText = _React$useState8[1]; // Init visibility


  socket.on('joinRoom', function (room) {
    sendRequest('GET', '/account', null, function (account) {
      if (isPlayersTurn(account, room)) {
        setTurnText('It is your turn!');
      } else {
        setTurnText('Wait for your opponent to play');
      }
    });
  }); // Every turn, check if it is the player's turn and update text

  socket.on('turn', function (room) {
    sendRequest('GET', '/account', null, function (account) {
      if (isPlayersTurn(account, room)) {
        setTurnText('It is your turn!');
      } else {
        setTurnText('Wait for your opponent to play');
      }
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "turnLabel"
  }, /*#__PURE__*/React.createElement("p", null, turnText));
};

var Game = function Game(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "game"
  }, /*#__PURE__*/React.createElement("h1", null, "Game"), /*#__PURE__*/React.createElement("div", {
    className: "board"
  }, /*#__PURE__*/React.createElement(UTTTGrid, {
    board: props.board
  })), /*#__PURE__*/React.createElement(TurnLabel, null), /*#__PURE__*/React.createElement("button", {
    id: "btnSurrender",
    onClick: handleSurrender
  }, "Surrender"), /*#__PURE__*/React.createElement("button", {
    id: "btnLeaveRoom",
    onClick: handleLeave
  }, "Leave"), /*#__PURE__*/React.createElement("h2", null, "Chat"), /*#__PURE__*/React.createElement(Chat, null));
};
"use strict";

// React component factories
var createAccountWindow = function createAccountWindow() {
  sendRequest('GET', '/account', null, function (response) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountWindow, {
      account: response
    }), document.querySelector("#content"));
  });
};

var createGameList = function createGameList() {
  sendRequest('GET', '/rooms', null, function (response) {
    ReactDOM.render( /*#__PURE__*/React.createElement(GameList, {
      csrf: csrf,
      rooms: response
    }), document.querySelector("#content"));
  });
};

var createGame = function createGame(board) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Game, {
    board: board
  }), document.querySelector("#content"));
};
"use strict";

// Functionalities
var handleCreate = function handleCreate(e) {
  e.preventDefault();
  var name = document.querySelector("#roomName").value.trim();

  if (name == '') {
    handleError('Room name required');
    return false;
  }

  var createForm = document.querySelector("#createForm");
  sendRequest(createForm.method, createForm.action, serialize(createForm), function (response) {
    socket.emit('joinRoom', response);
    createGame(response.board);
  });
  return false;
}; // Function to join a UTTT room/game


var handleJoin = function handleJoin(e, roomID) {
  sendRequest('POST', '/join', "_csrf=".concat(csrf, "&id=").concat(roomID), function (response) {
    socket.emit('joinRoom', response);
    createGame(response.board);
  });
}; // Function to send a message in a UTTT room chat


var handleSend = function handleSend(e) {
  var input = document.querySelector("#textMessage");

  if (input.value !== '') {
    socket.emit('message', {
      text: input.value
    });
    input.value = '';
  }
}; // Function to send a message when Enter is pressed


var handleKeypressSend = function handleKeypressSend(e) {
  // Enter
  if (e.which == '13') {
    handleSend(e);
  }
}; // Function for player to take turn and play in a cell


var handleTurn = function handleTurn(e, utttCell, tttCell) {
  var data = {
    _csrf: csrf,
    utttCell: utttCell,
    tttCell: tttCell
  };
  sendRequest('POST', '/turn', encodeObjectToBody(data), function (response) {
    socket.emit('turn', response);
  });
}; // Function to flag that player has surrendered


var handleSurrender = function handleSurrender(e) {
  sendRequest('POST', '/surrender', "_csrf=".concat(csrf), function (response) {// TODO
  });
}; // Function to leave a room


var handleLeave = function handleLeave(e) {
  sendRequest('POST', '/leave', "_csrf=".concat(csrf), function (response) {
    console.log(response);
    socket.emit('leaveRoom');
    createGameList();
  });
};
"use strict";

/**
 * Returns whether the string provided is a special symbol
 * used in TTT winner checks
 * @param {String} winner - Winner result in question
 * @returns
 */
var isSpecialSymbol = function isSpecialSymbol(winner) {
  return winner === ' ' || winner === '' || winner === 'TIE';
}; // Returns symbol that won
// Returns 'TIE' if there is a tie
// Returns ' ' if no winner or tie yet


var getTTTWinner = function getTTTWinner(tttBoard) {
  // Horizontal Top
  if (tttBoard[0] === tttBoard[1] && tttBoard[1] === tttBoard[2] && !isSpecialSymbol(tttBoard[0])) return tttBoard[0]; // Horizontal Middle

  if (tttBoard[3] === tttBoard[4] && tttBoard[4] === tttBoard[5] && !isSpecialSymbol(tttBoard[3])) return tttBoard[3]; // Horizontal Bottom

  if (tttBoard[6] === tttBoard[7] && tttBoard[7] === tttBoard[8] && !isSpecialSymbol(tttBoard[6])) return tttBoard[6]; // Vertical Left

  if (tttBoard[0] === tttBoard[3] && tttBoard[3] === tttBoard[6] && !isSpecialSymbol(tttBoard[0])) return tttBoard[0]; // Vertical Middle

  if (tttBoard[1] === tttBoard[4] && tttBoard[4] === tttBoard[7] && !isSpecialSymbol(tttBoard[1])) return tttBoard[1]; // Vertical Right

  if (tttBoard[2] === tttBoard[5] && tttBoard[5] === tttBoard[8] && !isSpecialSymbol(tttBoard[2])) return tttBoard[2]; // Diagonals

  if (tttBoard[0] === tttBoard[4] && tttBoard[4] === tttBoard[8] && !isSpecialSymbol(tttBoard[0])) return tttBoard[0];
  if (tttBoard[2] === tttBoard[4] && tttBoard[4] === tttBoard[6] && !isSpecialSymbol(tttBoard[2])) return tttBoard[2]; // Check tie

  for (var i = 0; i < tttBoard.length; i++) {
    // If there is any empty cell, there is no winner or tie yet
    if (tttBoard[i] === ' ' || tttBoard[i] === '') {
      return ' ';
    }
  } // No empty cell found and no winner, tie


  return 'TIE';
};
"use strict";

var csrf = ''; // Cache for current csrf token
// Gets a new csrf token from the server

var getToken = function getToken(callback) {
  sendRequest('GET', '/getToken', null, function (result) {
    callback(result.csrfToken);
  });
};

var handleError = function handleError(message) {
  console.log(message); // TODO
};

var handleRedirect = function handleRedirect(response) {
  window.location = response.redirect;
};

var sendRequest = function sendRequest(method, url, body, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function (e) {
    try {
      var response = JSON.parse(xhr.response);

      if (response && response.error) {
        handleError(response.error);
      } else {
        callback(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  xhr.onerror = function (err) {
    console.log("An error ocurred trying to send your request to ".concat(url));
  };

  if (body) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  } else {
    xhr.send();
  }
}; // Returns all fields of a form formatted to x-www-form-urlencoded
// https://stackoverflow.com/questions/39786337/how-to-convert-js-object-data-to-x-www-form-urlencoded


var serialize = function serialize(form) {
  var data = [];
  var formData = new FormData(form);
  formData.forEach(function (value, key) {
    data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return data.join('&');
};

var encodeObjectToBody = function encodeObjectToBody(obj) {
  var data = [];
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    data.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }

  return data.join('&');
}; // All pages must implement init() !!!


document.addEventListener('DOMContentLoaded', function (e) {
  getToken(function (csrfToken) {
    csrf = csrfToken;
    init();
  });
});

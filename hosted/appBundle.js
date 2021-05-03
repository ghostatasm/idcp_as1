"use strict";

var socket; // Client connection socket
// Init

var init = function init() {
  // Connect to the base URL
  socket = io(window.location.origin);
  socket.on('message', function (data) {
    updateChat(data);
  });
  socket.on('turn', function (data) {
    updateBoard(data.board);
  });
  sendRequest('GET', '/account', null, function (account) {
    socket.emit('account', {
      account: account
    });
  }); // DOM Events

  var accountButton = document.querySelector("#accountButton");
  accountButton.addEventListener('click', function (e) {
    e.preventDefault();
    createAccountWindow();
  });
  var gamesButton = document.querySelector("#gamesButton");
  gamesButton.addEventListener('click', function (e) {
    e.preventDefault();
    createGameList();
  }); // Default View

  createGameList();
};
"use strict";

// React Components
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
  }, "Won/Lost:"), /*#__PURE__*/React.createElement("p", {
    className: "wonLost"
  }, props.account.gamesWon, "/", props.account.gamesLost)));
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
    }, /*#__PURE__*/React.createElement("th", null, room.name), /*#__PURE__*/React.createElement("th", null, room.creator), /*#__PURE__*/React.createElement("th", null, room.opponent ? 'Playing' : 'Waiting'), /*#__PURE__*/React.createElement("th", null, room.turn), /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("button", {
      className: "btnJoin",
      onClick: function onClick(e) {
        return handleJoin(e, room._id);
      }
    }, "Join")));
  }))));
};

var TTTGrid = function TTTGrid(props) {
  return /*#__PURE__*/React.createElement("table", {
    className: "tttGrid"
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
  return /*#__PURE__*/React.createElement("table", {
    className: "utttGrid"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 0,
    board: props.board[0]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 1,
    board: props.board[1]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 2,
    board: props.board[2]
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 3,
    board: props.board[3]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 4,
    board: props.board[4]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 5,
    board: props.board[5]
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 6,
    board: props.board[6]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 7,
    board: props.board[7]
  })), /*#__PURE__*/React.createElement("th", {
    className: "utttCell"
  }, /*#__PURE__*/React.createElement(TTTGrid, {
    utttcell: 8,
    board: props.board[8]
  })))));
};

var Chat = function Chat(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "chat"
  }, /*#__PURE__*/React.createElement("ul", null), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "message",
    id: "textMessage",
    onKeyPress: handleKeypressSend
  }), /*#__PURE__*/React.createElement("button", {
    id: "btnSendMessage",
    onClick: handleSend
  }, "Send"));
};

var Game = function Game(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "game"
  }, /*#__PURE__*/React.createElement("h1", null, "Game"), /*#__PURE__*/React.createElement("div", {
    className: "board"
  }, /*#__PURE__*/React.createElement(UTTTGrid, {
    board: [[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']]
  })), /*#__PURE__*/React.createElement("button", {
    id: "btnSurrender",
    onClick: handleSurrender
  }, "Surrender"), /*#__PURE__*/React.createElement("button", {
    id: "btnLeaveRoom",
    onClick: handleLeave
  }, "Leave"), /*#__PURE__*/React.createElement("h1", null, "Chat"), /*#__PURE__*/React.createElement(Chat, null));
};
"use strict";

// React component factories
var createAccountWindow = function createAccountWindow() {
  sendRequest('GET', '/account', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountWindow, {
      account: data
    }), document.querySelector("#content"));
  });
};

var createGameList = function createGameList() {
  sendRequest('GET', '/rooms', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(GameList, {
      csrf: csrf,
      rooms: data.rooms
    }), document.querySelector("#content"));
  });
};

var createGame = function createGame() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Game, null), document.querySelector("#content"));
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
  sendRequest(createForm.method, createForm.action, serialize(createForm), function (data) {
    handleJoin(e, data.room._id);
  });
  return false;
}; // Function to join a UTTT room/game


var handleJoin = function handleJoin(e, roomID) {
  sendRequest('POST', '/join', "_csrf=".concat(csrf, "&id=").concat(roomID), function (response) {
    socket.emit('joinRoom', {
      id: response.data.room.id
    });
    createGame();
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
    if (response.data.board) {
      socket.emit('turn', {
        board: response.data.board
      });
    }
  });
}; // Function to flag that player has surrendered


var handleSurrender = function handleSurrender(e) {
  socket.emit('surrender');
}; // Function to leave a room


var handleLeave = function handleLeave(e) {
  socket.emit('leaveRoom');
  createGameList();
}; // Function to add new message to chat


var updateChat = function updateChat(data) {
  var chat = document.querySelector(".chat ul");

  if (chat) {
    var message = document.createElement("li");
    message.innerHTML = "<b>".concat(data.username, "</b>: ").concat(data.text);
    chat.appendChild(message);
  }
};

var updateBoard = function updateBoard(board) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UTTTGrid, {
    board: board
  }), document.querySelector(".board"));
};
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var sendRequest = function sendRequest(method, url, body, success) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function (e) {
    var response = JSON.parse(xhr.response);

    if (response.error) {
      handleError(response.error);
    } else {
      success(response);
    }
  };

  xhr.onerror = function (err) {
    handleError(err);
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

  var _iterator = _createForOfIteratorHelper(new FormData(form)),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];

      data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return data.join('&');
};

var encodeObjectToBody = function encodeObjectToBody(obj) {
  var data = [];

  for (var _i2 = 0, _Object$entries = Object.entries(obj); _i2 < _Object$entries.length; _i2++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }

  return data.join('&');
}; // All pages must implement init() !!!


document.addEventListener('DOMContentLoaded', function (e) {
  getToken(function (csrfToken) {
    csrf = csrfToken;
    init();
  });
});

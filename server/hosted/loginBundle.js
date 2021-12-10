"use strict";

// Functionalities
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  var user = document.querySelector("#user");
  var pass = document.querySelector("#pass");

  if (user.value == '' || pass.value == '') {
    handleError('Username or password is empty');
    return false;
  }

  var loginForm = document.querySelector("#loginForm");
  sendRequest(loginForm.method, loginForm.action, serialize(loginForm), handleRedirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  var user = document.querySelector("#user");
  var pass = document.querySelector("#pass");
  var pass2 = document.querySelector("#pass2");

  if (user.value == '' || pass.value == '' || pass2.value == '') {
    handleError('All fields are required');
    return false;
  }

  if (pass.value !== pass2.value) {
    handleError('Passwords do not match');
    return false;
  }

  var signupForm = document.querySelector("#signupForm");
  sendRequest(signupForm.method, signupForm.action, serialize(signupForm), handleRedirect);
  return false;
}; // React Components


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "login-window"
  }, /*#__PURE__*/React.createElement("p", {
    id: "error-display"
  }), /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username",
    autoComplete: "on"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password",
    autoComplete: "on"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Login"
  })));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "signup-window"
  }, /*#__PURE__*/React.createElement("p", {
    id: "error-display"
  }), /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username",
    autoComplete: "on"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password",
    autoComplete: "on"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password",
    autoComplete: "on"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Signup"
  })));
}; // React component factories


var createLoginWindow = function createLoginWindow() {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // Init


var init = function init() {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow();
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow();
    return false;
  }); // Default View

  createLoginWindow();
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
  var errorDisplay = document.querySelector('#error-display');

  if (errorDisplay) {
    errorDisplay.innerHTML = "".concat(message);
  }
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
    } catch (err) {// JSON Parsing Error
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
"use strict";

// React Components
var Rules = function Rules(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("h1", null, "Rules"), /*#__PURE__*/React.createElement("div", {
    className: "explanation"
  }, /*#__PURE__*/React.createElement("p", null, "Ultimate Tic Tac Toe is a slight variation of the traditional pen-and-paper game where, by changing a few simple rules, the game takes on a different form entirely. The rules of the game are simple."), /*#__PURE__*/React.createElement("p", null, "There is a big 3x3 grid of Tic Tac Toe and inside of each one of those cells, there is a smaller nested Tic Tac Toe game. To win the game entirely, you must win 3 of those nested Tic Tac Toe games in a line (horizontally, vertically, or diagonally)."), /*#__PURE__*/React.createElement("p", null, "As a reminder, to win a regular game of Tic Tac Toe you must place 3 of your symbols (X's or O's) in a line as well."), /*#__PURE__*/React.createElement("p", null, "Players take turns placing down their symbol in one of the small Tic Tac Toe grids. The first player to go can place their symbol anywhere. Here is the catch. After the first turn, the next player to go has to play within the small Tic Tac Toe grid that corresponds to the cell that was played last turn. That is to say, if the previous player placed their symbol in the bottom-right corner of a Tic Tac Toe grid, the next player has to place theirs in the Tic Tac Toe game that is in the bottom-right corner."), /*#__PURE__*/React.createElement("p", null, "You cannot play in a Tic Tac Toe game that has already been won, so if a player places their symbol in a cell that corresponds to an already won game, the next player can go anywhere they want to."), /*#__PURE__*/React.createElement("p", null, "That is it. Hope you like the game. GLHF!")));
};

var createRules = function createRules() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Rules, null), document.querySelector("#content"));
};

document.addEventListener('DOMContentLoaded', function (e) {
  var rulesButton = document.querySelector("#rulesButton");
  rulesButton.addEventListener("click", function (e) {
    e.preventDefault();
    createRules();
    return false;
  });
});

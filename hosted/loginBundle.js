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
  return /*#__PURE__*/React.createElement("form", {
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
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "login"
  }));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
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
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "signup"
  }));
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

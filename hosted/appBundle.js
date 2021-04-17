"use strict";

// Functionalities
var handleDomo = function handleDomo(e, csrf) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoSize").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer(csrf);
  });
  return false;
};

var handleDomoDelete = function handleDomoDelete(e, id, csrf) {
  sendAjax('DELETE', "/deleteDomo?id=".concat(id), "_csrf=".concat(csrf), function () {
    loadDomosFromServer(csrf);
  });
}; // React components


var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: function onSubmit(e) {
      return handleDomo(e, props.csrf);
    },
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "size"
  }, "Size: "), /*#__PURE__*/React.createElement("input", {
    id: "domoSize",
    type: "text",
    name: "size",
    placeholder: "Domo Size"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age), /*#__PURE__*/React.createElement("h3", {
      className: "domoSize"
    }, "Size: ", domo.size), /*#__PURE__*/React.createElement("button", {
      className: "domoDelete",
      onClick: function onClick(e) {
        return handleDomoDelete(e, domo._id, props.csrf);
      }
    }, "Delete"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
}; // React component factories


var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getDomos', "_csrf=".concat(csrf), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos,
      csrf: csrf
    }), document.querySelector("#domos"));
  });
}; // Init


var init = function init() {// ReactDOM.render(
  //     <DomoForm csrf={csrf} />,
  //     document.querySelector("#makeDomo")
  // );
  // ReactDOM.render(
  //     <DomoList domos={[]} csrf={csrf} />,
  //     document.querySelector("#domos")
  // );
  // loadDomosFromServer(csrf);
};
"use strict";

var csrf = ''; // Cache for current csrf token

var getToken = function getToken(callback) {
  sendRequest('GET', '/getToken', null, function (result) {
    callback(result.csrfToken);
  });
};

var handleError = function handleError(message) {// TODO
};

var handleRedirect = function handleRedirect(response) {
  window.location = response.redirect;
};

var sendRequest = function sendRequest(method, url, body, success) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = success;

  xhr.onerror = function (err) {
    console.log(err); // handleError(err)
  };

  xhr.send();
}; // All pages must implement init() !!!


document.addEventListener("DOMContentLoaded", function (e) {
  getToken(function (csrfToken) {
    csrf = csrfToken;
    init();
  });
});

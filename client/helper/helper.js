let csrf = ''; // Cache for current csrf token

// Gets a new csrf token from the server
const getToken = (callback) => {
    sendRequest('GET', '/getToken', null, (result) => {
        callback(result.csrfToken);
    });
};

const handleError = (message) => {
    console.log(message);
    
    // TODO
};

const handleRedirect = (response) => {
    window.location = response.redirect;
};

const sendRequest = (method, url, body, success) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = e => {
        const response = JSON.parse(xhr.response);
        if (response.error) {
            handleError(response.error);
        }
        else {
            success(response);
        }
    };
    xhr.onerror = (err) => {
        handleError(err)
    };
    if (body) {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(body);
    }
    else {
        xhr.send();
    }
};

// Returns all fields of a form formatted to x-www-form-urlencoded
// https://stackoverflow.com/questions/39786337/how-to-convert-js-object-data-to-x-www-form-urlencoded
const serialize = (form) => {
    const data = [];
    for (const [key, value] of new FormData(form)) {
        data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return data.join('&');
};

const encodeObjectToBody = (obj) => {
    const data = [];
    for (const [key, value] of Object.entries(obj)) {
        data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return data.join('&');
};

// All pages must implement init() !!!
document.addEventListener('DOMContentLoaded', e => {
    getToken((csrfToken) => {
        csrf = csrfToken;
        init();
    });
});
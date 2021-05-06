let csrf = ''; // Cache for current csrf token

// Gets a new csrf token from the server
const getToken = (callback) => {
    sendRequest('GET', '/getToken', null, (result) => {
        callback(result.csrfToken);
    });
};

const handleError = (message) => {
    const errorDisplay = document.querySelector('#error-display');
    if (errorDisplay) {
        errorDisplay.innerHTML = `${message}`;
    }
};

const handleRedirect = (response) => {
    window.location = response.redirect;
};

const sendRequest = (method, url, body, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = e => {
        try {
            const response = JSON.parse(xhr.response);

            if (response && response.error) {
                handleError(response.error);
            }
            else {
                callback(response);
            }
        }
        catch (err) {
            // JSON Parsing Error
        }
    };
    xhr.onerror = (err) => {
        console.log(`An error ocurred trying to send your request to ${url}`)
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
    const formData = new FormData(form);

    formData.forEach((value, key) => {
        data.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });

    return data.join('&');
};

const encodeObjectToBody = (obj) => {
    const data = [];
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        data.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
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
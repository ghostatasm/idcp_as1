let socket; // Client connection socket

// Init
const init = () => {
    // Connect to the base URL
    socket = io(window.location.origin);

    // Socket listeners
    socket.on('playerLeft', response => {
        if (response.room.winner !== '') {
            socket.emit('winner', { winner: response.room.winner });
        }
    });

    // DOM Events
    const accountButton = document.querySelector("#accountButton");
    accountButton.addEventListener('click', e => {
        e.preventDefault();

        createAccountWindow();
    });

    const gamesButton = document.querySelector("#gamesButton");
    gamesButton.addEventListener('click', e => {
        e.preventDefault();

        createGameList();

        // Check if the player is in a game
        sendRequest('GET', 'room', null, response => {
            // If there is a game in session join it
            if (response) {
                sendRequest('POST', '/rejoin', `_csrf=${csrf}&id=${response._id}`, joinResponse => {
                    socket.emit('joinRoom', joinResponse);
                    createGame(joinResponse.board);
                });
            }
        });
    });

    // Default View
    createGameList();

    // Get session information
    sendRequest('GET', '/account', `_csrf=${csrf}`, account => {
        socket.emit('account', {
            account,
        });

        // Check if the player is in a game
        sendRequest('GET', '/room', null, response => {
            // If there is a game in session join it
            if (response) {
                sendRequest('POST', '/rejoin', `_csrf=${csrf}&id=${response._id}`, joinResponse => {
                    socket.emit('joinRoom', joinResponse);
                    createGame(joinResponse.board);
                });
            }
        });
    });
};
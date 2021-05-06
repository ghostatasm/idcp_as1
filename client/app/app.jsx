let socket; // Client connection socket
let account; // Cache for account in session
let room // Cache for room in session

// Init
const init = () => {
    // Connect to the base URL
    socket = io(window.location.origin);

    // Socket listeners
    socket.on('updateRoom', updateRoomData => {
        // Update cached room
        room = updateRoomData.room;
        // Let the client know it was updated
        document.dispatchEvent(new Event('roomUpdated'));
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
        sendRequest('GET', '/room', null, roomResponse => {
            // If there is a game in session join it
            if (roomResponse) {
                room = roomResponse;

                sendRequest('POST', '/rejoin', `_csrf=${csrf}&id=${room._id}`, rejoinResponse => {
                    socket.emit('joinRoom',  {
                        room: rejoinResponse,
                    });
                    createGame(rejoinResponse.board);
                });
            }
        });
    });

    // Default View
    createGameList();

    // Get session information
    sendRequest('GET', '/account', `_csrf=${csrf}`, accountResponse => {
        // Set session information
        account = accountResponse;
        
        socket.emit('account', {
            account,
        });

        // Check if the player is in a game
        sendRequest('GET', '/room', null, roomResponse => {
            // If there is a game in session join it
            if (roomResponse) {
                room = roomResponse;

                sendRequest('POST', '/rejoin', `_csrf=${csrf}&id=${room._id}`, rejoinResponse => {
                    socket.emit('joinRoom', {
                        room: rejoinResponse,
                    });
                    createGame(rejoinResponse.board);
                });
            }
        });
    });
};
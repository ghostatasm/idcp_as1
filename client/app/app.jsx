let socket; // Client connection socket

// Init
const init = () => {
    // Connect to the base URL
    socket = io(window.location.origin);

    socket.on('message', data => {
        updateChat(data);
    });

    socket.on('turn', data => {
        updateBoard(data.board);
    });

    sendRequest('GET', '/account', null, account => {
        socket.emit('account', {
            account,
        });
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
    });

    // Default View
    createGameList();
};
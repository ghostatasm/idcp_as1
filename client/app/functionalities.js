// Functionalities
const handleResetPassword = (e) => {
    e.preventDefault();

    const pass = document.querySelector("#pass");
    const pass2 = document.querySelector("#pass2");

    if (pass.value == '' || pass2.value == '') {
        handleError('All fields are required');
        return false;
    }

    if (pass.value !== pass2.value) {
        handleError('Passwords do not match');
        return false;
    }

    const resetPassForm = document.querySelector("#resetPasswordForm");
    sendRequest(resetPassForm.method, resetPassForm.action, serialize(resetPassForm), handleRedirect);

    return false;
}

const handleCreate = (e) => {
    e.preventDefault();

    const name = document.querySelector("#roomName").value.trim();

    if (name == '') {
        handleError('Room name required');
        return false;
    }

    const createForm = document.querySelector("#createForm");
    sendRequest(createForm.method, createForm.action, serialize(createForm), response => {
        socket.emit('joinRoom', {
            room: response,
        });
        
        room = response;
        // Let the client know it was updated
        document.dispatchEvent(new Event('roomUpdated'));
        
        createGame(response.board);
    });

    return false;
};

// Function to join a UTTT room/game
const handleJoin = (e, roomID) => {
    sendRequest('POST', '/join', `_csrf=${csrf}&id=${roomID}`, response => {
        socket.emit('joinRoom', {
            room: response,
        });

        createGame(response.board);
    });
};

// Function to send a message in a UTTT room chat
const handleSend = (e) => {
    const input = document.querySelector("#textMessage");
    if (input.value !== '') {
        socket.emit('message', {
            text: input.value,
        });

        input.value = '';
    }
};

// Function to send a message when Enter is pressed
const handleKeypressSend = (e) => {
    // Enter
    if (e.which == '13') {
        handleSend(e);
    }
};

// Function for player to take turn and play in a cell
const handleTurn = (e, utttCell, tttCell) => {
    const data = {
        _csrf: csrf,
        utttCell,
        tttCell,
    };

    sendRequest('POST', '/turn', encodeObjectToBody(data), response => {
        socket.emit('turn', {
            room: response,
        });
    });
};

// Function to flag that player has surrendered
const handleSurrender = (e) => {
    sendRequest('POST', '/surrender', `_csrf=${csrf}`, response => {
        socket.emit('surrender', {
            room: response,
        });
    });
};

// Function to leave a room
const handleLeave = (e) => {
    sendRequest('POST', '/leave', `_csrf=${csrf}`, response => {
        socket.emit('leaveRoom', {
            room: response
        });

        createGameList();
    });
};

// Function to grab rooms in server and re-render them
const handleRefresh = (e) => {
    createGameList();
};
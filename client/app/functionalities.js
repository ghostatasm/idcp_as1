// Functionalities
const handleCreate = (e) => {
    e.preventDefault();

    const name = document.querySelector("#roomName").value.trim();

    if (name == '') {
        handleError('Room name required');
        return false;
    }

    const createForm = document.querySelector("#createForm");
    sendRequest(createForm.method, createForm.action, serialize(createForm), response => {
        socket.emit('joinRoom', response);
        createGame(response.board);
    });

    return false;
};

// Function to join a UTTT room/game
const handleJoin = (e, roomID) => {
    sendRequest('POST', '/join', `_csrf=${csrf}&id=${roomID}`, response => {
        socket.emit('joinRoom', response);
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
        socket.emit('turn', response);
    });
};

// Function to flag that player has surrendered
const handleSurrender = (e) => {
    socket.emit('surrender');
};

// Function to leave a room
const handleLeave = (e) => {
    socket.emit('leaveRoom');
    createGameList();
};

// Function to add new message to chat
const updateChat = (data) => {
    const chat = document.querySelector(".chat ul");
    if (chat) {
        const message = document.createElement("li");
        message.innerHTML = `<b>${data.username}</b>: ${data.text}`;
        chat.appendChild(message);
    }
};
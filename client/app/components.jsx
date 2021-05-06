// Returns index of cell to highlight
// -1 means all should be highlighted
// Anything except 0-8 means none highlighted
const getCellToHighlight = (account, room) => {
    // If the game is not running, don't highlight anything
    if (room.state !== 'Playing' || !isPlayersTurn(account, room)) {
        return -2;
    }
    // If it's the first turn or last turn points to a won board highlight all
    else if (room.turn <= 0 || getTTTWinner(room.board[room.lastTurn[1]]) !== ' ') {
        return -1
    }
    // Highlight cell that last turn points to
    else {
        return room.lastTurn[1];
    }
};

// React Components
const AccountWindow = (props) => {
    return (
        <div className="accountWindow">
            <h1>Account</h1>
            <div className="info">
                <div className="username-container">
                    <label htmlFor="username">Username:</label>
                    <p className="username">{props.account.username}</p>
                </div>
                <div className="gamesPlayerContainer">
                    <label htmlFor="gamesPlayed">Games Played:</label>
                    <p className="gamesPlayed">{props.account.gamesPlayed}</p>
                </div>
                <div className="wonLostContainer">
                    <label htmlFor="wonLost">Won/Tied/Lost:</label>
                    <p className="wonLost">{props.account.gamesWon}/{props.account.gamesTied}/{props.account.gamesLost}</p>
                </div>
            </div>
            <form action="/resetPassword" method="post" onSubmit={handleResetPassword} id="resetPasswordForm">
                <label htmlFor="pass">New Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" autoComplete="on" />
                <label htmlFor="pass2">New Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" autoComplete="on" />
                <input type="hidden" name="_csrf" value={csrf} />
                <input type="submit" value="Reset Password" />
            </form>
        </div>
    );
};

const GameList = (props) => {
    return (
        <div className="gameList">
            <h1>Games</h1>
            <form action="/create" method="post" onSubmit={handleCreate} id="createForm">
                <label htmlFor="name">Room Name:</label>
                <input type="text" name="name" id="roomName" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="submit" value="Create Room" />
            </form>
            <button onClick={handleRefresh}>Refresh Game List</button>
            <table>
                <thead>
                    <tr>
                        <th>Room Name</th>
                        <th>Creator</th>
                        <th>State</th>
                        <th>Turn</th>
                        <th>Join</th>
                    </tr>
                </thead>
                <tbody>
                    {props.rooms.length > 0 ? props.rooms.map(room => {
                        return (
                            <tr key={room._id}>
                                <th>{room.name}</th>
                                <th>{room.creator}</th>
                                <th>{room.state}</th>
                                <th>{room.turn}</th>
                                <th><button className="btnJoin" onClick={(e) => handleJoin(e, room._id)}>Join</button></th>
                            </tr>
                        );
                    }) :
                        <tr>
                            <th>No rooms found</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>}
                </tbody>
            </table>
        </div>
    );
};

const TTTGrid = (props) => {
    const [classes, setClasses] = React.useState('tttGrid');

    // Helper function that sets a class on a cell to highlight
    const updateHighlight = () => {
        const index = +getCellToHighlight(account, room);
        if (index === -1 || index === props.utttcell) {
            setClasses('tttGrid highlight');
        }
        else {
            setClasses('tttGrid');
        }
    };

    // Listen for room updates
    document.addEventListener('roomUpdated', e => {
        updateHighlight();
    });

    return (
        <table className={classes}>
            <tbody>
                <tr>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 0)}>{props.board[0]}</button></th>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 1)}>{props.board[1]}</button></th>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 2)}>{props.board[2]}</button></th>
                </tr>
                <tr>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 3)}>{props.board[3]}</button></th>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 4)}>{props.board[4]}</button></th>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 5)}>{props.board[5]}</button></th>
                </tr>
                <tr>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 6)}>{props.board[6]}</button></th>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 7)}>{props.board[7]}</button></th>
                    <th className="tttCell"><button onClick={e => handleTurn(e, props.utttcell, 8)}>{props.board[8]}</button></th>
                </tr>
            </tbody>
        </table>
    );
};

const UTTTGrid = (props) => {
    const [board, setBoard] = React.useState(props.board);

    // Listen for room updates
    document.addEventListener('roomUpdated', e => {
        // Update the board
        setBoard(room.board);
    });

    return (
        <table className="utttGrid">
            <tbody>
                <tr>
                    <th className="utttCell">
                        <TTTGrid utttcell={0} board={board[0]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={1} board={board[1]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={2} board={board[2]} />
                    </th>
                </tr>
                <tr>
                    <th className="utttCell">
                        <TTTGrid utttcell={3} board={board[3]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={4} board={board[4]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={5} board={board[5]} />
                    </th>
                </tr>
                <tr>
                    <th className="utttCell">
                        <TTTGrid utttcell={6} board={board[6]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={7} board={board[7]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={8} board={board[8]} />
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

const Chat = (props) => {
    const [messages, setMessages] = React.useState(props.messages ? props.messages : []);

    socket.on('message', response => {
        setMessages([...messages, response]);
    });

    return (
        <div className="chat">
            <ul>{messages.map(msg => <li key={msg.id}><b>{msg.username}</b>: {msg.text}</li>)}</ul>
            <div className="messageContainer">
                <input type="text" name="message" id="textMessage" onKeyPress={handleKeypressSend} />
                <button id="btnSendMessage" onClick={handleSend}>Send</button>
            </div>

        </div>
    );
};

const TurnLabel = (props) => {
    const [turnText, setTurnText] = React.useState('');

    const updateLabel = () => {
        if (room.state === 'Playing') {
            if (isPlayersTurn(account, room)) {
                setTurnText('It is your turn!')
            }
            else {
                setTurnText('Wait for your opponent to play');
            }
        }
        else {
            setTurnText('The game has not yet started');
        }
    }

    // Listen for room updates
    document.addEventListener('roomUpdated', e => {
        updateLabel();
    });

    return (
        <div className="turnLabel">
            <p>{turnText}</p>
        </div>
    );
};

const Game = (props) => {
    let surrenderButton = null;
    if (isPlayerInGame(account, room)) {
        surrenderButton = <button id="btnSurrender" onClick={handleSurrender}>Surrender</button>;
    }

    return (
        <div className="game">
            <div className="gameContainer">
                <h1>Game</h1>

                <div className="board">
                    <UTTTGrid board={props.board} />
                </div>

                {isPlayerInGame(account, room) ? <TurnLabel /> : null}

                {surrenderButton}
                <button id="btnLeaveRoom" onClick={handleLeave}>Leave</button>
            </div>

            <div className="chatContainer">
                <h2>Chat</h2>

                <Chat />
            </div>
        </div>
    );
};
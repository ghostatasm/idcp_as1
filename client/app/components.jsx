// React Components
const AccountWindow = (props) => {
    return (
        <div className="accountWindow">
            <h1>Account</h1>
            <div className="info">
                <label htmlFor="username">Username:</label><p className="username">{props.account.username}</p>
                <label htmlFor="gamesPlayed">Games Played:</label><p className="gamesPlayed">{props.account.gamesPlayed}</p>
                <label htmlFor="wonLost">Won/Lost:</label><p className="wonLost">{props.account.gamesWon}/{props.account.gamesLost}</p>
            </div>
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
                    {props.rooms.map(room => {
                        return (
                            <tr key={room._id}>
                                <th>{room.name}</th>
                                <th>{room.creator}</th>
                                <th>{room.opponent ? 'Playing' : 'Waiting'}</th>
                                <th>{room.turn}</th>
                                <th><button className="btnJoin" onClick={(e) => handleJoin(e, room._id)}>Join</button></th>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const TTTGrid = (props) => {
    return (
        <table className="tttGrid">
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
    return (
        <table className="utttGrid">
            <tbody>
                <tr>
                    <th className="utttCell">
                        <TTTGrid utttcell={0} board={props.board[0]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={1} board={props.board[1]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={2} board={props.board[2]} />
                    </th>
                </tr>
                <tr>
                    <th className="utttCell">
                        <TTTGrid utttcell={3} board={props.board[3]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={4} board={props.board[4]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={5} board={props.board[5]} />
                    </th>
                </tr>
                <tr>
                    <th className="utttCell">
                        <TTTGrid utttcell={6} board={props.board[6]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={7} board={props.board[7]} />
                    </th>
                    <th className="utttCell">
                        <TTTGrid utttcell={8} board={props.board[8]} />
                    </th>
                </tr>
            </tbody>
        </table>
    );
};

const Chat = (props) => {
    return (
        <div className="chat">
            <ul></ul>
            <input type="text" name="message" id="textMessage" onKeyPress={handleKeypressSend} />
            <button id="btnSendMessage" onClick={handleSend}>Send</button>
        </div>
    );
};

const Game = (props) => {
    return (
        <div className="game">
            <h1>Game</h1>

            <div className="board">
                <UTTTGrid board={
                    [
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                    ]
                } />
            </div>

            <button id="btnSurrender" onClick={handleSurrender}>Surrender</button>
            <button id="btnLeaveRoom" onClick={handleLeave}>Leave</button>

            <h1>Chat</h1>

            <Chat />
        </div>
    );
};
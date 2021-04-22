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
            <h1>Game List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Room Name</th>
                        <th>Creator Username</th>
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
                                <th>{room.creatorUsername}</th>
                                <th>{room.state}</th>
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
                    <th className="tttCell"><button></button></th>
                    <th className="tttCell"><button></button></th>
                    <th className="tttCell"><button></button></th>
                </tr>
                <tr>
                    <th className="tttCell"><button></button></th>
                    <th className="tttCell"><button></button></th>
                    <th className="tttCell"><button></button></th>
                </tr>
                <tr>
                    <th className="tttCell"><button></button></th>
                    <th className="tttCell"><button></button></th>
                    <th className="tttCell"><button></button></th>
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
                        <TTTGrid />
                    </th>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                </tr>
                <tr>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                </tr>
                <tr>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                    <th className="utttCell">
                        <TTTGrid />
                    </th>
                    <th className="utttCell">
                        <TTTGrid />
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

            <UTTTGrid />

            <button id="btnSurrender" onClick={handleSurrender}>Surrender</button>
            <button id="btnLeaveRoom" onClick={handleLeave}>Leave</button>

            <h1>Chat</h1>

            <Chat />
        </div>
    );
};
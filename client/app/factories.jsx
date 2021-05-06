// React component factories
const createAccountWindow = () => {
    sendRequest('GET', '/account', null, (response) => {
        ReactDOM.render(
            <AccountWindow account={response} />,
            document.querySelector("#content")
        );
    });
};

const createGameList = () => {
    sendRequest('GET', '/rooms', null, response => {
        ReactDOM.render(
            <GameList
                csrf={csrf}
                rooms={response} />,
            document.querySelector("#content")
        );
    });
};

const createGame = (board) => {
    ReactDOM.render(
        <Game board={board}/>,
        document.querySelector("#content")
    );
};
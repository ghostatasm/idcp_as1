// React component factories
const createAccountWindow = () => {
    sendRequest('GET', '/account', null, (data) => {
        ReactDOM.render(
            <AccountWindow account={data} />,
            document.querySelector("#content")
        );
    });
};

const createGameList = () => {
    sendRequest('GET', '/rooms', null, data => {
        ReactDOM.render(
            <GameList
                csrf={csrf}
                rooms={data.rooms} />,
            document.querySelector("#content")
        );
    });

};

const createGame = () => {
    ReactDOM.render(
        <Game />,
        document.querySelector("#content")
    );
};
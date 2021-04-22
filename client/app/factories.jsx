// React component factories
const createAccountWindow = () => {
    // sendAjax('GET', '/getAccount', null, (data) => {
    //     ReactDOM.render(
    //         <AccountWindow account={data.account} />,
    //         document.querySelector("#content")
    //     );
    // });

    ReactDOM.render(
        <AccountWindow account={
            {
                username: 'testUsername',
                gamesPlayed: 10,
                gamesWon: 6,
                gamesLost: 4,
            }
        } />,
        document.querySelector("#content")
    );
};

const createGameList = () => {
    // sendAjax('GET', '/getRooms', null, (data) => {
    //     ReactDOM.render(
    //         <GameList rooms={data.rooms} />,
    //         document.querySelector("#content")
    //     );
    // });

    ReactDOM.render(
        <GameList rooms={[
            {
                _id: '54elkjh3kljh34kj5h',
                name: 'testName',
                creatorUsername: 'testUsername',
                state: 'Waiting',
                turn: 0,
            }
        ]} />,
        document.querySelector("#content")
    );
};

const createGame = () => {
    ReactDOM.render(
        <Game />,
        document.querySelector("#content")
    );
};
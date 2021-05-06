// React Components
const Rules = (props) => {
    return (
        <div className="rules">
            <h1>Rules</h1>

            <div className="explanation">
                <p>
                    Ultimate Tic Tac Toe is a slight variation of the traditional pen-and-paper game where,
                    by changing a few simple rules, the game takes on a different form entirely.
                    The rules of the game are simple.
                </p>
                <p>
                    There is a big 3x3 grid of Tic Tac Toe and inside of each one of those cells,
                    there is a smaller nested Tic Tac Toe game.
                    To win the game entirely, you must win 3 of those nested Tic Tac Toe games in a line
                    (horizontally, vertically, or diagonally).
                </p>
                <p>
                    As a reminder, to win a regular game of Tic Tac Toe you must place 3 of your symbols (X's or O's) in a line as well.
                </p>
                <p>
                    Players take turns placing down their symbol in one of the small Tic Tac Toe grids.
                    The first player to go can place their symbol anywhere. Here is the catch.
                    After the first turn, the next player to go has to play within the small Tic Tac Toe grid
                    that corresponds to the cell that was played last turn. 
                    That is to say, if the previous player placed their symbol in the bottom-right corner of a Tic Tac Toe grid,
                    the next player has to place theirs in the Tic Tac Toe game that is in the bottom-right corner.
                </p>
                <p>
                    You cannot play in a Tic Tac Toe game that has already been won, 
                    so if a player places their symbol in a cell that corresponds to an already won game, 
                    the next player can go anywhere they want to.
                </p>
                <p>
                    That is it. Hope you like the game. GLHF!
                </p>
            </div>
        </div>
    );
};

const createRules = () => {
    ReactDOM.render(
        <Rules />,
        document.querySelector("#content")
    );
};

document.addEventListener('DOMContentLoaded', e => {
    const rulesButton = document.querySelector("#rulesButton");

    rulesButton.addEventListener("click", (e) => {
        e.preventDefault();
        createRules();
        return false;
    });
});
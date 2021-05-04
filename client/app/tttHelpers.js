/**
 * Returns whether the string provided is a special symbol
 * used in TTT winner checks
 * @param {String} winner - Winner result in question
 * @returns
 */
 const isSpecialSymbol = (winner) => winner === ' ' || winner === '' || winner === 'TIE';

// Returns symbol that won
// Returns 'TIE' if there is a tie
// Returns ' ' if no winner or tie yet
const getTTTWinner = (tttBoard) => {
    // Horizontal Top
    if (tttBoard[0] === tttBoard[1] && tttBoard[1] === tttBoard[2] && !isSpecialSymbol(tttBoard[0])) return tttBoard[0];
    // Horizontal Middle
    if (tttBoard[3] === tttBoard[4] && tttBoard[4] === tttBoard[5] && !isSpecialSymbol(tttBoard[3])) return tttBoard[3];
    // Horizontal Bottom
    if (tttBoard[6] === tttBoard[7] && tttBoard[7] === tttBoard[8] && !isSpecialSymbol(tttBoard[6])) return tttBoard[6];
    // Vertical Left
    if (tttBoard[0] === tttBoard[3] && tttBoard[3] === tttBoard[6] && !isSpecialSymbol(tttBoard[0])) return tttBoard[0];
    // Vertical Middle
    if (tttBoard[1] === tttBoard[4] && tttBoard[4] === tttBoard[7] && !isSpecialSymbol(tttBoard[1])) return tttBoard[1];
    // Vertical Right
    if (tttBoard[2] === tttBoard[5] && tttBoard[5] === tttBoard[8] && !isSpecialSymbol(tttBoard[2])) return tttBoard[2];
    // Diagonals
    if (tttBoard[0] === tttBoard[4] && tttBoard[4] === tttBoard[8] && !isSpecialSymbol(tttBoard[0])) return tttBoard[0];
    if (tttBoard[2] === tttBoard[4] && tttBoard[4] === tttBoard[6] && !isSpecialSymbol(tttBoard[2])) return tttBoard[2];
  
    // Check tie
    for (let i = 0; i < tttBoard.length; i++) {
      // If there is any empty cell, there is no winner or tie yet
      if (tttBoard[i] === ' ' || tttBoard[i] === '') {
        return ' ';
      }
    }
  
    // No empty cell found and no winner, tie
    return 'TIE';
  };
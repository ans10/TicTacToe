module aiService {
  /** Returns the move that the computer player should do for the given state in move. */
  export function findComputerMove(move: IMove): IMove {
    return createComputerMove(move,
        // at most 1 second for the AI to choose a move (but might be much quicker)
        {millisecondsLimit: 1000});
  }

  /**
   * Returns all the possible moves for the given state and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  export function getPossibleMoves(state: IState, turnIndexBeforeMove: number): IMove[] {
    let possibleMoves: IMove[] = [];
    for (let i = 0; i < gameLogic.ROWS; i++) {
      for (let j = 0; j < gameLogic.COLS; j++) {
        try {
          possibleMoves.push(gameLogic.createMove(state, i, j, turnIndexBeforeMove));
        } catch (e) {
          // The cell in that position was full.
        }
      }
    }
    return possibleMoves;
  }

  /**
   * Returns the move that the computer player should do for the given state.
   * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
   * and it has either a millisecondsLimit or maxDepth field:
   * millisecondsLimit is a time limit, and maxDepth is a depth limit.
   */
  export function createComputerMove(
      move: IMove, alphaBetaLimits: IAlphaBetaLimits): IMove {
    // We use alpha-beta search, where the search states are TicTacToe moves.
     let moves: IMove[] = [];
     moves = getPossibleMoves(move.state, move.turnIndex);
    for(let i = 0; i < moves.length; i++){
      if(moves[i].endMatchScores){
        if(moves[i].endMatchScores[1] > moves[i].endMatchScores[0]){
          console.log("Choosing winning move");
          return moves[i];
        }
      }
      else if(moves[i].turnIndex === 1){
          console.log("Placing last candy in store");
          return moves[i];
      }
      else{
        for(let j = 1; j < gameLogic.COLS; j++){
           if(moves[i].state.board[0][j] === 0){
              if(move.state.board[0][j] !== 0){
                console.log("Placing last candy in empty hole");
                return moves[i];
              }
           }      
        }
       }      
    }
    let randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
    
    /*return alphaBetaService.alphaBetaDecision(
        move, move.turnIndex, getNextStates, getStateScoreForIndex0, null, alphaBetaLimits);*/
  }

  function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
    let endMatchScores = move.endMatchScores;
    if (endMatchScores) {
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
          : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
          : 0;
    }
    return 0;
  }

  function getNextStates(move: IMove, playerIndex: number): IMove[] {
    return getPossibleMoves(move.state, playerIndex);
  }
}


const Player = (playerName, symbol) => {
  return {
    getPlayerName: () => playerName,
    getPlayerSymbol: () => symbol,
  }
};

const GameCtrl = (() => {
  
  let whosGo = 0;
  let boardArray = ['', '', '',
                    '', '', '',
                    '','', ''];
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const playerClicked = function(e) {
    // if square is taken don't allow selection
    if(e.target.innerText !== '') {
        return;
      } else {
        // if whosGo is 0 then it is 'O' turn
        if(whosGo === 0) {
        displayController.displaySelection(e, App.p1, whosGo);
        // Insert into boardArray
        boardArray[e.target.dataset.boardnum -1] = App.p1.getPlayerSymbol();
        whosGo = 1;
        displayController.showTurnBall();
      } else {
        displayController.displaySelection(e, App.p2, whosGo);
        boardArray[e.target.dataset.boardnum -1] = App.p2.getPlayerSymbol();
        whosGo = 0;
        displayController.showTurnBall();
       }
      }
    }

    const checkWin = function(updatedBoardArr, p1, p2) {
      // Get player selections index on the board and make an array of them to check agains winningCombos
      let playerOPick = updatedBoardArr.reduce((a, e, i) => (e === p1.getPlayerSymbol()) ? a.concat(i) : a, []);
      let playerXPick = updatedBoardArr.reduce((a, e, i) => (e === p2.getPlayerSymbol()) ? a.concat(i) : a, []);
      console.log(playerOPick)

      // All spaces taken then draw
      for(let i = 0; i < winningCombos.length; i++) {
        if(updatedBoardArr.indexOf('') === -1) {
          displayController.displayWinner('draw');
        }

      // Match combos of 'O' to any of the winningCmbos
      const winningOThree = playerOPick.map(item => winningCombos[i].indexOf(item) > -1).filter(item => item === true);
      // If the length is equal to 3 that means O has won
      winningOThree.length === 3 ? displayController.displayWinner(p1.getPlayerSymbol()) : false;
      
      // Same for X
      const winningXThree = playerXPick.map(item => winningCombos[i].indexOf(item) > -1).filter(item => item === true)
      winningXThree.length === 3 ? displayController.displayWinner(p2.getPlayerSymbol()) : false;
      }
    }
    
    
    const resetGame = function() {
      whosGo = 0;
      boardArray = ['', '', '',
                    '', '', '',
                    '','', ''];
    }


  return {
    playerClicked,
    getBoardArr: () => boardArray,
    checkWin,
    resetGame
  }
  
})()


const displayController = (function() {
  const startModal = document.querySelector('.game-start-modal')
  const displayName = document.querySelector('.nameDis');
  const displayName2 = document.querySelector('.nameDis2');
  
  const startGame = (p1Name, p2Name) => {
    startModal.classList.remove('active')
    displayName.innerText = p1Name;
    displayName2.innerText = p2Name;
    document.querySelector('.input-name').value = '';
    document.querySelector('.input-name2').value = '';
  }

  const displaySelection = (e, p, whosGo) => {
    // Display selection on board, if whosGo 0 display 'O' else display 'X'
    whosGo === 0 ? e.target.innerText = p.getPlayerSymbol() : e.target.innerText = p.getPlayerSymbol();
  }
  
  const displayWinner = function(winner) {
      const modal = document.querySelector('.modal');
      const gameOverlay = document.createElement('div');
      gameOverlay.classList.add('overlay');
      const gameEndMsg = document.querySelector('.game-end-msg');
      modal.classList.add('active');
      document.body.appendChild(gameOverlay)
      winner === 'draw' ? gameEndMsg.innerText = 'It\'s a draw' : gameEndMsg.innerText = `Player: ${winner} Wins!!!`;
  }
  
  // Display ball to indicate whos go it is
  const showTurnBall = function() {
    if(displayName.classList.contains('active')) {
      displayName.classList.remove('active');
      displayName2.classList.add('active');
    } else {
      displayName2.classList.remove('active');
      displayName.classList.add('active') ;
    }
  }
  
  // Allow for switching sides so player can be 'O' or 'X'
  const swapSides = function() {
    let name1 = displayName.innerText;
    let name2 = displayName2.innerText;
    displayName.innerText = name2;
    displayName2.innerText = name1;
  }
  
  return {
    startGame,
    displaySelection,
    displayWinner,
    showTurnBall,
    swapSides,
  }
  
})()

const App = (function(GameCtrl, displayController) {
  const startBtn = document.querySelector('.add');
  const switchBtn = document.querySelector('.switch-btn');
  const resetBtn = document.querySelector('.reset-btn');
  const p1 = Player(document.querySelector('.input-name'), 'O');
  const p2 = Player(document.querySelector('.input-name2'), 'X');
  const gameBoardSquares = document.querySelectorAll('.gameBoardSquare');
  const playAgainBtn = document.querySelector('.play-again');



   // EVENT LISTENERS
  startBtn.addEventListener('click', () => {
    displayController.startGame(p1.getPlayerName().value, p2.getPlayerName().value);
    displayController.showTurnBall();
  });
  
  switchBtn.addEventListener('click', displayController.swapSides);
  
  resetBtn.addEventListener('click', () => {
    location.reload();
  });

  gameBoardSquares.forEach(gameBoardSquare => gameBoardSquare.addEventListener('click', (e) => {
    GameCtrl.playerClicked(e)
    GameCtrl.checkWin(GameCtrl.getBoardArr(), p1, p2)
  }));
  
  playAgainBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal');
    modal.classList.remove('active');
    GameCtrl.resetGame();
    gameBoardSquares.forEach(square => square.innerText = '');
    displayController.showTurnBall();
  });
  
  return {
    p1,
    p2
  }
  
})(GameCtrl, displayController)
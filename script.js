// Module: gameBoard
    const gameBoard = (() => {
      const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];

      const update = (row, col, marker) => {
        if (board[row][col] !== '') throw new Error("Cell taken");
        board[row][col] = marker;
      };

      const get = (row, col) => board[row][col];

      const hasWinner = () => {
        const win = (a, b, c) => a !== '' && a === b && b === c;

        for (let i = 0; i < 3; i++) {
          if (win(board[i][0], board[i][1], board[i][2])) return true;
          if (win(board[0][i], board[1][i], board[2][i])) return true;
        }
        if (win(board[0][0], board[1][1], board[2][2])) return true;
        if (win(board[0][2], board[1][1], board[2][0])) return true;

        return false;
      };

      const isFull = () => board.flat().every(cell => cell !== '');
      const reset = () => board.forEach(row => row.fill(''));

      return { update, get, hasWinner, isFull, reset };
    })();

    // Module: displayController
    const displayController = (() => {
      const boardDiv = document.getElementById('board');
      const status = document.getElementById('status');

      const render = () => {
        boardDiv.innerHTML = '';
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = gameBoard.get(row, col);
            if (cell.textContent !== '') cell.classList.add('disabled');
            boardDiv.appendChild(cell);
          }
        }
      };

      const setStatus = (msg) => status.textContent = msg;

      const disableBoard = () => {
        document.querySelectorAll('.cell').forEach(cell => cell.classList.add('disabled'));
      };

      return { render, setStatus, disableBoard };
    })();

    // Game controller
    const gameController = (() => {
      let currentPlayer = 'X';

      const handleClick = (e) => {
        if (!e.target.classList.contains('cell')) return;

        const row = +e.target.dataset.row;
        const col = +e.target.dataset.col;

        try {
          gameBoard.update(row, col, currentPlayer);
          displayController.render();

          if (gameBoard.hasWinner()) {
            displayController.setStatus(`${currentPlayer} wins!`);
            displayController.disableBoard();
            return;
          }

          if (gameBoard.isFull()) {
            displayController.setStatus(`It's a draw!`);
            return;
          }

          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          displayController.setStatus(`Turn: ${currentPlayer}`);
        } catch (err) {
          alert(err.message);
        }
      };

      const init = () => {
        displayController.render();
        displayController.setStatus(`Turn: ${currentPlayer}`);
        document.getElementById('board').addEventListener('click', handleClick);
      };

      return { init };
    })();

    // Start the game
    gameController.init();
import { useEffect, useReducer, useState } from 'react';

import './App.css';
import FinalGraph from './FinalGraph';
import GameBoard from './GameBoard';
import KeyPad from './KeyPad';
import { words } from './words';
const idx = Math.floor(Math.random() * words.length);
const word = words[idx];

const initialState: GameBoardState = {
  row0: [],
  row1: [],
  row2: [],
  row3: [],
  row4: [],
  row5: [],
};

const reducer = (state: GameBoardState, action: any) => {
  switch (action.type) {
    case 'row0':
      return {
        ...state,
        row0: action.payload,
      };
    case 'row1':
      return {
        ...state,
        row1: action.payload,
      };
    case 'row2':
      return {
        ...state,
        row2: action.payload,
      };
    case 'row3':
      return {
        ...state,
        row3: action.payload,
      };
    case 'row4':
      return {
        ...state,
        row4: action.payload,
      };
    case 'row5':
      return {
        ...state,
        row5: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [row, setRow] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [rowLevel, setRowLevel] = useState(0);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  const getInput = (idx: number, grid: string = '.gameboard') => {
    const board = document.querySelector(grid);
    const cell = board?.querySelector(`.game-row${rowLevel}`);
    const div = cell?.querySelector(`.item${idx}`);
    const input = div?.querySelector('input');
    return input;
  };

  const rowHandler = (key: string) => {
    if (row.length === 5) {
      return;
    }
    setError('');
    const index = row.length;
    const rowCopy = [...row];
    rowCopy[index] = key;
    setRow(rowCopy);
    const input = getInput(index);
    if (input) {
      input.value = key;
    }
  };

  const validateKey: ValidateKey = (w, l, i) => {
    if (w[i] === row[i]) {
      return 'green';
    } else if (w[i] !== row[i] && w.indexOf(l) > -1) {
      return 'yellow';
    } else {
      return 'grey';
    }
  };

  const submitHandler = () => {
    const result: ReturnType<ValidateKey>[] = [];
    row.forEach((letter, index) => {
      const style = validateKey(word, letter, index);
      const input = getInput(index);
      // const inputFinal = getInput(index, '.final__gameboard');

      if (input) {
        input.classList.add(style);
        // inputFinal.classList.add(style);
        result.push(style);
      }
    });
    if (row.length === 5) {
      if (row.join(',') === word) {
        setWin(true);
      }
      dispatch({ type: `row${rowLevel}`, payload: result });
      setRowLevel(rowLevel + 1);
      setRow([]);
    } else {
      setError('complete the row!');
    }
  };

  useEffect(() => {
    if (rowLevel > 5) {
      setLose(true);
    }
  }, [rowLevel]);

  const textRender = () => {
    if (error) {
      return error;
    }
    if (lose) {
      return `You Lose. The Word is ${word}!`;
    }

    if (win) {
      return 'You Win!';
    }

    return 'My TS Wordle';
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='header-text'>
          <button
            className='over'
            onClick={() => {
              setLose(true);
            }}
          >
            give up?
          </button>
          <h1>{textRender()}</h1>
          <button
            className='over'
            onClick={() => {
              window.location.reload();
            }}
          >
            start over
          </button>
        </div>
        <GameBoard />
        <KeyPad
          rowHandler={rowHandler}
          submitHandler={submitHandler}
          rowLevel={rowLevel}
        />
      </header>
    </div>
  );
}

export default App;

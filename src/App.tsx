import { ReactText, useEffect, useReducer, useState } from 'react';

import './App.css';
import FinalGraph from './FinalGraph';
import GameBoard from './GameBoard';
import KeyPad from './KeyPad';
import { words } from './words';
const idx = Math.floor(Math.random() * words.length);
const word = words[idx];
console.log(word);
const initialState: GameBoardState = {
  row0: [],
  row1: [],
  row2: [],
  row3: [],
  row4: [],
  row5: [],
  won: false,
};

const reducer = (state: GameBoardState, action: Action) => {
  switch (action.type) {
    case 'row0':
      return {
        ...state,
        row0: action.payload,
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row1':
      return {
        ...state,
        row1: action.payload,
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row2':
      return {
        ...state,
        row2: action.payload,
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row3':
      return {
        ...state,
        row3: action.payload,
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row4':
      return {
        ...state,
        row4: action.payload,
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row5':
      return {
        ...state,
        row5: action.payload,
        won: action.payload.every((word) => word === 'green'),
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
  const [lose, setLose] = useState(false);

  const getInput = (idx: number, grid: string = '.gameboard') => {
    const board = document.querySelector(grid);
    const row = board?.querySelector(`.game-row${rowLevel}`);
    const cell = row?.querySelector(`.item${idx}`);
    const input = cell?.querySelector('input');
    return input;
  };

  const rowHandler = (key: string) => {
    if (row.length === 5 || state.won) {
      return;
    }
    const index = row.length;
    const input = getInput(index);

    setError('');
    setRow([...row, key]);
    if (input) {
      input.value = key;
    }
  };

  const validateKey: ValidateKey = (word, letter, idx) => {
    if (word[idx] === row[idx]) {
      return 'green';
    } else if (word[idx] !== row[idx] && word.indexOf(letter) > -1) {
      return 'yellow';
    } else {
      return 'grey';
    }
  };

  const deleteHandler = (idx: number) => {
    // get the previous input
    const input = getInput(idx - 1);
    console.log({ input });
    // set the value back to ''
    if (input) {
      input.value = '';
    }
    // set the array correctly in state
    const temp = row.slice(0, idx - 1);
    console.log({ temp });
    setRow(temp);
  };

  const submitHandler = () => {
    const result: ReturnType<ValidateKey>[] = [];
    row.forEach((letter, index) => {
      const style = validateKey(word, letter, index);
      const input = getInput(index);
      // const inputFinal = getInput(index, '.final__gameboard');
      const button = document.querySelector(`#${letter}`);

      if (input) {
        input.classList.add(style);
        if (style === 'grey' && button) {
          button.classList.add(style);
        }
        // inputFinal.classList.add(style);
        result.push(style);
      }
    });
    if (row.length === 5) {
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
    const { won } = state;
    if (error) {
      return error;
    }
    if (won) {
      return 'You Win!';
    }
    if (lose) {
      return `You Lose. The Word is ${word}!`;
    }
    return 'My TS Wordle';
  };

  // TODO: add key handling
  // const keyHandler = (e: any) => {
  //   const abc = 'abcdefghijklmnopqrstuvwxyz';
  //   if (abc.indexOf(e.key) > -1) {
  //     rowHandler(e.key);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('keypress', keyHandler);
  //   return () => document.removeEventListener('keypress', keyHandler);
  // }, []);

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
          deleteHandler={deleteHandler}
          row={row}
        />
      </header>
    </div>
  );
}

export default App;

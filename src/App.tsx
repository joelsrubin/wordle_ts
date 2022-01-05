import { useEffect, useReducer, useState } from 'react';

import './App.css';
import FinalGraph from './FinalGraph';
import GameBoard from './GameBoard';
import KeyPad from './KeyPad';
import { words } from './words';

function returnWord() {
  const idx = Math.floor(Math.random() * words.length);
  const word = words[idx];
  return word;
}
const initialState: GameBoardState = {
  row0: [],
  row1: [],
  row2: [],
  row3: [],
  row4: [],
  row5: [],
  won: false,
  word: returnWord(),
};

// @ts-ignore
const reducer = (state: GameBoardState, action: any) => {
  switch (action.type) {
    case 'row0':
      return {
        ...state,
        row0: action.payload,
        // @ts-ignore
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row1':
      return {
        ...state,
        row1: action.payload,
        // @ts-ignore
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row2':
      return {
        ...state,
        row2: action.payload,
        // @ts-ignore
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row3':
      return {
        ...state,
        row3: action.payload,
        // @ts-ignore
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row4':
      return {
        ...state,
        row4: action.payload,
        // @ts-ignore
        won: action.payload.every((word) => word === 'green'),
      };
    case 'row5':
      return {
        ...state,
        row5: action.payload,
        // @ts-ignore
        won: action.payload.every((word) => word === 'green'),
      };
    case 'reset':
      return {
        ...initialState,
        word: returnWord(),
      };
    default:
      return {
        ...state,
      };
  }
};

const initialRowState: RowState = {
  row: [],
  rowLevel: 0,
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [rowInfo, setRowInfo] = useState<RowState>(initialRowState);
  const [error, setError] = useState('');
  const [lose, setLose] = useState(false);
  const { rowLevel, row } = rowInfo;

  const getInput = (idx: number, grid: string = '.gameboard') => {
    const board = document.querySelector(grid);
    const row = board?.querySelector(`.game-row${rowLevel}`);
    const cell = row?.querySelector(`.item${idx}`);
    return cell;
  };

  const rowHandler = (key: string) => {
    const btn = document.querySelector(`#${key}`);
    if (btn) {
      if (row.length === 5 || state.won || btn.classList.contains('grey')) {
        return;
      }
    }
    const index = row.length;
    const input = getInput(index);

    setError('');
    setRowInfo({ ...rowInfo, row: [...row, key] });
    if (input) {
      input.innerHTML = key;
      input.classList.add('text');
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
    const input = getInput(idx - 1);
    if (input) {
      input.innerHTML = '';
      input.classList.remove('text');
    }
    const temp = row.slice(0, idx - 1);
    setRowInfo({ ...rowInfo, row: temp });
  };

  // complete reset //

  const resetHandler = () => {
    //dispatch a reset
    dispatch({ type: 'reset', payload: ['green'] });
    setRowInfo(initialRowState);
    const tiles = document.querySelectorAll('.item');
    const keys = document.querySelector('.keypad')?.querySelectorAll('button');
    keys?.forEach((key) => {
      key.classList.remove('grey');
    });
    tiles.forEach((node) => {
      node.innerHTML = '';
      node.classList.remove('text');
      node.classList.remove('grey');
      node.classList.remove('yellow');
      node.classList.remove('green');
    });
    setError('');
    setLose(false);
  };

  const submitHandler = () => {
    const result: ReturnType<ValidateKey>[] = [];
    row.forEach((letter, index) => {
      const style = validateKey(state.word, letter, index);
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
      setRowInfo({ row: [], rowLevel: rowLevel + 1 });
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
    const { won, word } = state;
    if (error) {
      return error;
    }
    if (won) {
      return 'You Win!';
    }
    if (lose) {
      return `You Lose. The Word is ${word}!`;
    }
    return 'Wordler';
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
              resetHandler();
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

import { useEffect, useReducer, useRef, useState } from 'react';

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

const wordHandler = (w: string) => {
  return w.split('').reduce((acc: any, val) => {
    acc[val] = acc[val] + 1 || 1;
    return acc;
  }, {});
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { won, word } = state;
  const initialWordObj = wordHandler(word);

  const [rowInfo, setRowInfo] = useState<RowState>(initialRowState);
  const [wordObject, setWordObject] = useState<WordObject>(initialWordObj);
  const [error, setError] = useState('');
  const [lose, setLose] = useState(false);
  const { rowLevel, row } = rowInfo;
  const curRow = document.querySelector(`.game-row${rowLevel}`);

  const getInput = (idx: number, grid: string = '.gameboard') => {
    const board = document.querySelector(grid);
    const row = board?.querySelector(`.game-row${rowLevel}`);
    const cell = row?.querySelector(`.item${idx}`);
    return cell;
  };

  const rowHandler = (e: any, key: string) => {
    // TODO: Fix Keybindings
    // console.log(key);
    // if (key === 'Enter') {
    //   console.log('here');
    //   return submitHandler();
    // }

    // if (key === 'Delete') {
    //   e.preventDefault();
    //   return deleteHandler(curIdx);
    // }
    // // handle key bindings -> only allow letter keys
    // const abc = 'abcdefghijklmnopqrstuvwxyz';
    // if (abc.indexOf(key) < 0) {
    //   return;
    // }

    curRow?.classList.remove('incorrect');
    const btn = document.querySelector(`#${key}`);
    if (btn) {
      if (row.length === 5 || won || lose) {
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

  /**
   * Takes in a word, letter and index:
   * - If the word and the row have the same letter at the same index -> return 'green'.
   * - If the word has the letter but not the same index -> return 'yellow'.
   * - otherwise return 'grey' (word doesn't contain the letter)
   * @param word
   * @param letter
   * @param idx
   * @returns string
   */
  const validateKeyColor: ValidateKey = (word, letter, idx) => {
    if (word[idx] === row[idx]) {
      return 'green';
    } else if (word[idx] !== row[idx] && word.indexOf(letter) > -1) {
      return 'yellow';
    } else {
      return 'grey';
    }
  };

  /**
   * Gets the letter in the space before the current index
   *  - reverts the class
   *  - removes text
   *  - sets curRow to updated row with deleted char
   * @param idx
   */
  const deleteHandler = (idx: number) => {
    const input = getInput(idx - 1);
    if (input) {
      input.innerHTML = '';
      input.classList.remove('text');
    }
    const temp = row.slice(0, idx - 1);
    setRowInfo({ ...rowInfo, row: temp });
  };

  /**
   * The Reset
   * - If no rows have been attempted, abort the reset
   * - otherwise -> dispatch reset to reducer
   * - reset all tiles to initial class state
   * - reset all keys to initial class state
   * - reset error state and lose state
   * @returns
   */
  const resetHandler = () => {
    const { row0 } = state;

    // if we haven't given up & we haven't attempted one row -> abort
    if (!row0.length && !lose) {
      return;
    }
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

  /**
   * func to ensure that we only color code letters according to their frequency
   * @param key
   * @returns boolean
   */
  const letterValidate = (key: string) => {
    if (wordObject[key] > 0) {
      setWordObject({ ...wordObject, [key]: (wordObject[key] -= 1) });
      return true;
    }
    return false;
  };

  /**
   * Handler for submitting each row to reducer:
   * - if the row isn't complete, abort submission and return error state
   * - If the row's word isn't listed in 'dictionary' return error state
   * - otherwise:
   * - validate each letter first against color status
   * - then validate letters by frequency against counting object
   * - finally submit row to reducer only if row is complete
   * @returns
   */
  const submitHandler = () => {
    if (row.length < 5) {
      setError('complete the row!');
      return;
    }
    // if the word isn't listed return an error
    if (row.length && words.indexOf(row.join('')) < 0) {
      setError('Unlisted Word!');
      curRow?.classList.add('incorrect');
      return;
    }

    // create the return array to dispatch to the reducer
    const result: ReturnType<ValidateKey>[] = [];
    row.forEach((letter, index) => {
      const style = validateKeyColor(word, letter, index);
      const input = getInput(index);
      // const inputFinal = getInput(index, '.final__gameboard');
      const button = document.querySelector(`#${letter}`);

      if (input) {
        if (
          letterValidate(letter) ||
          (!letterValidate(letter) && style === 'grey')
        ) {
          input.classList.add(style);
        }

        if (style === 'grey' && button) {
          button.classList.add(style);
        }
        // inputFinal.classList.add(style);
        result.push(style);
      }
    });

    dispatch({ type: `row${rowLevel}`, payload: result });
    setRowInfo({ row: [], rowLevel: rowLevel + 1 });
  };

  // set Lose to true if we didn't get the answer within 5 guesses
  useEffect(() => {
    if (rowLevel > 5) {
      setLose(true);
    }

    // every time we increment the level -> setWordObj back to initial word object in order to validate letterCount for each row
    setWordObject(initialWordObj);
  }, [rowLevel]);

  useEffect(() => {
    // if lose or won -> setWordObject to the new word set by reducer
    setWordObject(wordHandler(word));
    if (lose && error) {
      setError('');
    }
  }, [lose, won]);

  // TODO: Fix Keybindings
  // useEffect(() => {
  //   document.addEventListener('keypress', (e) => rowHandler(e, e.key));
  // }, []);

  const textRender = () => {
    if (error) {
      return error;
    }
    if (won) {
      return 'You Win!';
    }
    if (lose) {
      return `You Lose. The Word is ${word}!`;
    }
    return 'WORDLER';
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
          <h3>{textRender()}</h3>
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

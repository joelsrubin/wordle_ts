import { useEffect, useReducer, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { isMobile } from 'react-device-detect';
import './App.css';
import GameBoard from './GameBoard';
import KeyPad from './KeyPad';
import Results from './Results';
import { words, dictionary } from './words';
import useWindowSize from 'react-use/lib/useWindowSize';
import { FiSettings } from 'react-icons/Fi';
import Confetti from 'react-confetti';
import Settings from './Settings';

function returnWord() {
  const idx = Math.floor(Math.random() * words.length);
  const word = words[idx];
  return word;
}

const initialState: GameBoardState = {
  word: returnWord(),
};

const reducer = (state: GameBoardState, action: Action) => {
  switch (action.type) {
    case 'reset':
      return {
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

// creates a counting object for comparison in letter val
const wordHandler = (w: string) => {
  return w.split('').reduce((acc: any, val) => {
    acc[val] = acc[val] + 1 || 1;
    return acc;
  }, {});
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { word } = state;
  const initialWordObj = wordHandler(word);
  const { width, height } = useWindowSize();
  const [wordObject, setWordObject] = useState<WordObject>(initialWordObj);
  const [rowInfo, setRowInfo] = useState<RowState>(initialRowState);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const { rowLevel, row } = rowInfo;

  const curRow = document.querySelector(`.game-row${rowLevel}`);

  const getInput = (idx: number) => {
    const board = document.querySelector('.gameboard');
    const row = board?.querySelector(`.game-row${rowLevel}`);
    const cell = row?.querySelector(`.item${idx}`);
    return cell;
  };

  const rowHandler = (key: string) => {
    // TODO: Fix Keybindings

    if (key === 'Enter') {
      console.log('here');
      return submitHandler();
    }

    // if (key === 'Delete') {
    //   e.preventDefault();
    //   return deleteHandler(curIdx);
    // }
    // handle key bindings -> only allow letter keys

    curRow?.classList.remove('incorrect');
    const btn = document.querySelector(`#${key}`);
    if (hardMode && btn?.classList.contains('grey')) {
      toast.error("You can't use that letter in hard mode!");
      return;
    }
    if (btn) {
      if (row.length === 5 || won || lost) {
        return;
      }
    }
    const index = row.length;
    const input = getInput(index);
    const newRow = row.concat(key);

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
    if (!word.includes(letter)) {
      return 'grey';
    }
    if (word[idx] === row[idx]) {
      return 'green';
    } else if (word[idx] !== row[idx] && word.indexOf(letter) > -1) {
      return 'yellow';
    } else {
      return '';
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
   * - reset error state and lost state
   * @returns
   */
  const resetHandler = () => {
    toast.dismiss('streak');
    setWon(false);
    // if we haven't given up & we haven't attempted one row -> abort
    // if (!row.length && !lost) {
    //   return;
    // }
    dispatch({ type: 'reset' });
    setRowInfo(initialRowState);
    const tiles = document.querySelectorAll('.item');
    const keys = document.querySelector('.keypad')?.querySelectorAll('button');
    keys?.forEach((key) => {
      key.classList.remove('grey');
      key.classList.remove('green');
    });
    tiles.forEach((node) => {
      node.innerHTML = '';
      node.classList.remove('text');
      node.classList.remove('grey');
      node.classList.remove('yellow');
      node.classList.remove('green');
    });

    setLost(false);
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

  // word is A G R E S S
  // we have E G R E S S
  // first E could be yellow but let's check if rest have a green that is === E
  const greenLater = (key: string, row: string[], startingIndex: number) => {
    for (let i = startingIndex + 1; i < row.length; i++) {
      // so starting one space ahead, check if this key is green elsewhere and if so return true
      if (word[i] === key && row[i] === key) {
        return true;
      }
    }
    // otherwise never green again, so return false
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
      toast.error("You haven't completed the row!", { duration: 2000 });
      return;
    }
    // if the word isn't listed return an error
    if (
      row.length &&
      !dictionary.includes(row.join('')) &&
      !words.includes(row.join(''))
    ) {
      toast.error('Unlisted Word!', { duration: 2000 });
      curRow?.classList.add('incorrect');
      return;
    }

    row.forEach((letter, index) => {
      const style = validateKeyColor(word, letter, index);
      const input = getInput(index);
      // const inputFinal = getInput(index, '.final__gameboard');
      const button = document.querySelector(`#${letter}`);

      if (input) {
        if (
          // check if letter is valid (not 0 left) and it isn't green later -> if it's green later we can make it yellow but if it's green later we can't make it yellow
          (letterValidate(letter) && !greenLater(letter, row, index)) ||
          // also check if it's invalid but style is grey -> still set grey
          (!letterValidate(letter) && style === 'grey')
        ) {
          input.classList.add(style);
          // check if it's invalid but style is yellow -> set style to grey as we no longer have any letters left in the count so we've already assigned all yellows available
        } else if (!letterValidate(letter) && style === 'yellow') {
          input.classList.add('grey');
          // check if letter is invalid but green -> this means the user has entered too many of that letter but it's green later
        } else if (!letterValidate(letter) && style === 'green') {
          input.classList.add('green');
        }

        if ((style === 'green' && button) || (style === 'grey' && button)) {
          button.classList.add(style);
        }
      }
    });
    if (row.join('') === word) {
      setWon(true);
    }

    setRowInfo({ row: [], rowLevel: rowLevel + 1 });
  };

  // TODO: add key handling
  // const keyHandler = (e: any) => {
  //   const abc = 'abcdefghijklmnopqrstuvwxyz';
  //   if (abc.indexOf(e.key) > -1) {
  //     console.log(e.key);
  //     rowHandler(e.key);
  //   }
  // };

  // set Lost to true if we didn't get the answer within 5 guesses
  useEffect(() => {
    if (rowLevel > 5) {
      setLost(true);
    }
    // every time we increment the level -> setWordObj back to initial word object in order to validate letterCount for each row
    setWordObject(initialWordObj);
  }, [rowLevel]);

  useEffect(() => {
    // if lost or won -> setWordObject to the new word set by reducer
    setWordObject(wordHandler(word));
  }, [lost, won]);

  // useEffect(() => {
  //   document.addEventListener('keypress', keyHandler);
  // }, []);

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const winOrLost = won || lost;
  return (
    <>
      <header className='App-header'>
        {winOrLost && (
          <>
            {won && <Confetti width={width} height={height} recycle={false} />}
            <Results won={won} lost={lost} word={word} />
          </>
        )}
        <div className='header-text'>
          <button
            className='over'
            onClick={() => {
              setLost(true);
            }}
            disabled={winOrLost}
          >
            give up?
          </button>
          <h3>WORDLER</h3>
          {/* <FiSettings
            style={{
              alignSelf: 'center',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
            onClick={handleSettings}
          /> */}
          {/* {showSettings && (
            <Settings setHardMode={setHardMode} hardMode={hardMode} />
          )} */}
          <button
            className={winOrLost ? 'over reset' : 'over'}
            onClick={() => {
              resetHandler();
            }}
          >
            new game
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
        <footer>
          <div>
            <h5>
              &copy;{' '}
              <a href='https://www.joelrubin.dev' target='_blank'>
                Joel Rubin 2022
              </a>
            </h5>
          </div>
          <div>
            <h5>
              Inspired by the original:{' '}
              <a href='https://www.powerlanguage.co.uk/wordle/' target='_blank'>
                Wordle
              </a>
            </h5>
          </div>
        </footer>
      </header>
      <Toaster
        containerStyle={
          isMobile
            ? {
                top: 65,
              }
            : {
                top: 100,
              }
        }
      />
    </>
  );
}

export default App;

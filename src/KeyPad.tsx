import { FiDelete } from 'react-icons/Fi';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'DEL'],
];

const KeyPad: React.FC<KeyPadProps> = ({
  rowHandler,
  submitHandler,
  rowLevel,
}) => {
  return (
    <div className='keypad__wrapper'>
      <div className='keypad'>
        {keys.map((rows, i) => (
          <div key={i} className='row'>
            {rows.map((key, i) => (
              <button
                key={key}
                className={
                  key === 'ENTER' || key === 'DEL' ? 'long-key' : 'key'
                }
                onClick={
                  key === 'ENTER'
                    ? () => submitHandler(rowLevel)
                    : () => rowHandler(key)
                }
              >
                {key === 'DEL' ? (
                  <FiDelete style={{ fontSize: '20px' }} />
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyPad;

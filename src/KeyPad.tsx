import { FiDelete } from 'react-icons/fi';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'DEL'],
];

const KeyPad: React.FC<KeyPadProps> = ({
  rowHandler,
  submitHandler,
  rowLevel,
  deleteHandler,

  row,
}) => {
  return (
    <div className="keypad">
      {keys.map((rows, i) => (
        <div key={i} className={`row row${i}`}>
          {rows.map((key, i) => (
            <button
              key={key}
              id={key}
              className={key === 'ENTER' || key === 'DEL' ? 'long-key' : 'key'}
              onClick={
                key === 'ENTER'
                  ? () => submitHandler(rowLevel)
                  : key === 'DEL'
                  ? () => deleteHandler(row.length)
                  : () => rowHandler(key)
              }
            >
              {key === 'DEL' ? <FiDelete style={{ fontSize: '20px' }} /> : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KeyPad;

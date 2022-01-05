const GameBoard: React.FC<GameBoardProps> = ({
  height = 50,
  width = 50,
  className = 'gameboard',
}) => {
  const rows = Array(6).fill(Array(5).fill(''));

  return (
    <div className='gameboard__wrapper'>
      <div className={className}>
        {rows.map((row, i) => (
          <div key={i} className={`game-row game-row${i}`}>
            {row.map((_: any, j: number) => (
              <div key={j} className={`item item${j}`}>
                {_}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

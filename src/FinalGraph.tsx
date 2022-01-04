import GameBoard from './GameBoard';

type FinalProps = {
  over: boolean;
};

const FinalGraph: React.FC<FinalProps> = ({ over }) => {
  return (
    <div
      className={
        over ? `final__gameboard__wrapper__show` : 'final__gameboard__wrapper'
      }
    >
      <GameBoard height={25} width={25} className='final__gameboard' />
    </div>
  );
};

export default FinalGraph;

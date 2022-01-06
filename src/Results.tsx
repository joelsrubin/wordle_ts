import { useEffect, useState } from 'react';
const Results: React.FC<ResultsProps> = ({ won, lose }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const streak = localStorage.getItem('streak');
    winLoseHandler(streak ?? '0');
  }, []);

  const winLoseHandler = (streak: string) => {
    if (won) {
      localStorage.setItem('streak', String(Number(streak) + 1));
      setScore(Number(streak) + 1);
    }
    if (lose) {
      localStorage.setItem('streak', '0');
      setScore(0);
    }
  };

  return (
    <div className='results'>
      <h3>Streak is at {score || 0}</h3>
    </div>
  );
};

export default Results;

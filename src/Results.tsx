import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
const Results: React.FC<ResultsProps> = ({ won, lose }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const streak = localStorage.getItem('streak');
    winLoseHandler(streak ?? '0');
  }, []);

  const winLoseHandler = (streak: string) => {
    if (won) {
      localStorage.setItem('streak', String(Number(streak) + 1));
      toast.success('Nice! Streak is now: ' + (Number(streak) + 1), {
        icon: '👏',
      });
    }
    if (lose) {
      localStorage.setItem('streak', '0');
      toast.error('You lost! Streak is now: 0');
      setScore(0);
    }
  };

  return <></>;
};

export default Results;

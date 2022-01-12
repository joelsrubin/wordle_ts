import { useEffect } from 'react';
import toast from 'react-hot-toast';
const Results: React.FC<ResultsProps> = ({ won, lost, word }) => {
  useEffect(() => {
    const streak = localStorage.getItem('streak');
    winLostHandler(streak ?? '0');
  }, []);

  const winLostHandler = (streak: string) => {
    if (won) {
      localStorage.setItem('streak', String(Number(streak) + 1));
      toast.success('Nice! Streak is now: ' + (Number(streak) + 1), {
        icon: '👏',
        duration: Infinity,
        id: 'streak',
      });
    }
    if (lost) {
      localStorage.setItem('streak', '0');
      toast.error(`The word was ${word}! Streak is now: 0`, {
        duration: Infinity,
        id: 'streak',
      });
    }
  };

  return <></>;
};

export default Results;

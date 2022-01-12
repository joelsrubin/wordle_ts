type SetFunc = (val: boolean) => void;

type SettingsProps = {
  setHardMode: SetFunc;
  hardMode: boolean;
};

const Settings: React.FC<SettingsProps> = ({ setHardMode, hardMode }) => {
  const handleClick = () => {
    setHardMode(!hardMode);
  };

  return (
    <div className='overlay'>
      <div className='custom_toast'>
        <input type='checkbox' onChange={handleClick} checked={hardMode} />
        <span>Hard Mode - not allowed to use absent letters!</span>
      </div>
    </div>
  );
};

export default Settings;

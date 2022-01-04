type GameBoardState = {
  [key: string]: string[];
};

type KeyPadProps = {
  rowHandler: (val: string) => void;
  submitHandler: (rowLevel: number) => void;
  rowLevel: number;
};

type GameBoardProps = {
  height?: number;
  width?: number;
  className?: string;
};

type ValidateKey = (
  w: string,
  l: string,
  index: number
) => 'green' | 'yellow' | 'grey';

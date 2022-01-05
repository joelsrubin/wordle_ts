type GameBoardState = {
  [key: string]: string[] | boolean;
};

type KeyPadProps = {
  rowHandler: (val: string) => void;
  submitHandler: (rowLevel: number) => void;
  rowLevel: number;
  deleteHandler: (idx: number) => void;

  row: string[];
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

type Action = {
  type: string;
  payload: ReturnType<ValidateKey>[];
};

type RowState = {
  row: string[];
  rowLevel: number;
};

type GameBoardState = {
  row0: [];
  row1: [];
  row2: [];
  row3: [];
  row4: [];
  row5: [];
  won: boolean;
  word: string;
};

type KeyPadProps = {
  rowHandler: (e: any, val: string) => void;
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

type WordObject = {
  [key: string]: number;
};

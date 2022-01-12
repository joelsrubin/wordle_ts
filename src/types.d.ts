type GameBoardState = {
  word: string;
};

type KeyPadProps = {
  rowHandler: (key: string) => void;
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
) => 'green' | 'yellow' | 'grey' | '';

interface ActionsWithPayload<TypeAction, TypePayload> {
  type: TypeAction;
  payload: TypePayload;
}

type RowState = {
  row: string[];
  rowLevel: number;
};

type WordObject = {
  [key: string]: number;
};

type ResultsProps = {
  won: boolean;
  lost: boolean;
  word: string;
};

type Action = {
  type: 'reset' | '';
};

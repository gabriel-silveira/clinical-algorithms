import { dia } from '@joint/core';

export const GRAPH_MODE_PUBLIC = 'public';
export const GRAPH_MODE_PRINT = 'print';
export const GRAPH_MODE_EDIT = 'edit';

export interface IJointData {
  public: boolean,
  isMaintainer: boolean,
  readOnly: boolean,
  showSaveDialog: boolean,
  options: {
    width: number,
    height: number,
  },
  paper: dia.Paper | undefined,
  graph: dia.Graph,
}

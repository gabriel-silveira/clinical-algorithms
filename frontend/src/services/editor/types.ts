import { dia } from 'jointjs';

export const GRAPH_MODE_PUBLIC = 'public';
export const GRAPH_MODE_PRINT = 'print';
export const GRAPH_MODE_EDIT = 'edit';

export interface IJointData {
  isMaintainer: boolean,
  readOnly: boolean,
  showSaveDialog: boolean,
  paper: dia.Paper | undefined,
  graph: dia.Graph,
}

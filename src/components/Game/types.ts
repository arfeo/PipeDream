export interface IElementMapItem {
  type: number;
  direction: number;
  position: IPosition;
  locked: boolean;
}

export interface INextElement {
  nextRow: number;
  nextColumn: number;
  nextEnt: number;
}

export interface IPosition {
  row: number;
  column: number;
}

export interface IExpectedElements {
  type: number;
  direction: number;
}

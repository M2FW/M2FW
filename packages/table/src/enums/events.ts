export enum Events {
  SelectorSelectAll = 'selectAll',
  SelectorDeselectAll = 'deselectAll',

  RowSelected = 'rowSelected',
  RowDeselected = 'rowDeselected',

  RowClick = 'rowClick',
  RowDblClick = 'rowDblClick',
}

/** Cell Events */
export enum CellEvents {
  CellDblclick = 'cellDblClick',

  ModeChange = 'modeChange',
  FocusChange = 'focusChange',
  CellValueChange = 'valueChange',
  ColumnWidthChange = 'columnWidthChange',

  ValidationFailed = 'validationFailed',

  HeaderCellValueChange = 'headerCellValueChange',

  EditNextRow = 'editNextRow',
  EditNextColumn = 'editNextColumn',
}

export enum HeaderEvents {
  SortChanged = 'sortChanged',
}

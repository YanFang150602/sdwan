const columns = [
  {
    width: 36,
    titleAlign: 'center',
    columnAlign: 'center',
    type: 'selection'
  },
  {
    field: 'name',
    title: 'User Name',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true,
    componentName: 'vTableName'
  },
  {
    field: 'firstname',
    title: 'First Name',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'lastname',
    title: 'Last Name',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'primaryRole',
    title: 'Primary Role',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

export { columns };

const columns = [
  {
    width: 36,
    titleAlign: 'center',
    columnAlign: 'center',
    type: 'selection'
  },
  {
    field: 'name',
    title: 'Name',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true,
    componentName: 'vTableName'
  },
  {
    field: 'description',
    title: 'Description',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'zoneProtectProfile',
    title: 'Zone Protection Profile',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

export { columns };

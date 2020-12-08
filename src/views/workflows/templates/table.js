const columns = [
  {
    width: 36,
    titleAlign: 'center',
    columnAlign: 'center',
    type: 'selection'
  },
  {
    field: 'templateName',
    title: 'Name',
    width: 50,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true,
    componentName: 'vTableName'
  },
  {
    field: 'workflowStatus',
    title: 'Status',
    width: 50,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'lastModifiedTime',
    title: 'Last Modified By',
    width: 50,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'lastModifiedBy',
    title: 'Last Modified By',
    width: 50,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

export { columns };

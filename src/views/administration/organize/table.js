const columns = [
  {
    width: 36,
    titleAlign: 'center',
    columnAlign: 'center',
    field: 'checked',
    type: 'selection'
  },
  {
    field: 'orgName',
    title: 'Name',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true,
    componentName: 'vTableName'
  },
  {
    field: 'globalOrgId',
    title: 'Global Organization ID',
    width: 245,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'workflowStatus',
    title: 'Status',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'lastModifiedTime',
    title: 'Last Modified Date',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'lastModifiedBy',
    title: 'Last Modified By',
    width: 246,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

export { columns };

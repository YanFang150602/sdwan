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
    field: 'logProfile',
    title: 'Log Profile',
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
  },
  {
    field: 'interfaceList',
    title: 'Interface List',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'routingInstance',
    title: 'Routing Instance',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'networks',
    title: 'Networks',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'org',
    title: 'Org',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

export { columns };

const ethernetColumns = [
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
    componentName: 'table-operation'
  },
  {
    field: 'interfaces',
    title: 'Interfaces',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipAddress',
    title: 'Ip Address/Prefix',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

const pseudoColumns = [
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
    componentName: 'table-operation'
  },
  {
    field: 'parentInterface',
    title: 'Parent Interfaces',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'remoteAddress',
    title: 'Remote IP Address',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'enable',
    title: 'Enable / Disable',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

const TunnelColumns = [
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
    componentName: 'table-operation'
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
    field: 'ipadress',
    title: 'Remote IP Address',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'mtu',
    title: 'MTU',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'type',
    title: 'Type',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

const TunnelAddColumns = [
  {
    width: 36,
    titleAlign: 'center',
    columnAlign: 'center',
    type: 'selection'
  },
  {
    field: 'name',
    title: 'Unit',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true,
    componentName: 'table-operation'
  },
  {
    field: 'inet4',
    title: 'IPv4',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'inet6',
    title: 'IPv6',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];
export { ethernetColumns, pseudoColumns, TunnelColumns, TunnelAddColumns };

const columns = [
  {
    width: 36,
    field: 'checked',
    columnAlign: 'center',
    type: 'selection'
  },
  {
    field: 'name',
    width: 50,
    columnAlign: 'left',
    isResize: true,
    componentName: 'vTableName'
  },
  {
    field: 'ftcp',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'fudp',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'ficmp',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'fotherip',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'fsctp',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'ficmpv6',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'stcp',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'sudp',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  },
  {
    field: 'hostsweep',
    width: 50,
    columnAlign: 'left',
    componentName: 'vTableCheck',
    isResize: true
  }
];
const titleRows = [
  [
    {
      fields: ['checked'],
      title: '',
      titleAlign: 'center',
      componentName: 'vTableCheck',
      rowspan: 2
    },
    {
      fields: ['name'],
      title: 'Name',
      titleAlign: 'center',
      componentName: 'vTableCheck',
      rowspan: 2
    },
    {
      fields: ['ftcp', 'fudp', 'ficmp', 'fotherip', 'fsctp', 'ficmpv6'],
      title: 'Flood Protection Profile',
      titleAlign: 'center',
      colspan: 6
    },
    {
      fields: ['stcp', 'sudp', 'hostsweep'],
      title: 'Scan Protection Profile',
      titleAlign: 'center',
      colspan: 3
    }
  ],
  [
    {
      fields: ['ftcp'],
      title: 'TCP',
      titleAlign: 'left'
    },
    {
      fields: ['fudp'],
      title: 'UDP',
      titleAlign: 'left'
    },
    {
      fields: ['ficmp'],
      title: 'ICMP',
      titleAlign: 'left'
    },
    {
      fields: ['fotherip'],
      title: 'Other IP',
      titleAlign: 'left'
    },
    {
      fields: ['fsctp'],
      title: 'SCTP',
      titleAlign: 'left'
    },
    {
      fields: ['ficmpv6'],
      title: 'ICMPv6',
      titleAlign: 'left'
    },
    {
      fields: ['stcp'],
      title: 'TCP',
      titleAlign: 'left'
    },
    {
      fields: ['sudp'],
      title: 'UDP',
      titleAlign: 'left'
    },
    {
      fields: ['hostsweep'],
      title: 'Host Sweep',
      titleAlign: 'left'
    }
  ]
];

export { columns, titleRows };

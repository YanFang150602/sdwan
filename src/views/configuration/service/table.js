const serviceColumns = [
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
    componentName: 'table-operationDevice'
  },
  {
    field: 'protocol',
    title: 'protocol',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'protocolVlue',
    title: 'protocolVlue',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'Port',
    title: 'Port',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'sourcePort',
    title: 'sourcePort',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'destinationPort',
    title: 'Destination Port',
    width: 100,
    titleAlign: 'left',
    columnAlign: 'left',
    isResize: true
  }
];

export { serviceColumns };

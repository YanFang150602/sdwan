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
    field: 'action',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'qosProfile',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'predefinedServicesList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'predefinedApplicationList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'predefined',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'sourceZoneList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'sourceRegion',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'sourceAddressList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'sourceAddressGroupList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'destinationZoneList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'destinationRegion',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'destinationAddressList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'destinationAddressGroupList',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipVersion',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipFlags',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'dscp',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'eq',
    width: 50,
    columnAlign: 'left',
    isResize: true
  }
];
const titleRows = [
  [
    {
      fields: ['checked'],
      title: '',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['name'],
      title: 'Name',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['action', 'qosProfile'],
      title: 'Enforce',
      titleAlign: 'center',
      colspan: 2
    },
    {
      fields: ['predefinedServicesList'],
      title: 'Services',
      titleAlign: 'left',
      rowspan: 2
    },
    {
      fields: ['predefinedApplicationList'],
      title: 'Applications',
      titleAlign: 'left',
      rowspan: 2
    },
    {
      fields: ['predefined'],
      title: 'URL Categories',
      titleAlign: 'left',
      rowspan: 2
    },
    {
      fields: [
        'sourceZoneList',
        'sourceRegion',
        'sourceAddressList',
        'sourceAddressGroupList'
      ],
      title: 'Source',
      titleAlign: 'center',
      colspan: 4
    },
    {
      fields: [
        'destinationZoneList',
        'destinationRegion',
        'destinationAddressList',
        'destinationAddressGroupList'
      ],
      title: 'Destination',
      titleAlign: 'center',
      colspan: 4
    },
    {
      fields: ['ipVersion'],
      title: 'IP Version',
      titleAlign: 'left',
      rowspan: 2
    },
    {
      fields: ['ipFlags'],
      title: 'IP Flags',
      titleAlign: 'left',
      rowspan: 2
    },
    {
      fields: ['dscp'],
      title: 'DSCP',
      titleAlign: 'left',
      rowspan: 2
    },
    {
      fields: ['eq'],
      title: 'TTL',
      titleAlign: 'left',
      rowspan: 2
    }
  ],
  [
    {
      fields: ['action'],
      title: 'Action',
      titleAlign: 'left'
    },
    {
      fields: ['qosProfile'],
      title: 'QoS Profiles',
      titleAlign: 'left'
    },
    {
      fields: ['sourceZoneList'],
      title: 'Zone',
      titleAlign: 'left'
    },
    {
      fields: ['sourceRegion'],
      title: 'Region',
      titleAlign: 'left'
    },
    {
      fields: ['sourceAddressList'],
      title: 'Address',
      titleAlign: 'left'
    },
    {
      fields: ['sourceAddressGroupList'],
      title: 'Address Group',
      titleAlign: 'left'
    },
    {
      fields: ['destinationZoneList'],
      title: 'Zone',
      titleAlign: 'left'
    },
    {
      fields: ['destinationRegion'],
      title: 'Region',
      titleAlign: 'left'
    },
    {
      fields: ['destinationZoneList'],
      title: 'Address',
      titleAlign: 'left'
    },
    {
      fields: ['destinationAddressGroupList'],
      title: 'Address Group',
      titleAlign: 'left'
    }
  ]
];

export { columns, titleRows };

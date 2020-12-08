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
    field: 'setAction',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'setQosProfile',
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
    field: 'destinationMacAddressType',
    width: 50,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipVersion',
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
      fields: ['setAction', 'setQosProfile'],
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
        'destinationAddressGroupList',
        'destinationMacAddressType'
      ],
      title: 'Destination',
      titleAlign: 'center',
      colspan: 5
    },
    {
      fields: ['ipVersion'],
      title: 'IP Version',
      titleAlign: 'left',
      rowspan: 2
    }
  ],
  [
    {
      fields: ['setAction'],
      title: 'Action',
      titleAlign: 'left'
    },
    {
      fields: ['setQosProfile'],
      title: 'QoSProfiles',
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
    },
    {
      fields: ['destinationMacAddressType'],
      title: 'MAC Address Type',
      titleAlign: 'left'
    }
  ]
];

export { columns, titleRows };

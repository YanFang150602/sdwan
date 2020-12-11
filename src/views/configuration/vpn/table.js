const columns = [
  {
    field: 'checked',
    width: 36,
    columnAlign: 'center',
    titleAlign: 'center',
    type: 'selection'
  },
  {
    field: 'name',
    title: 'VPN Profile',
    width: 120,
    columnAlign: 'left',
    isResize: true,
    componentName: 'vpncfgfile-opration'
  },
  {
    field: 'vpnType',
    title: 'VPN Type',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'local-aih',
    title: 'Local IP/Interface/Hostname',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'peer-ifh',
    title: 'Peer IP/FQDN/Hostname',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'localAuthInfo-authType',
    title: 'Auth Type',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'localAuthInfo-authInfo',
    title: 'Auth Info',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'peerAuthInfo-authType',
    title: 'Auth Type',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'peerAuthInfo-authInfo',
    title: 'Auth Info',
    width: 100,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'pskAuthClients',
    title: 'Psk Auth Clients',
    width: 100,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'rules',
    title: 'Rules',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'routingInstance',
    title: 'Routing Instance',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'tunnelInterface',
    title: 'Tunnel Interface',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'tunnelInitiate',
    title: 'Tunnel Initiate',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipsec-fragmentation',
    title: 'Fragmentation',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipsec-forceNatT',
    title: 'Force NAT-T Configuration',
    width: 180,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipsec-encryptionAlgorithms',
    title: 'Encryption and Hashing Algorithm',
    width: 200,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipsec-mode',
    title: 'Mode',
    width: 100,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipsec-pfsGroup',
    title: 'Forward Secrecy Mode',
    width: 140,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ipsec-antiReplay',
    title: 'Anti Replay',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ike-version',
    title: 'IKE Version',
    width: 120,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ike-mode',
    title: 'DH Mode',
    width: 100,
    columnAlign: 'left',
    isResize: true
  },
  {
    field: 'ike-encryptionAlgorithms',
    title: 'Encryption and Hashing Algorithm',
    width: 200,
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
      title: 'VPN Profile',
      titleAlign: 'center',
      componentName: 'vpncfgfile-opration',
      rowspan: 2
    },
    {
      fields: ['vpnType'],
      title: 'VPN Type',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['local-aih'],
      title: 'Local IP/Interface/Hostname',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['peer-ifh'],
      title: 'Peer IP/FQDN/Hostname',
      isResize: true,
      rowspan: 2
    },
    {
      fields: ['localAuthInfo-authType', 'localAuthInfo-authInfo'],
      title: 'Local Auth Info',
      titleAlign: 'center',
      colspan: 2
    },
    {
      fields: ['peerAuthInfo-authType', 'peerAuthInfo-authInfo', 'pskAuthClients'],
      title: 'Peer Auth Info',
      titleAlign: 'center',
      colspan: 3
    },
    {
      fields: ['rules'],
      title: 'Rules',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['routingInstance'],
      title: 'Routing Instance',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['tunnelInterface'],
      title: 'Tunnel Interface',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: ['tunnelInitiate'],
      title: 'Tunnel Initiate',
      titleAlign: 'center',
      rowspan: 2
    },
    {
      fields: [
        'ipsec-fragmentation',
        'ipsec-forceNatT',
        'ipsec-encryptionAlgorithms',
        'ipsec-mode',
        'ipsec-pfsGroup',
        'ipsec-antiReplay'
      ],
      title: 'IPSec',
      titleAlign: 'center',
      colspan: 6
    },
    {
      fields: ['ike-version', 'ike-mode', 'ike-encryptionAlgorithms'],
      title: 'IKE',
      titleAlign: 'center',
      colspan: 3
    }
  ],
  [
    {
      fields: ['localAuthInfo-authType'],
      title: 'Auth Type'
    },
    {
      fields: ['localAuthInfo-authInfo'],
      title: 'Auth Info'
    },
    {
      fields: ['peerAuthInfo-authType'],
      title: 'Auth Type'
    },
    {
      fields: ['peerAuthInfo-authInfo'],
      title: 'Auth Info'
    },
    {
      fields: ['pskAuthClients'],
      title: 'Psk Auth Clients'
    },
    {
      fields: ['ipsec-fragmentation'],
      title: 'Fragmentation'
    },
    {
      fields: ['ipsec-forceNatT'],
      title: 'Force NAT-T Configuration'
    },
    {
      fields: ['ipsec-encryptionAlgorithms'],
      title: 'Encryption and Hashing Algorithm'
    },
    {
      fields: ['ipsec-mode'],
      title: 'Mode'
    },
    {
      fields: ['ipsec-pfsGroup'],
      title: 'Forward Secrecy Mode'
    },
    {
      fields: ['ipsec-antiReplay'],
      title: 'Anti Replay'
    },
    {
      fields: ['ike-version'],
      title: 'IKE Version'
    },
    {
      fields: ['ike-mode'],
      title: 'DH Mode'
    },
    {
      fields: ['ike-encryptionAlgorithms'],
      title: 'Encryption and Hashing Algorithm'
    }
  ]
];

export { columns, titleRows };
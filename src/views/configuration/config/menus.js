import interSrc from 'assets/images/icon/interfaces.png';
import ipsecSrc from 'assets/images/icon/IPsec.png';
import vpnSrc from 'assets/images/icon/vpnprofile.png';
import brsdwanSrc from 'assets/images/icon/BRSDWAN.png';

export default {
  firstMenus: [
    {
      title: 'Interfaces',
      key: 'Interfaces',
      icon: interSrc
    },
    {
      title: 'Zones',
      key: 'Zones'
    },
    {
      title: 'Class of Service',
      key: 'Class of Service',
      children: [
        {
          title: 'Qos Profiles',
          key: 'QosProfiles'
        },
        {
          title: 'Qos Policies',
          key: 'QosPolicies'
        },
        {
          title: 'App Qos Policies',
          key: 'AppQosPolicies'
        },
        {
          title: 'Drop Profile',
          key: 'dropProfile'
        },
        {
          title: 'Scheduler',
          key: 'Scheduler'
        },
        {
          title: 'Scheduler Maps',
          key: 'SchedulerMaps'
        },
        {
          title: 'Associate Interface/Network',
          key: 'AssociateInterfaceNetwork'
        }
      ]
    }
  ],
  secondMenus: [
    {
      title: 'IPSec',
      key: 'IPSec',
      icon: ipsecSrc,
      children: [
        {
          title: 'VPN Profiles',
          key: 'VPNProfile',
          icon: vpnSrc
        },
        {
          title: 'Branch SDWAN Profile',
          key: 'BranchSDWANProfile',
          icon: brsdwanSrc
        }
      ]
    }
  ],
  thirdMenus: [
    {
      title: 'Objects',
      key: 'Objects',
      children: [
        {
          title: 'Address',
          key: 'Address'
        },
        {
          title: 'Schedules',
          key: 'Schedules'
        },
        {
          title: 'Custom Objects',
          key: 'CustomObjects',
          children: [
            {
              title: 'Applications',
              key: 'Applications'
            },
            {
              title: 'Application Filters',
              key: 'ApplicationFilters'
            },
            {
              title: 'URL Categories',
              key: 'URLCategories'
            },
            {
              title: 'Application Groups',
              key: 'ApplicationGroups'
            },
            {
              title: 'Services',
              key: 'Service'
            }
          ]
        }
      ]
    }
  ]
};

import interfaces from 'assets/images/icon/interfaces.png';
import ipsec from 'assets/images/icon/IPsec.png';
import vpn from 'assets/images/icon/vpnprofile.png';
import brsdwan from 'assets/images/icon/BRSDWAN.png';
import appqos from 'assets/images/icon/AppQoS.png';
import object from 'assets/images/icon/object.png';
import sch from 'assets/images/icon/Scheduler.png';
import schMap from 'assets/images/icon/SchedulerMaps.png';
import dropProfile from 'assets/images/icon/DropProfile.png';
import address from 'assets/images/icon/address.png';
import customObj from 'assets/images/icon/CustomObj.png';
import rule from 'assets/images/icon/rule.png';
import service from 'assets/images/icon/Service.png';

export default {
  firstMenus: [
    {
      title: 'Interfaces',
      key: 'Interfaces',
      icon: interfaces
    },
    {
      title: 'Zones',
      key: 'Zones',
      icon: service
    },
    {
      title: 'Class of Service',
      key: 'Class of Service',
      icon: service,
      children: [
        {
          title: 'Qos Profiles',
          key: 'QosProfiles',
          icon: appqos
        },
        {
          title: 'Qos Policies',
          key: 'QosPolicies',
          icon: appqos
        },
        {
          title: 'App Qos Policies',
          key: 'AppQosPolicies',
          icon: appqos
        },
        {
          title: 'Drop Profile',
          key: 'dropProfile',
          icon: dropProfile
        },
        {
          title: 'Scheduler',
          key: 'Scheduler',
          icon: sch
        },
        {
          title: 'Scheduler Maps',
          key: 'SchedulerMaps',
          icon: schMap
        },
        {
          title: 'Associate Interface/Network',
          key: 'AssociateInterfaceNetwork',
          icon: interfaces
        }
      ]
    }
  ],
  secondMenus: [
    {
      title: 'IPSec',
      key: 'IPSec',
      icon: ipsec,
      children: [
        {
          title: 'VPN Profiles',
          key: 'VPNProfile',
          icon: vpn
        },
        {
          title: 'Branch SDWAN Profile',
          key: 'BranchSDWANProfile',
          icon: brsdwan
        }
      ]
    }
  ],
  thirdMenus: [
    {
      title: 'Objects',
      key: 'Objects',
      icon: object,
      children: [
        {
          title: 'Address',
          key: 'Address',
          icon: address
        },
        {
          title: 'Schedules',
          key: 'Schedules',
          icon: rule
        },
        {
          title: 'Custom Objects',
          key: 'CustomObjects',
          icon: customObj,
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

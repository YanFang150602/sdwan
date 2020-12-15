import appqos from 'assets/images/icon/AppQoS.png';
import object from 'assets/images/icon/object.png';
import address from 'assets/images/icon/address.png';
import customObj from 'assets/images/icon/CustomObj.png';
import application from 'assets/images/icon/application.png';
import applicationGroup from 'assets/images/icon/applicationGroup.png';
import applicationFilter from 'assets/images/icon/applicationFilter.png';
import urlCategory from 'assets/images/icon/urlCategory.png';
import service from 'assets/images/icon/Service.png';

export default {
  'firstMenus': [
    {
      'title': 'Zones',
      'key': 'ZonesTem',
      icon: appqos
    },
    {
      'title': 'Zone Protection Profiles',
      'key': 'ZonesPPTem',
      icon: appqos
    }
  ],
  'secondMenus': [
    {
      'title': 'Objects',
      'key': 'Objects',
      icon: object,
      'children': [
        {
          'title': 'address',
          'key': 'TemplateAddress',
          icon: address
        },
        {
          'title': 'Custom Objects',
          'key': 'Custom Objects',
          icon: customObj,
          'children': [
            {
              'title': 'Applications',
              'key': 'TemplateApplications',
              icon: application
            },
            {
              'title': 'Application Filters',
              'key': 'TemplateApplicationFilters',
              icon: applicationFilter
            },
            {
              'title': 'Url Categories',
              'key': 'TemplateUrlCategories',
              icon: urlCategory
            },
            {
              'title': 'Application Groups',
              'key': 'TemplateApplicationGroups',
              icon: applicationGroup
            },
            {
              'title': 'Services',
              'key': 'TemplateService',
              icon: service
            }
          ]
        }
      ]
    }
  ]
};

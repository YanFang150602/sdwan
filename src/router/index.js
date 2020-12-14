import Vue from 'vue';
import vuex from '@/store';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// 解决重复路由报错
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

let otherRouter = [];
const files = require.context('./', true, /\.js$/);
// 路由自动化导入
files.keys().forEach(key => {
  if (key !== './index.js' && files(key).default) {
    otherRouter = [...otherRouter, ...[...files(key).default]];
  }
});

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/configuration/Devices',
    meta: {
      title: '首页'
    },
    component: () => import('views/home'),
    children: [
      {
        path: '/configuration',
        name: 'Configuration',
        redirect: '/configuration/Devices',
        meta: {
          title: '组织管理'
        },
        component: () => import('views/configuration'),
        children: [
          {
            path: '/configuration/Devices',
            name: 'Devices',
            meta: {
              title: '设备'
            },
            component: () => import('views/configuration/devices/Devices')
          }
        ]
      },
      {
        path: '/configuration/Template',
        name: 'CommonTemplate',
        meta: {
          title: '模板'
        },
        component: () => import('views/configuration/commonTemplate'),
        children: [
          {
            path: '/configuration/commonTemplate/zones',
            name: 'ZonesTem',
            meta: {
              title: '区'
            },
            component: () => import('views/configuration/commonTemplate/zones')
          },
          {
            path: '/configuration/commonTemplate/zonesPP',
            name: 'ZonesPPTem',
            meta: {
              title: '区'
            },
            component: () =>
              import('views/configuration/commonTemplate/zonesPP')
          },
          {
            path: '/configuration/commonTemplate/URLCategories',
            name: 'TemplateUrlCategories',
            meta: {
              title: '路径'
            },
            component: () =>
              import('views/configuration/URLCategories/URLCategories')
          },
          {
            path: '/configuration/commonTemplate/Service',
            name: 'TemplateService',
            meta: {
              title: '路径'
            },
            component: () => import('views/configuration/service/Service')
          },
          {
            path: '/configuration/commonTemplate/Applications',
            name: 'TemplateApplications',
            meta: {
              title: '路径'
            },
            component: () =>
              import('views/configuration/Applications/Applications')
          },
          {
            path: '/configuration/commonTemplate/ApplicationGroups',
            name: 'TemplateApplicationGroups',
            meta: {
              title: '组'
            },
            component: () =>
              import('views/configuration/ApplicationGroups/ApplicationGroups')
          },
          {
            path: '/configuration/commonTemplate/ApplicationFilters',
            name: 'TemplateApplicationFilters',
            meta: {
              title: '过滤'
            },
            component: () =>
              import(
                'views/configuration/ApplicationFilters/ApplicationFilters'
              )
          },
          {
            path: '/configuration/commonTemplate/Address',
            name: 'TemplateAddress',
            meta: {
              title: '地址'
            },
            component: () => import('views/configuration/address/Address')
          }
        ]
      },
      {
        path: '/configuration/deviceConfig',
        name: 'DeviceConfig',
        meta: {
          title: '设备配置'
        },
        component: () => import('views/configuration/config/Config'),
        children: [
          {
            path: '/configuration/deviceConfig/interfaces',
            name: 'Interfaces',
            meta: {
              title: '接口'
            },
            component: () => import('views/configuration/interfaces')
          },
          {
            path: '/configuration/deviceConfig/zones',
            name: 'Zones',
            meta: {
              title: '区'
            },
            component: () => import('views/configuration/zones')
          },
          {
            path: '/configuration/deviceConfig/branchSDWANProfile',
            name: 'BranchSDWANProfile',
            meta: {
              title: '分支概要'
            },
            component: () =>
              import(
                'views/configuration/BranchSDWANProfile/branchSDWANProfile'
              )
          },
          {
            path: '/configuration/deviceConfig/schedule',
            name: 'Schedules',
            meta: {
              title: '定时'
            },
            component: () => import('views/configuration/schedule/Schedule')
          },
          {
            // path: '/configuration/deviceConfig/VPNConfigFile',
            path: '/configuration/deviceConfig/VPNProfile',
            name: 'VPNProfile',
            meta: {
              title: 'VPN Profile'
            },
            component: () => import('views/configuration/vpn')
          },
          {
            path: '/configuration/deviceConfig/QosProfiles',
            name: 'QosProfiles',
            meta: {
              title: '概要文件'
            },
            component: () =>
              import('views/configuration/QosProfiles/QosProfiles')
          },
          {
            path: '/configuration/deviceConfig/QosPolicies',
            name: 'QosPolicies',
            meta: {
              title: '青年'
            },
            component: () => import('views/configuration/qosPolices')
          },
          {
            path: '/configuration/deviceConfig/AppQosPolicies',
            name: 'AppQosPolicies',
            meta: {
              title: '应用策略'
            },
            component: () => import('views/configuration/appQosPolicies')
          },
          {
            path: '/configuration/deviceConfig/dropProfile',
            name: 'dropProfile',
            meta: {
              title: 'Drop配置文件'
            },
            component: () =>
              import('views/configuration/dropProfile/DropProfile')
          },
          {
            path: '/configuration/deviceConfig/Scheduler',
            name: 'Scheduler',
            meta: {
              title: '调度程序配置'
            },
            component: () => import('views/configuration/Scheduler/Scheduler')
          },
          {
            path: '/configuration/deviceConfig/SchedulerMaps',
            name: 'SchedulerMaps',
            meta: {
              title: '调度程序映射配置'
            },
            component: () =>
              import('views/configuration/SchedulerMaps/SchedulerMaps')
          },
          {
            path: '/configuration/deviceConfig/AssociateInterfaceNetwork',
            name: 'AssociateInterfaceNetwork',
            meta: {
              title: '网络接口'
            },
            component: () =>
              import(
                'views/configuration/AssociateInterfaceNetwork/AssociateInterfaceNetwork'
              )
          },
          // 1111111111111111111111111111111111111111111111111111111111111111
          {
            path: '/configuration/deviceConfig/Address',
            name: 'Address',
            meta: {
              title: '地址'
            },
            component: () => import('views/configuration/address/Address')
          },
          // 111111111111111111111111111111111111111111111111111111111111111111111111111111111111
          {
            path: '/configuration/deviceConfig/Applications',
            name: 'Applications',
            meta: {
              title: '应用程序'
            },
            component: () =>
              import('views/configuration/Applications/Applications')
          },

          // 1111111111111111111111111111111111111111111111111111111111111111111111111111
          {
            path: '/configuration/deviceConfig/ApplicationFilters',
            name: 'ApplicationFilters',
            meta: {
              title: '应用程序'
            },
            component: () =>
              import(
                'views/configuration/ApplicationFilters/ApplicationFilters'
              )
          },
          // 1111111111111111111111111111111111111111111111111111111111111111111111111111
          {
            path: '/configuration/deviceConfig/ApplicationGroups',
            name: 'ApplicationGroups',
            meta: {
              title: '路径'
            },
            component: () =>
              import('views/configuration/ApplicationGroups/ApplicationGroups')
          },
          // 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111
          {
            path: '/configuration/deviceConfig/Service',
            name: 'Service',
            meta: {
              title: '路径'
            },
            component: () => import('views/configuration/service/Service')
          },
          // qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
          {
            path: '/configuration/deviceConfig/URLCategories',
            name: 'URLCategories',
            meta: {
              title: '路径'
            },
            component: () =>
              import('views/configuration/URLCategories/URLCategories')
          }
          // {
          //   path: '/configuration/deviceConfig/VPNConfigFile',
          //   name: 'VPNConfigFile',
          //   meta: {
          //     title: 'VPN Config File'
          //   },
          //   component: () => import('views/configuration/vpn/VPNConfigFile')
          // }
        ]
      },
      {
        // administration页面组
        path: '/administration',
        name: 'Administration',
        redirect:
          vuex.state.common.userInfo.level !== 3
            ? '/administration/organize'
            : '/administration/devices/Devices',
        meta: {
          title: '组织管理'
        },
        component: () => import('views/administration'),
        children: [
          {
            path: '/administration/organize',
            name: 'Organizations',
            meta: {
              title: '组织'
            },
            component: () => import('views/administration/organize')
          },
          {
            path: '/administration/organize-users',
            name: 'OrganizationUsers',
            meta: {
              title: '组织成员'
            },
            component: () => import('views/administration/organizeUsers')
          },
          {
            path: '/administration/devices/Devices',
            name: 'device',
            meta: {
              title: '组织成员'
            },
            component: () => import('views/administration/devices/Devices')
          }
        ]
      },
      {
        // workflows页面组
        path: '/workflows',
        name: 'Workflows',
        redirect: '/workflows/templates',
        meta: {
          title: '设备'
        },
        component: () => import('views/workflows'),
        children: [
          {
            // workflows templates页面
            path: '/workflows/templates',
            name: 'Templates',
            meta: {
              title: '模板'
            },
            component: () => import('views/workflows/templates')
          },
          {
            path: '/workflows/applicationSteering',
            name: 'applicationSteering',
            meta: {
              title: '应用指导'
            },
            component: () => import('views/workflows/applicationSteering')
          },
          {
            path: '/workflows/spoke-groups',
            name: 'SpokeGroups',
            meta: {
              title: '组织'
            },
            component: () => import('views/workflows/spokeGroups/SpokeGroups')
          },
          {
            path: '/workflows/devices',
            name: 'Device',
            meta: {
              title: '设备'
            },
            component: () => import('views/workflows/devices/Devices')
          },
          {
            path: '/workflows/deviceGroup',
            name: 'DeviceGroup',
            meta: {
              title: '设备组'
            },
            component: () => import('views/workflows/deviceGroup/deviceGroup')
          }
        ]
      },
      ...otherRouter
    ]
  }
];
if (vuex.state.common.userInfo.level === 3) {
  routes[0].children[3].children.shift();
}
//本地开发时启用本地登录
if (process.env.VUE_APP_BUILD_MODE !== 'poc') {
  routes.push({
    path: '/login',
    name: 'Login',
    component: () => import('views/login/Login')
  });
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = vuex.state.common.token;
  if (!token && to.meta?.auth) {
    vuex.commit('common/to_login', { to, from, next });
  } else {
    next();
  }
  //if (to.path === '/login' || token) {
  //  next();
  //} else {
  //  next('/login');
  //}
});

export default router;

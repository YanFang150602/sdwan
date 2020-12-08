<template>
  <a-layout :style="{ height: '100%' }">
    <SideNav :navCon="navCon"/>
    <a-layout-content>
      <a-spin :spinning="isLoading">
        <router-view></router-view>
      </a-spin>
    </a-layout-content>
  </a-layout>
</template>

<script>
import SideNav from '@/components/SideNav';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      navCon: [
        {
          title: 'Templates',
          path: '/workflows/templates',
          imgUrl: require('assets/images/icon/template.png')
        },
        {
          title: 'Application Steering',
          path: '/workflows/applicationSteering',
          imgUrl: require('assets/images/icon/template.png')
        },
        {
          title: 'DeviceGroup',
          path: '/workflows/deviceGroup',
          imgUrl: require('assets/images/icon/org.png')
        },
        {
          title: 'Devices',
          path: '/workflows/devices',
          imgUrl: require('assets/images/icon/devices.png')
        },
        {
          title: 'SpokeGroups',
          path: '/workflows/spoke-groups',
          imgUrl: require('assets/images/icon/org.png')
        }
      ]
    };
  },
  computed: {
    ...mapState({
      isLoading: state => !!state.isLoading
    })
  },
  components: {
    SideNav
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-spin-nested-loading {
  height: 100%;
  .ant-spin-container {
    height: 100%;
  }
}
</style>

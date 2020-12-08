<template>
  <a-layout :style="{ height: '100%' }">
    <SideNav :navCon="navCon"/>
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script>
import SideNav from 'components/SideNav';
export default {
  data() {
    return {
      navCon: [
        {
          title: ' Organizations',
          path: '/administration/organize',
          imgUrl: require('assets/images/icon/org.png')
        },
        {
          title: 'Appliances',
          path: '/administration/devices/Devices',
          imgUrl: require('assets/images/icon/org.png')
        },
        {
          title: 'OrganUsers',
          path: '/administration/organize-users',
          imgUrl: require('assets/images/icon/orguser.png')
        }
      ]
    };
  },
  components: {
    SideNav
  }
};
</script>

<style lang="scss" scoped></style>

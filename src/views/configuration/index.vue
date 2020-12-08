<template>
  <a-layout :style="{ height: '100%' }">
    <Tree />
    <a-layout-content>
      <keep-alive>
        <a-spin :spinning="isLoading">
          <router-view></router-view>
        </a-spin>
      </keep-alive>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Tree from '@/components/Tree';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      navCon: [
        {
          title: this.$t('Devices'),
          path: '/configuration/Devices',
          imgUrl: require('assets/images/icon/devices.png')
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
    // SideNav,
    Tree
  }
};
</script>

<style lang="scss" scoped></style>

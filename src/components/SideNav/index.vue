<template>
  <a-layout-sider width="182px" :style="{ heght: '100%', background: '#fff' }">
    <a-menu theme="light" :default-selected-keys="defaultKeys">
      <a-menu-item class="menu-item" v-for="item in navCon" :key="item.title">
        <router-link :to="item.path">
          <img style="width:16px;margin-right:10px" :src="item.imgUrl" alt="" />
          <span>{{ $t(item.title) }}</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
export default {
  props: {
    navCon: {
      type: Array,
      requried: true
    }
  },
  data() {
    return {};
  },
  computed: {
    defaultKeys() {
      return [
        (this.navCon.find(item => item.path === this.$route.fullPath) || {})
          .title
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ {
  .menu-item {
    padding: 0 0 0 2px;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    margin: 0 !important;
    &:hover {
      background-color: rgb(115, 154, 186);
    }
    a:hover {
      color: rgb(15, 44, 62);
    }
  }
  .ant-menu-item-selected {
    background-color: rgb(167, 208, 84) !important;
    .router-link-active {
      color: rgb(15, 44, 62);
    }
  }
}
</style>

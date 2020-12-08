<template>
  <div>
    <a-tabs default-active-key="1" :size="small" @change="callback">
      <a-tab-pane :style="{ margin: 0 }" key="1" tab="Ethernet">
        <Ethernet></Ethernet>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tunnel" force-render>
        <Tunnel></Tunnel>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Pseudo Tunnel">
        <Pseudo></Pseudo>
        <!-- <Group></Group> -->
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Ethernet from './Ethernet';
import Pseudo from './Pseudo';
// import AppFilter from './AppFilter';
// import Group from './Group';
// import Service from './Service';
import Tunnel from './Tunnel';
export default {
  components: {
    Ethernet,
    // Service,
    // Group,
    Pseudo,
    Tunnel
  },
  data() {
    return {
      small: 'small'
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-tabs-tab {
  margin: 0;
  font-size: 12px;
}
</style>

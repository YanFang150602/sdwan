<template>
  <ul
    :style="{
      left: fixed.lf + 'px',
      top: fixed.tp + 'px'
    }"
    class="itme-select"
  >
    <li
      :data-id="item.id"
      v-for="(item, index) in portList"
      :key="index"
      @click="selectPort(item)"
    >
      <img :src="item.src" alt="" />
      {{ item.title }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    fixed: {
      type: Object
    },
    curItem: {
      type: Object
    },
    curIndex: {
      type: Number
    }
  },
  data() {
    return {
      listData: [
        {
          id: '0',
          src: require('@/assets/images/template/wf1.jpg'),
          title: 'WAN'
        },
        {
          id: '1',
          src: require('@/assets/images/template/wf6.jpg'),
          title: 'LAN'
        },
        {
          id: '2',
          src: require('@/assets/images/template/wf2.jpg'),
          title: 'PPPoE'
        },
        {
          id: '3',
          src: require('@/assets/images/template/wf3.jpg'),
          title: 'wan and LAN'
        },
        {
          id: '4',
          src: require('@/assets/images/template/wf4.jpg'),
          title: 'Unassigned Port'
        }
      ]
    };
  },
  computed: {
    portList() {
      return this.listData.filter(item => item.id != this.curItem.id);
    }
  },
  methods: {
    // 点击选择端口
    selectPort(item) {
      this.$emit('select-port', item, this.curIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.itme-select {
  position: fixed;
  background-color: #e9eef4;
  padding: 5px;
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #bbbbbb;
  box-shadow: 0px 0px 2px 0px rgba(87, 90, 90, 0.75);
  z-index: 6666;
  width: 160px;
  height: 96px;
  z-index: 66;
  li {
    padding: 0 5px;
    font-size: 10px;
    text-align: left;
    vertical-align: middle;
    border-top: 1px dotted #ccc;
    line-height: 20px;
    height: 20px;
    cursor: pointer;
    &:nth-child(1) {
      border: 0;
    }
    img {
      display: inline-block;
      width: 15px;
      margin-right: 5px;
    }
  }
}
</style>

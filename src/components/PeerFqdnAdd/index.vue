<template>
  <div class="add-con">
    <a-row
      class="add-header"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <a-col :span="2" class="header-input"
        ><input type="checkbox" :checked="allChecked" @change="allSelect"
      /></a-col>
      <a-col :span="18" class="header-title">{{ title }}</a-col>
      <a-col :span="4" class="header-btn"
        ><a-icon @click="addItem" type="plus"/><a-icon
          @click="removeItem"
          type="minus"
      /></a-col>
    </a-row>
    <div class="add-body">
      <div class="add-item" v-if="!input">
        <AddModelItem
          v-for="item in data"
          :key="item.id"
          :itemdata="item"
          :selectData="itemData"
          @remove="removeThis"
          @selectchange="selectChange"
          @changedata="changedata"
        />
      </div>
      <div class="add-item" v-if="input">
        <addModleInput
          v-for="item in data"
          :key="item.id"
          :itemdata="item"
          :selectData="itemData"
          :inputType="inputType"
          @remove="removeThis"
          @selectchange="selectChange"
          @changedata="changedata"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddModelItem from './addModleItem';
import addModleInput from './addModleInput';
export default {
  props: {
    listdate: {
      type: Array,
      default: () => {
        return [];
      }
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    input: Boolean,
    inputType: String,
    title: String
  },
  data() {
    return {
      allChecked: false,
      data: [],
      itemData: [],
      subData: [],
      rule: true // rule为true不满足正则
    };
  },
  created() {
    this.itemData = this.listdate;
    this.getList();
    console.log(this.inputType, 198);
  },
  methods: {
    addItem() {
      console.log(this.data, 443);
      if (this.input) {
        this.data.push({
          id: 'id' + this.guid(),
          value: '',
          checked: false,
          rule: false
        });
      }
      if (
        (this.itemData.length > 0 && this.data.length === 0) ||
        ([...this.data].pop().value && this.itemData.length > 0)
      ) {
        this.data.push({
          id: 'id' + this.guid(),
          value: '',
          checked: false
        });
      }
      console.log(this.data, 444);
    },
    getList() {
      console.log(this.list);
      if (this.list.length > 0) {
        this.subData = this.list;
        console.log(this.list, '修改001');
        const that = this;
        this.list.forEach(item => {
          that.data.push({
            id: 'id' + this.guid(),
            value: item,
            checked: false
          });
          // that.subData.push(item);
        });
        console.log(this.data, 444);
      }
    },
    changedata({ id, value, rule }) {
      this.itemData = this.listdate;
      this.rule = rule;
      console.log(rule, 4431);
      this.subData = [];
      this.data.forEach(item => {
        if (item.id === id) {
          item.value = value;
        }
        if (item.value) {
          this.itemData = this.itemData.filter(i => i !== item.value);
          this.subData.push(item.value);
        }
      });
      console.log(this.data);
    },
    removeItem() {
      this.data = this.data.filter(item => item.checked === false);
      this.itemData = this.listdate;
      this.subData = [];
      this.data.forEach(item => {
        if (item.value) {
          this.itemData = this.itemData.filter(i => i !== item.value);
          this.subData.push(item.value);
        }
      });
    },
    removeThis() {
      this.data.pop();
    },
    allSelect() {
      this.allChecked = !this.allChecked;
      if (this.allChecked) {
        this.data.forEach(item => {
          item.checked = true;
        });
      } else {
        this.data.forEach(item => {
          item.checked = false;
        });
      }
    },
    selectChange(id) {
      this.data.forEach(item => {
        if (item.id === id) {
          item.checked = !item.checked;
        }
      });
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid() {
      return (
        this.S4() +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        '-' +
        this.S4() +
        this.S4() +
        this.S4()
      );
    }
  },
  components: { AddModelItem, addModleInput },
  watch: {
    listdate(val) {
      this.itemData = val;
    },
    subData() {
      this.$emit('subdata', [{ subData: this.subData, rule: this.rule }]);
      console.log(this.subData);
    },
    rule() {
      this.$emit('rule', this.rule);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-con {
  width: 100%;
  min-height: 80px;
  overflow-y: scroll;
  background: #fff;
  .add-header {
    background: #b6c9db;
    height: 22px;
    width: 100% !important;
    .header-input {
      text-align: center;
    }
    .header-title {
      font-size: 12px;
      text-overflow: ellipsis;
      // color: #0f2c3e;
      border-left: 1px solid #97acbe;
      padding: 0 2px;
      line-height: 22px;
    }
  }
  .add-body {
    background: #fff;
  }
}
</style>

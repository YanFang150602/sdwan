<template>
  <div class="add-con">
    <a-row class="add-header" type="flex" justify="space-between" align="middle">
      <a-col :span="2" class="header-input">
        <a-checkbox
          @click="handleSeleAll"
          :indeterminate="!!(selectArr.length && selectArr.length !== data.length)"
          :checked="!!(selectArr.length && selectArr.length === data.length)"
        ></a-checkbox>
      </a-col>
      <a-col :span="20" class="header-title">{{ title }}</a-col>
      <a-col :span="2" class="header-btn">
        <a-icon @click="data.push(undefined)" type="plus"/>
        <a-icon @click="handleDel" type="minus"/>
      </a-col>
    </a-row>
    <div class="add-body">
      <a-checkbox-group style="width: 100%;" v-model="selectArr">
        <a-row :key="item" v-for="(item,index) in data" style="margin: 3px 0;">
          <a-col :span="2" style="text-align: center">
            <a-checkbox :value="item"></a-checkbox>
          </a-col>
          <a-col :span="22">
            <a-select size="small" v-model="data[index]">
              <a-select-option v-for="opt in optList" :key="opt" :value="opt">{{ opt }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listdate: {
      type: Array,
      default: () => {
        return [];
      }
    },
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    title: String
  },
  computed: {
    optList() {
      if (!this.listdate) return [];
      return this.listdate.filter(opt => !this.data.includes(opt));
    }
  },
  data() {
    return {
      selectArr: [],
      data: [...this.value]
    };
  },
  methods: {
    handleSeleAll({ target: { checked: val } }) {
      if (val) return (this.selectArr = [...this.data]);
      this.selectArr = [];
    },
    handleDel() {
      this.data = this.data.filter(item => !this.selectArr.includes(item));
      this.selectArr = [];
    }
  },
  watch: {
    data(newVal) {
      console.log(newVal, 48573457, this.title);
      this.$emit(
        'input',
        newVal.filter(item => item)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.add-con {
  width: 100%;
  min-height: 66px;
  overflow-y: scroll;
  background: #fff;
  .add-header {
    background: #b6c9db;
    height: 22px;
    width: 100% !important;
    line-height: 22px;
    .header-input {
      text-align: center;
    }
    .header-title {
      font-size: 12px;
      text-overflow: ellipsis;
      color: #0f2c3e;
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

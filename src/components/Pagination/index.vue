<template>
  <div class="list-action">
    <a-row
      type="flex"
      justify="space-between"
      align="middle"
      :style="{ paddingRight: '14px' }"
    >
      <!-- 搜索栏 -->
      <a-col class="pull-left" :span="16" v-if="searchFlag">
        <a-input ref="searchInput" v-model="keyworks" placeholder="Search">
          <a-icon slot="prefix" type="search" />
          <a-icon
            @click="keyworks = ''"
            v-show="keyworks != ''"
            slot="suffix"
            type="close"
          />
        </a-input>
      </a-col>
      <a-col class="pull-right">
        <a-row type="flex" justify="space-between" align="middle">
          <!-- 组织用户添加 -->
          <a-col class="nav-item" v-if="flag" title="Add" @click="createItem">
            <img width="100%" src="@/assets/images/icon/add.png" alt="" />
          </a-col>
          <!-- 组织用户删除 -->
          <a-col
            class="nav-item"
            v-if="flag"
            title="Delete"
            @click="deleteItem"
          >
            <img width="100%" src="@/assets/images/icon/delete.png" alt="" />
          </a-col>
          <!-- 分页功能模块 -->
          <a-col>
            <a-row
              class="nav-item pagination-change"
              type="flex"
              justify="space-between"
              align="middle"
            >
              <a-col
                @click="pageChange('prev')"
                :style="{
                  width: '20px',
                  padding: '0 3px'
                }"
              >
                <img
                  :class="{
                    disabled: inputVal === 1 || nextNum === 1 ? 'disabled' : ''
                  }"
                  width="100%"
                  style="transform:rotate(180deg)"
                  src="@/assets/images/icon/change.png"
                  alt=""
                />
              </a-col>
              <a-col :style="{ paddingBottom: '2px' }"
                ><input
                  :disabled="nextNum === 1"
                  :value="inputVal"
                  :style="nextNum === 1 ? 'background:#cad7e1' : ''"
                  @keyup.enter="pageChange('input')"
                  @change="changeVal"
                  type="text"
              /></a-col>
              <a-col
                :style="{
                  fontSize: '12px',
                  color: '#b0b4b9',
                  padding: '0 4px'
                }"
                >of</a-col
              >
              <a-col
                :style="{
                  fontSize: '12px',
                  color: '#b0b4b9'
                }"
                >{{ nextNum }}</a-col
              >
              <a-col
                @click="pageChange('next')"
                :style="{ width: '20px', padding: '0 3px' }"
              >
                <img
                  :class="{
                    disabled:
                      inputVal === nextNum || nextNum === 1 ? 'disabled' : ''
                  }"
                  width="100%"
                  src="@/assets/images/icon/change.png"
                  alt=""
                />
              </a-col>
            </a-row>
          </a-col>
          <a-col class="nav-item pagination-select">
            <select v-model="selectVal" @change="pageSizeChange">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="30">30</option>
            </select>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 20
    },
    flag: {
      type: Boolean,
      default: true
    },
    searchFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      keyworks: '', //搜索关键字
      inputVal: 1, //当前page 提交给父级修改 limit
      inputChangeVal: 1, //输入框当前值
      selectVal: this.pageSize //pagesize值 提交给父级修改 pageSize
    };
  },
  computed: {
    // 计算总page数
    nextNum() {
      return Math.ceil(this.total / this.selectVal);
    }
  },
  methods: {
    // 前进 后退 输入框 事件
    pageChange(type) {
      switch (type) {
        // 前进页
        case 'prev':
          if (this.inputVal <= 1) return;
          this.inputVal--;
          if (this.inputVal >= 1 && this.inputVal <= this.nextNum) {
            // 修改
            this.$emit('page-change', this.inputVal);
          }
          break;
        // 后退页
        case 'next':
          if (this.inputVal >= this.nextNum) return;
          this.inputVal++;
          if (this.inputVal >= 1 && this.inputVal <= this.nextNum) {
            this.$emit('page-change', this.inputVal);
          }
          break;
        //input 输入
        case 'input':
          if (this.inputChangeVal >= 1 && this.inputChangeVal <= this.nextNum) {
            this.inputVal = this.inputChangeVal;
            this.$emit('page-change', this.inputVal);
          }
      }
    },
    //切换pagesize  更新this.inputVal 提交  page-size-change 传this.selectVal
    pageSizeChange() {
      this.inputVal = 1;
      this.$emit('page-size-change', this.selectVal);
    },
    // 输入框改变值 在正确范围内 更新this.inputVal
    changeVal(e) {
      this.inputChangeVal = Number(e.target.value);
      if (this.inputChangeVal >= 1 && this.inputChangeVal <= this.nextNum) {
        this.inputVal = this.inputChangeVal;
      }
    },
    // 新建数据
    createItem() {
      this.$emit('create-item');
    },
    // 删除数据
    deleteItem() {
      this.$emit('delete-item');
    }
  },
  watch: {
    total() {
      if (this.inputVal > this.nextNum) {
        this.inputVal = 1;
      }
    },
    keyworks(val) {
      if (val === '') {
        this.inputVal = 1;
        this.$emit('cancel-search');
      } else {
        this.$emit('search', this.keyworks);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list-action {
  margin: 5px 0;
  .pull-left {
    /deep/.ant-input {
      color: #6a6f75;
      height: 22px;
      border-radius: 4px;
      line-height: 22px;
      font-size: 12px;
      &:focus {
        box-shadow: none;
        border-color: #b0c7d5;
      }
    }
  }
  .pull-right {
    .nav-item {
      padding: 0 8px;
      width: 32px;
      border-right: 1px solid #97acbe;
      img {
        margin-bottom: 5px;
      }
      .disabled {
        opacity: 0.4;
      }
    }
    .pagination-change {
      width: 122px;
      padding: 0;
      input {
        border-radius: 4px;
        color: #424b59;
        font-size: 11px;
        line-height: 16px;
        text-align: center;
        width: 32px;
        border: 1px solid #b0c7d5;
        padding: 0px 3px;
      }
    }
    .pagination-select {
      border-right: none;
      select {
        line-height: 12px;
        width: 40px;
        text-indent: 0.01px;
        color: #0f2c3e;
        border-radius: 4px;
        font-size: 11px;
        border: 1px solid #b0c7d5;
      }
    }
  }
}
</style>

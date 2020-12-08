<template>
  <div ref="listCrt" class="listCrt">
    <div class="header">
      <a-row type="flex" align="middle">
        <a-col class="check"
          ><input @change="checkAll" v-model="allCheck" type="checkbox"
        /></a-col>
        <a-col class="title">{{ title }}</a-col>
        <a-col class="addDelBtn">
          <a href="javascript:;" class="addBtn" @click="addItem"></a>
          <a href="javascript:;" class="delBtn" @click="delItem"></a>
        </a-col>
      </a-row>
    </div>
    <div
      class="body"
      :style="{
        height: bodyHeight + 'px',
        overflowY: itemsHeight > bodyHeight ? 'scroll' : 'hidden'
      }"
    >
      <div class="wrap" :style="{ height: itemsHeight + 'px' }">
        <a-row
          class="item"
          type="flex"
          align="middle"
          v-for="(item, index) in listItem"
          :key="index"
        >
          <a-col class="check"
            ><input v-model="item.check" type="checkbox"
          /></a-col>
          <a-col class="sltIpt" @click="reChange(item.data)">
            <!-- 单数据源 -->
            <a-select
              v-if="item.show && crtType === 'select'"
              @change="sltChange(item.data)"
              v-model="item.data"
            >
              <a-select-option
                v-for="(item, index) in listSlt"
                :key="index"
                :value="item.label || item"
              >
                {{ item.label || item }}
              </a-select-option>
            </a-select>
            <!-- 多数据源 -->
            <a-select
              v-model="item.data"
              v-else-if="item.show && crtType === 'sltGp'"
              @change="sltChange(item.data)"
            >
              <a-select-opt-group
                :label="item.title"
                v-for="item in listGp"
                :key="item.title"
              >
                <a-select-option
                  :value="i.key"
                  v-for="i in item.data"
                  :key="i.value"
                >
                  {{ i.key }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
            <!-- 写入提交 -->
            <input
              v-else-if="item.show && crtType === 'input'"
              type="text"
              v-model="item.data"
              @blur="sltChange(item.data)"
            />
            <!-- 失去焦点 替换输入框值 -->
            <span v-else>{{ item.data }}</span>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    crtType: {
      type: String,
      default: 'select'
    },
    listData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    listGpData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    itemData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      allCheck: false,
      bodyHeight: 0,
      listSlt: this.listData,
      listGp: JSON.parse(JSON.stringify(this.listGpData)),
      listItem: [],
      showLabel: false
    };
  },
  computed: {
    itemsHeight() {
      return this.listItem.length * 24;
    }
  },
  created() {
    if(this.listData && this.listData.length) {
      this.showLabel = Object.prototype.toString.call(this.listData[0]) === '[object Object]';
    }
    this.itemData.forEach(item => {
      if (this.showLabel) {
        for(let i = 0; i < this.listData.length; i++) {
          if (this.listData[i].value === item) {
            this.listItem.push({ check: false, data: this.listData[i].label, show: false });
            break;
          }
        }
      } else {
        this.listItem.push({ check: false, data: item, show: false });
      }
    });

    this.sltNew();
  },
  mounted() {
    this.bodyHeight = this.$refs.listCrt.offsetHeight - 22;
  },
  methods: {
    // 全选
    checkAll() {
      this.listItem.forEach(item => {
        item.check = true;
      });
    },
    // 添加
    addItem() {
      let item = {
        check: false,
        data: '',
        show: true
      };
      // 有空item不能再创建
      if (this.listItem.length > 0) {
        const isAdd = this.listItem.some(i => {
          return i.data === '';
        });
        if (!isAdd) {
          this.listItem.push(item);
        }
      } else {
        this.listItem.push(item);
      }
      if (this.crtType !== 'input') {
        this.sltNew();
      }
    },
    // 删除
    delItem() {
      this.listItem = this.listItem.filter(item => {
        return item.check !== true;
      });
      if (this.crtType !== 'input') {
        this.sltNew();
      }
    },
    // 输入框和文字切换
    sltChange(data) {
      this.listItem.forEach(item => {
        if (item.data === data) {
          item.show = false;
        }
      });
      if (this.crtType !== 'input') {
        this.sltNew();
      }
      this.param();
    },
    reChange(data) {
      this.listItem.forEach(item => {
        item.show = false;
        if (item.data === data) {
          item.show = true;
        }
      });
    },
    // 更新listSlt
    sltNew() {
      switch (true) {
        case this.crtType === 'select':
          this.listSlt = this.listData;
          this.listItem.forEach(item => {
            this.listSlt = this.listSlt.filter(i => {
              if (this.showLabel) {
                return item.data !== i.label;
              } else {
                return item.data !== i;
              }
              
            });
          });
          break;
        case this.crtType === 'sltGp':
          this.listGp = JSON.parse(JSON.stringify(this.listGpData));
          this.listItem.forEach(item => {
            this.listGp.forEach(list => {
              list.data = list.data.filter(i => {
                return item.data !== i.key;
              });
            });
          });
          break;
      }
    },
    // 回传父选中的值
    param() {
      if (this.crtType === 'sltGp') {
        const data = {};
        this.listGpData.forEach(item => {
          data[item.title] = [];
        });

        this.listItem.forEach(item => {
          if (item.data) {
            this.listGpData.forEach(ad => {
              ad.data.forEach(i => {
                if (i.key === item.data) {
                  data[ad.title].push(i.value);
                }
              });
            });
          }
        });
        this.$emit('subdata', data);
      } else {
        const data = [];
        this.listItem.forEach(item => {
          if (this.showLabel) {
            for(let i = 0; i < this.listData.length; i++) {
              if (this.listData[i].label === item.data) {
                data.push(this.listData[i].value);
                break;
              }
            }
          }
          else {
            data.push(item.data);
          }
        });
        this.$emit('subdata', data);
      }
    }
  },
  watch: {
    listItem: {
      handler(list) {
        this.allCheck = list.every(item => {
          return item.check === true;
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
%check {
  width: 20px;
  height: 100%;
  text-align: center;
  padding-top: 2px;
}
.listCrt {
  height: 100%;
  .header {
    background: #b6c9db;
    height: 22px;
    padding: 0 2px;
    .check {
      @extend %check;
    }
    .title {
      font-size: 12px;
      padding-left: 2px;
      text-overflow: ellipsis;
      border-left: 1px solid #97acbe;
      height: 100%;
    }
    .addDelBtn {
      height: 14px;
      margin-left: auto;
      vertical-align: top;
      display: table;
      a {
        width: 14px;
        height: 14px;
        display: inline-block;
        background: url(~@/assets/images/icon/add.png) no-repeat center;
        background-size: 100% auto;
      }
      .delBtn {
        background-image: url(~@/assets/images/icon/delete.png);
        margin-left: 2px;
      }
    }
  }
  .body {
    overflow-y: scroll;
    .item {
      background: #e9eef4;
      border-bottom: 1px solid #ccc;
      height: 24px;
      padding: 0 2px;
      &:hover {
        background: #739aba;
      }
      .check {
        @extend %check;
      }
      .sltIpt {
        width: calc(100% - 20px);
        padding: 0px 3px 2px 1px;
        /deep/.ant-select {
          .ant-select-selection {
            height: 18px;
            border: 1px solid #b0c7d5;
            border-radius: 2px;
            font-size: 12px;
            color: #0f2c3e;
            .ant-select-selection__rendered {
              line-height: 18px;
            }
          }
        }
        input {
          width: 100%;
          height: 18px;
          border-radius: 3px;
          font-size: 12px;
          color: #0f2c3e;
          line-height: 18px;
          border: 1px solid #b0c7d5;
        }
        span {
          font-size: 12px;
          color: #0f2c3e;
        }
      }
    }
    .item:nth-of-type(even) {
      background: #fff;
      &:hover {
        background: #739aba;
      }
    }
  }
}
</style>

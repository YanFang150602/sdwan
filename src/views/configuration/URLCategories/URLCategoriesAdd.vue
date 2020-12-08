<template>
  <div>
    <a-modal
      v-drag
      v-model="visible"
      title="Add URL Category"
      on-ok="handleOk"
      @cancel="handleCancel"
      width="420px"
    >
      <template slot="footer">
        <a-button key="submit" :loading="loading" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form.urlCategory" :rules="rules" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name" prop="name">
                  <a-input v-model="form.urlCategory.name"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description">
                  <a-input v-model="form.urlCategory.description"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <a-row>
            <a-col :span="10">
              <a-form-model-item>
                <a-form-model-item label="Confidence" prop="value">
                  <a-input v-model="form.urlCategory.confidence"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
            <a-col :span="10" style="marginLeft:20px">
              <a-form-model-item>
                <a-form-model-item label="Url File" prop="value">
                  <a-input v-model="form.urlCategory.urlFile"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="ft-table">
          <!-- 分页1 -->
          <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="URL Patterns">
              <!-- 表格 -->
              <a-row>
                <a-col :span="12">
                  <a-form-model-item>
                    <a-input v-model="form.name"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <v-pagination size="small" :layout="['prev', 'jumper', 'next']"></v-pagination>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <v-table
                    is-horizontal-resize
                    :columns="columns"
                    :table-data="tableData"
                    :height="180"
                    style="width: 100%"
                    isFrozen="true"
                    @on-custom-comp="addOneline"
                    error-content="Temporarily no data"
                  ></v-table>
                </a-col>
              </a-row>
            </a-tab-pane>
            <!-- 分页2 -->
            <a-tab-pane key="2" tab="URL String" force-render>
              <!-- 表格 -->
              <a-row>
                <a-col :span="12">
                  <a-form-model-item>
                    <a-input v-model="form.name"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <v-pagination size="small" :layout="['prev', 'jumper', 'next']"></v-pagination>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <v-table
                    is-horizontal-resize
                    :columns="columnsSecond"
                    :table-data="tableDataSecond"
                    :height="180"
                    style="width: 100%"
                    isFrozen="true"
                    @on-custom-comp="addOnelineSecond"
                  ></v-table>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
// import { addressAdd } from 'apis/address';
import { mapState } from 'vuex';
import { urlCategoriesSelect, urlCategoriesAdd } from 'apis/urlCategories';

import Vue from 'vue';
export default {
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        urlCategory: {
          name: '',
          deviceName: '',
          orgName: '',
          description: '',
          confidence: '',
          urlFile: '',
          urlPatterns: [],
          urlStrings: []
        }
      },
      // 表格
      tableData: [{ patternValue: '', reputation: '' }],
      tableList: {},
      columns: [
        {
          field: 'patternValue',
          title: 'Name',
          width: 130,
          titleAlign: 'left',
          columnAlign: 'left',
          componentName: 'patterns-input',
          isResize: true
        },
        {
          field: 'reputation',
          title: 'Confidence',
          width: 130,
          titleAlign: 'left',
          columnAlign: 'left',
          componentName: 'description-input',
          isResize: true
        },
        {
          title: '',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'add-oneline'
        }
      ],
      tableDataSecond: [{ reputation: '', stringValue: '' }],
      columnsSecond: [
        {
          field: 'stringValue',
          title: 'Name',
          width: 130,
          titleAlign: 'left',
          columnAlign: 'left',
          componentName: 'string-input',
          isResize: true
        },
        {
          field: 'reputation',
          title: 'Confidence',
          width: 130,
          titleAlign: 'left',
          columnAlign: 'left',
          componentName: 'description-input',
          isResize: true
        },
        {
          title: '',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'add-oneline'
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  directives: {
    // 拖拽自定义指令
    drag(el) {
      console.log('移动', el);
      // 将ant-modal的position改为静态，使拖拽框按照电脑屏幕定位
      // el.children[1].children[0].style.position = 'static';
      // 获取到ant-modal-content元素
      let targetEl = el.children[1].children[0].children[1];
      // targetEl.style.top = '100px';
      targetEl.onmousedown = function(e) {
        // 点下鼠标的位置
        let startX = e.pageX;
        let startY = e.pageY;
        // 点下鼠标的元素的位置
        let offsetX = targetEl.offsetLeft;
        let offsetY = targetEl.offsetTop;
        document.onmousemove = function(e) {
          // 计算出元素的left 和 top 值
          let dx = offsetX + (e.pageX - startX);
          let dy = offsetY + (e.pageY - startY);
          // // 进行拖拽范围的限制(不能超出屏幕)
          // dx = Math.max(0, dx);
          // dy = Math.max(0, dy);
          // let scrollWidth = window.innerWidth - targetEl.offsetWidth;
          // let scrollHeight = window.innerHeight - targetEl.offsetHeight;
          // dx = Math.min(scrollWidth, dx);
          // dy = Math.min(scrollHeight, dy);
          // 设置元素的left和top值，实现拖拽
          targetEl.style.left = dx + 'px';
          targetEl.style.top = dy + 'px';
        };
        // 鼠标弹起，取消鼠标移动事件
        targetEl.onmouseup = function() {
          document.onmousemove = null;
        };
      };
    }
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  methods: {
    async showModalAdd() {
      console.log(this.deviceName);
      this.visible = true;
      const { result } = await urlCategoriesSelect();
      this.select = result;
    },
    async handleOk() {
      console.log(this.tableDataSecond);
      console.log(this.deviceName);
      this.loading = true;
      this.form.urlCategory.orgName = this.organization;
      this.form.urlCategory.objectName = this.deviceName;
      this.form.urlCategory.objectType = this.objectType;
      this.form.urlCategory.urlPatterns = this.tableData;
      this.form.urlCategory.urlStrings = this.tableDataSecond;
      const res = await urlCategoriesAdd(this.form.urlCategory);
      console.log(res);
      this.loading = false;
      if (res.message === 'Success') {
        this.visible = false;
        this.$parent.tableForm();
      } else {
        this.visible = false;
        this.$message.error(res.message);
      }
    },
    handleCancel() {
      this.visible = false;
      this.form.urlCategory = {};
      this.tableDataSecond = [{ reputation: '', stringValue: '' }];
      this.tableData = [{ reputation: '', patternValue: '' }];
      console.log(this.form.urlCategory);
      // this.tableList.forEach(item => {
      //   item.key = 'res';
      //   item.value = '1234';
      // });
      // console.log(this.tableList);
      // this.clear();
      // this.$refs.ruleForm.resetFields();
    },
    clear() {},
    callback(key) {
      console.log(key);
    },
    // 表格的方法
    customCompFunc(params) {
      console.log(params, 78766676768);
    },
    customCompFuncSecond(params) {
      console.log(params, 78766676768);
    },

    addOneline({ index, field, $event, selectVal }) {
      console.log(index, field, $event, selectVal);
      if (!field)
        return this.tableData.splice(index + 1, 0, {
          reputation: '',
          patternValue: ''
        });
      if ($event) return (this.tableData[index][field] = $event.target.value);
      if (selectVal) return (this.tableData[index][field] = selectVal);
    },
    addOnelineSecond({ index, field, $event, selectVal }) {
      if (!field)
        return this.tableDataSecond.splice(index + 1, 0, {
          reputation: '',
          stringValue: ''
        });
      if ($event)
        return (this.tableDataSecond[index][field] = $event.target.value);
      if (selectVal) return (this.tableDataSecond[index][field] = selectVal);
      // this.tableDataSecond[index][field] = $event.target.value;
    }
  }
};

let props = {
  rowData: {
    type: Object
  },
  field: {
    type: String
  },
  index: {
    type: Number
  }
};
Vue.component('patterns-input', {
  template: `
    <a-input
      size="small"
      :value='rowData.patternValue'
      @input="$event => $emit('on-custom-comp',{index,field:'patternValue',$event})"
    />
   `,
  props
});
Vue.component('string-input', {
  template: `
    <a-input
      size="small"
      :value='rowData.stringValue'
      @input="$event => $emit('on-custom-comp',{index,field:'stringValue',$event})"
    />
   `,
  props
});
Vue.component('description-input', {
  template: `
    <a-select
      size="small"
      :value='rowData.reputation'
      @change="selectChange"
    >
     <a-select-option v-for="item in select" :value="item" :key="item">
         {{item}}
        </a-select-option>
    </a-select>
   `,
  props,
  data() {
    return { select: [] };
  },
  methods: {
    selectChange(selectVal) {
      const { index } = this;
      this.$emit('on-custom-comp', { selectVal, index, field: 'reputation' });
    }
  }
});
Vue.component('add-oneline', {
  template: `
    <a-button
      icon="plus"
      @click="$emit('on-custom-comp', {index} )"
      size="small"
    />
   `,
  props
});
</script>
<style lang="scss">
/deep/.v-table-title-cell .vertical-border .horizontal-border {
  display: none;
}
.ant-form-item-required {
  &::before {
    display: none;
  }
  &::after {
    content: '*' !important;
    color: #f5222d !important;
    font-size: 18px !important;
    margin-left: 4px !important;
    display: inline-block !important;
  }
}
</style>
<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-item-label > label::after {
  display: none;
}
// 弹框的样式
/deep/.ant-modal-content {
  max-height: 1000px;
  .ant-modal-header {
    height: 31px;
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
  .ant-modal-close-x {
    line-height: 35px;
  }
}
.title {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 400px;
    margin-bottom: 0;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-input {
      width: 100%;
      height: 20px;
    }
  }
}

.footer {
  // margin-top: 14px;
  margin-left: 5px;
  padding-top: 5px;
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }

  /deep/.ant-form-item {
    padding: 0;
    margin-bottom: 0;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-input {
      height: 20px;
    }
    .ant-select-selection--single {
      height: 20px;
    }
    // .ant-select .ant-select-focused .ant-select-enabled {
    //   width: 162px;
    // }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
}
.ft-table {
  /deep/.ant-form-item {
    padding: 0;
    width: 186px;
    margin-bottom: 0;
    margin: auto;
    .ant-input {
      // width: 100%;
      height: 20px;
    }
  }
  .ant-tabs {
    color: #fff;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab:hover {
    color: unset;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab-active {
    color: #fff;
  }
}

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
}
/deep/.ant-btn:nth-child(2) {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
}
/deep/.ant-modal-title {
  font-size: 12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
</style>

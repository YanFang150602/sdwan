<template>
  <div>
    <a-modal
      v-model="visible"
      title="Commit"
      on-ok="handleOk"
      width="865px"
      :maskClosable="false"
      v-drag
      wrapClassName="form-wrap"
    >
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :loading="loading"
          >Ok</a-button
        >
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        @validate="validate"
        layout="vertical"
      >
        <div class="title">
          <a-row type="flex" justify="start" align="bottom">
            <a-col
              :span="8"
              @mouseenter="enter('organization')"
              @mouseleave="leave"
              @mousemove="updateXY"
            >
              <a-form-model-item label="Organization" prop="organization">
                <a-select v-model="form.organization" @change="handleChange">
                  <a-select-option
                    :value="item.name"
                    v-for="(item, index) in organ"
                    :key="index"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-radio-group v-model="form.region" @change="onChange">
                  <a-radio value="MAIN">Template</a-radio>
                  <a-radio value="SERVICE">Service Template</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="title">
          <a-row type="flex" justify="start" align="bottom">
            <a-col
              :span="8"
              @mouseenter="enter('template')"
              @mouseleave="leave"
              @mousemove="updateXY"
            >
              <a-form-model-item label="Select Template" prop="template">
                <a-select
                  v-model="form.template"
                  :disabled="isDisabled"
                  @change="handleChangeTemplate"
                >
                  <a-select-option
                    :value="item.name"
                    v-for="(item, index) in Template"
                    :key="index"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox-group v-model="form.reboot">
                  <a-checkbox value="1">Reboot</a-checkbox>
                </a-checkbox-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-radio-group v-model="form.resource">
                  <a-radio value="merge">Auto Merge</a-radio>
                  <a-radio value="mode">Overwrite</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <a-table
          :columns="columns"
          :data-source="data"
          :row-selection="rowSelection"
          :pagination="false"
        />
      </a-form-model>
    </a-modal>
    <!-- task 提示信息 -->
    <TaskNotice :taskinfo="taskinfo" />
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </div>
</template>
<script>
import { commitOrg, selectTemplate, commitForm, commitOk } from 'apis/commit';
import { mapState } from 'vuex';
import tip from '@/mixins/tip';
import { select } from '@/validate/common';
import TaskNotice from 'components/TaskNotice';

const columns = [
  {
    title: 'Device',
    dataIndex: 'name',
    key: 'name',
    width: '20%'
  },
  {
    title: 'Device Type',
    dataIndex: 'deviceType',
    key: 'deviceType',
    width: '20%'
  },
  {
    title: 'Template State',
    dataIndex: 'status',
    width: '20%',
    key: 'status'
  },
  {
    title: 'Appliance State',
    dataIndex: 'syncStatus',
    width: '20%',
    key: 'syncStatus'
  },
  {
    title: 'Device Modified',
    dataIndex: 'deviceModified',
    width: '20%',
    key: 'deviceModified'
  }
];
const data = [
  {
    key: 1,
    name: '',
    children: [
      {
        key: 11,
        name: '',
        deviceType: '',
        status: '',
        syncStatus: '',
        deviceModified: ''
      }
    ]
  }
];

export default {
  components: { TaskNotice },
  mixins: [tip],
  data() {
    return {
      //任务进度查询
      taskinfo: {
        taskId: ''
        // type: ''
      },
      isDisabled: false,
      // 列表
      data,
      columns,
      // rowSelection,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          );
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
          // console.log(record.children[0].name);
          console.log(this.parameter.deviceList);
          this.parameter.deviceList.push(record.children[0].name);
          console.log(this.parameter.deviceList);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        }
      },
      loading: false,
      visible: false,
      form: {
        organization: '',
        region: 'MAIN',
        reboot: [],
        deviceList: [],
        resource: 'merge',
        template: ''
      },
      rules: {
        organization: [{ validator: select }],
        template: [{ validator: select }]
      },
      // 组织下拉框
      organ: [],
      // template下拉框
      Template: [],
      // 点击ok需要的参数
      parameter: {
        templateName: '',
        reboot: false,
        mode: '',
        deviceList: []
      }
    };
  },
  directives: {
    // 拖拽自定义指令
    drag(el) {
      // console.log('移动', el);
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
  watch: {
    'form.organization'(value) {
      console.log(value);
      if (value) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    data: {
      deep: true,
      handler(newVal, oldVal) {
        console.log(newVal);
        console.log('newVal:', newVal, 'oldVal:', oldVal, 88788);
      },
      immediate: true
    }
  },
  methods: {
    async showModalAdd() {
      this.visible = true;
      // 获取组织列表
      const res = await commitOrg();
      // console.log(res.result.organizations);
      this.organ = res.result.organizations;
      console.log(this.form.organization);
    },
    async handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      if (this.form.reboot.length > 0) {
        this.parameter.reboot = true;
      }
      this.parameter.mode = this.form.resource;
      this.parameter.templateName = this.form.template;
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          const res = await commitOk(this.parameter);
          console.log(res);
          if (res.message === 'Success') {
            this.visible = false;
            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              type: 'add'
            };
            this.form = {};
            this.data[0].name = '';
            this.data[0].children[0] = [];
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.$refs.ruleForm.resetFields();
    },
    async handleChange() {
      console.log(this.form.organization);
      const res = await selectTemplate({
        organization: this.form.organization,
        type: this.form.region
      });
      this.Template = res.result.template;
      console.log(this.Template);
    },
    async onChange(e) {
      console.log('radio checked', e.target.value);
      const res = await selectTemplate({
        organization: this.form.organization,
        type: e.target.value
      });
      console.log(res);
      this.Template = res.result.template;
    },
    // 列表的数据
    async handleChangeTemplate() {
      console.log(this.data);
      const res = await commitForm({ template: this.form.template });
      console.log(res.result.deviceDataList);
      res.result.deviceDataList.map(item => {
        console.log(item.name);
        // this.data.name = item.name;
        console.log(item.deviceData);
        this.$set(this.data[0], 'name', item.name);
        // this.$set(this.data[0], 'key', item.name);

        console.log(this.data[0].children);
        // this.children = item.deviceData;
        // console.log(item.deviceData[0]);
        this.children = item.deviceData[0];
        // console.log(this.children, 84378237);
        this.children.key = item.deviceData[0].name;
        this.data[0].children[0] = this.children;
        this.$set(this.data[0].children, 0, this.children);
        console.log(this.data);
        console.log(this.children);
        console.log(this.data[0].children[0]);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ant-table-thead > tr > th,
.ant-table-tbody > tr > td {
  padding: 0;
}
.ant-table-thead > tr > th {
  background: #b6c9db;
}
.ant-table-tbody > tr > td {
  background: #fff;
}
.ant-table {
  font-size: 12px;
  font-weight: 400;
  font-family: 'open_sansregular' !important;
}

.ant-form-item-label > label {
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
// // label样式
// /deep/.ant-modal-title {
//   font-size: 12px;
//   margin-left: -12px;
// }
// /deep/.ant-form label {
//   font-size: 12px;
// }
// /deep/.ant-modal-close-x {
//   line-height: 36px;
//   width: 40px;
// }
// // -----------------------
// /deep/.ant-form-explain {
//   display: none !important;
// }
// /deep/.ant-form-item-label > label::after {
//   display: none;
// }
.ant-checkbox-wrapper {
  color: #fff;
}
// .ant-form-item {
//   margin-bottom: 0px;
// }
// // 弹框的样式
// /deep/.ant-modal-content {
//   max-height: 1000px;
//   .ant-modal-header {
//     height: 31px;
//     background-color: #e9f4fc;
//     .ant-modal-title {
//       line-height: 8px;
//     }
//   }
//   .ant-modal-body {
//     // height: 193px;
//     padding: 8px;
//     padding-top: 10px;
//     background-color: #36536b;
//   }
//   .ant-modal-footer {
//     height: 50px;
//     background-color: #e9f4fc;
//   }
// }
.title {
  margin-bottom: 20px;
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 270px;
    .ant-form-item-label {
      line-height: 15px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-select-selection--single {
      width: 250px;
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: 20px;
    }
  }
}

// // 按钮
// /deep/.ant-btn-primary {
//   width: 70px;
//   height: 30px;
//   background-color: rgb(0, 149, 218);
//   border: none;
//   font-size: 12px;
// }
// /deep/.ant-btn:nth-child(2) {
//   width: 70px;
//   height: 30px;
//   background-color: #3f4a5b;
//   border: none;
//   color: #ffffff;
//   font-size: 12px;
// }
//
</style>

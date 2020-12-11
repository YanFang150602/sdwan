<template>
  <div class="main-con">
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showModal"
      @delete-item="groupDel"
      @search="search"
      @cancelSearch="cancelSearch"
    />
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="540"
      style="width: 100%"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
      error-content="Temporarily no data"
    ></v-table>
    <div>
      <a-modal
        v-drag
        v-model="visible"
        title="Add Qos Profile"
        on-ok="handleOk"
        @cancel="handleCancel"
        width="500px"
        :maskClosable="false"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk" :loading="loading">Ok</a-button>
          <a-button key="back" @click="handleCancel">Cancel</a-button>
        </template>
        <a-form-model :model="form.data" ref="ruleForm" :rules="rules">
          <div class="title">
            <a-row>
              <a-col :span="24">
                <a-form-model-item>
                  <a-form-model-item label="Name" class="mandatory" prop="name">
                    <a-input
                      :disabled="this.addFlag ? false : true"
                      size="small"
                      v-model="form.data.name"
                    />
                  </a-form-model-item>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-model-item>
                  <a-form-model-item label="Description">
                    <a-input size="small" v-model="form.data.description"/>
                  </a-form-model-item>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="High">
                  <a-select size="small" v-model="form.data.high">
                    <a-select-option
                      v-for="(item, index) in LossPriorityOption"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Low" prop="TrafficZero">
                  <a-select size="small" v-model="form.data.low">
                    <a-select-option
                      v-for="(item, index) in LossPriorityOption"
                      :key="index"
                      :value="item"
                    >{{ item }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="addtableBox">
            <div class="addtable">
              <div class="addtitle">Transmit Rate</div>
              <a-radio-group v-model="form.data.transmitRate" @change="transmitChange">
                <a-radio value="true">Rate (Kbps)</a-radio>
                <a-radio value="false">Rate (%)</a-radio>
              </a-radio-group>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item>
                    <a-form-model-item :label="TransmitLabel">
                      <a-input size="small" v-model="form.data.transmitValue"/>
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
            <div class="addtable">
              <div class="addtitle">Guaranteed Rate</div>
              <a-radio-group v-model="form.data.guaranteedRate" @change="guaranteedChange">
                <a-radio value="true">Rate (Kbps)</a-radio>
                <a-radio value="false">Rate (%)</a-radio>
              </a-radio-group>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item>
                    <a-form-model-item :label="GuaranteedLabel">
                      <a-input size="small" v-model="form.data.guaranteedValue"/>
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Queue 0 Weight" prop="TrafficZero">
                <a-select size="small" v-model="form.data.queueOne">
                  <a-select-option
                    v-for="(item, index) in TrafficClassOption"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Queue 1 Weight" prop="TrafficOne">
                <a-select size="small" v-model="form.data.queueTwo">
                  <a-select-option
                    v-for="(item, index) in TrafficClassOption"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Queue 2 Weight" prop="TrafficTwo">
                <a-select size="small" v-model="form.data.queueThree">
                  <a-select-option
                    v-for="(item, index) in TrafficClassOption"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Queue 3 Weight" prop="TrafficThree">
                <a-select size="small" v-model="form.data.queueFour">
                  <a-select-option
                    v-for="(item, index) in TrafficClassOption"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="main"></div>
          <div class="footer"></div>
        </a-form-model>
      </a-modal>
      <!-- 删除的弹框 -->
      <schedulerDel ref="AddressDeleteRef" :DeleName="idDele"></schedulerDel>
    </div>
  </div>
</template>
<script>
import {
  seleteList,
  schedulerAdd,
  schedulerForm,
  schedulerEdit
} from 'apis/scheduler';
import { mapState } from 'vuex';
import schedulerDel from './SchedulerDelete';
import Pagination from 'components/Pagination';
import common from '@/mixins/common';

export default {
  name: 'QosProfiles',
  components: {
    // AddressAdd,
    schedulerDel,
    // AddressEdit,
    Pagination
  },
  mixins: [common],
  data() {
    return {
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      addFlag: true,
      loading: false,
      TransmitLabel: 'Rate(Kbps)',
      GuaranteedLabel: 'Rate(Kbps)',
      // 删除弹框
      visibleDelete: false,
      // 查看弹框
      visibleCheck: false,
      // 表格
      tableData: [],
      LossPriorityOption: [],
      TrafficClassOption: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16'
      ],
      form: {
        data: {
          name: '',
          description: '',
          high: '',
          low: '',
          transmitRate: 'true',
          transmitValue: '',
          guaranteedRate: 'true',
          guaranteedValue: '',
          queueOne: '',
          queueTwo: '',
          queueThree: '',
          queueFour: ''
        }
      },
      columns: [
        {
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operation'
        },
        {
          field: 'high',
          title: 'high',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'low',
          title: 'low',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'transmitValue',
          title: 'Transmit Rate',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'guaranteedValue',
          title: 'Guaranteed Rate',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'queueOne',
          title: '0',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'queueTwo',
          title: '2',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'queueThree',
          title: '3',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'queueFour',
          title: '4',
          width: 50,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        maximum: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        minimum: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ]
      },
      addressCheck: {},
      // 删除传递参数
      idDele: '',
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0
    };
  },
  created() {
    this.tableForm();
    this.getSelete();
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  methods: {
    // 新增弹框
    showModal() {
      this.visible = true;
      this.addFlag = true;
      // this.form.data = {};
      this.form.data.transmitRate = 'true';
      this.form.data.guaranteedRate = 'true';
    },
    // 确认新增或修改按钮
    async handleOk() {
      this.form.data.deviceName = this.deviceName;
      this.form.data.orgName = this.organization;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          console.log(3211);
          if (this.addFlag) {
            this.addDrop();
          } else {
            this.changeDrop();
          }
        }
      });
    },
    async getSelete() {
      this.form.data.orgName = this.organization;
      this.form.data.deviceName = this.deviceName;
      const res = await seleteList(this.deviceName, this.organization);
      if (res.message === 'Success') {
        this.LossPriorityOption = res.result;
      } else {
        this.$message.error(res.message);
      }
      console.log(res);
    },
    // 新增
    async addDrop() {
      const res = await schedulerAdd(this.form.data);
      console.log(res);
      if (res.message == 'Success') {
        this.loading = false;
        this.visible = false;
        this.tableForm();
      } else {
        this.$message.error(res.message);
        this.loading = false;
      }
    },
    // 更改
    async changeDrop() {
      const res = await schedulerEdit(this.form.data);
      console.log(res);
      if (res.message == 'Success') {
        this.loading = false;
        this.visible = false;
        this.tableForm();
      } else {
        this.$message.error(res.message);
        this.loading = false;
      }
    },
    // 取消新增
    handleCancel() {
      this.visible = false;
      this.visibleDelete = false;
      this.loading = false;
      console.log('关闭');
      this.form.data = {};
      // this.clear();/
      this.$refs.ruleForm.resetFields();
      console.log(this.tableData);
    },
    // 删除弹框
    groupDel() {
      if (this.idDele) {
        this.$refs.AddressDeleteRef.showModalDelete();
      }
    },
    // 调用删除的接口
    async deleteData() {
      // const res = await schedulerMapsDelete({
      //   name: this.idDele,
      //   deviceName: this.deviceName,
      //   orgName: this.organization
      // });
      // if (res.message == 'Success') {
      //   this.tableForm();
      //   this.visibleDelete = false;
      // } else {
      //   this.$message.error(res.message);
      // }
    },
    transmitChange(e) {
      console.log(e.target.value);
      if (e.target.value == 'false') {
        this.TransmitLabel = 'Rate(%)';
      } else {
        this.TransmitLabel = 'Rate(Kbps)';
      }
    },
    guaranteedChange(e) {
      if (e.target.value == 'false') {
        this.GuaranteedLabel = 'Rate(%)';
      } else {
        this.GuaranteedLabel = 'Rate(Kbps)';
      }
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
      if (selection.length === 0) {
        this.idDele = '';
      }
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.idDele = rowData.name;
      console.log(this.idDele);
      // 添加单选
      const data = [];
      this.tableData.map(item => {
        item.name != rowData.name
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    // 修改
    async customCompFunc(params) {
      this.addFlag = false;
      this.visible = true;
      this.form.data = params.rowData;
      this.form.data.transmitRate = params.rowData.transmitRate.toString();
      this.form.data.guaranteedRate = params.rowData.guaranteedRate.toString();
      console.log(params);
    },
    async tableForm(offset, limit) {
      console.log(offset, limit);
      const res = await schedulerForm({
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: offset || 0,
        limit: limit || 20
      });
      console.log(res.result);
      if (res.ruselt && res.result.length > 0) {
        res.result.forEach(item => {
          console.log(item);
        });
      }
      this.totalCount = res.result.totalCount;
      this.tableData = res.result.data;
    },
    // 分页
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      const offset = (this.pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      this.tableForm(offset, limit);
      // this.$store.dispatch('Tabledevice', {
      //   organization: this.organization,
      //   offset: (this.pageIndex - 1) * this.pageSize,
      //   limit: this.pageSize,
      // });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      const offset = (this.pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      this.tableForm(offset, limit);
      // this.$store.dispatch('Tabledevice', {
      //   organization: this.organization,
      //   offset: (this.pageIndex - 1) * this.pageSize,
      //   limit: this.pageSize,
      // });
    },
    // 搜索框查询
    search(data) {
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.tableData = list;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      if (this.keyworks.trim() === '') {
        this.tableForm();
      }
    }
  },
  directives: {
    // 拖拽自定义指令
    drag(el) {
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
  }
};
</script>

<style lang="scss" scoped>
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
    height: 430px;
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
}
/deep/.ant-radio-wrapper {
  color: #f9f9f9;
}
/deep/.ant-form-item-label > label {
  color: #f9f9f9;
}
/deep/.ant-form-item {
  padding: 5px;
  margin-bottom: 0;
  color: #fff;
  margin: auto;
  /deep/.ant-form-item-label {
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
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}
.addtableBox {
  margin-top: 5px;
  display: flex;
  justify-content: flex-start;
}
.addtable {
  width: 233px;
  border: 1px solid #456880;
  margin-top: 10px;
  margin-left: 10px;
  padding: 16px 10px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  .addtitle {
    width: 100px;
    height: 21px;
    background: #507691;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    padding: 2px 5px;
    position: absolute;
    top: -11px;
    left: 10px;
  }
}
// 必填标识在右边
/deep/.mandatory .ant-form-item {
  .ant-form-item-label {
    label {
      &::after {
        display: block !important;
      }
    }
  }
}
/deep/.ant-modal-title {
  font-size: 12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
</style>

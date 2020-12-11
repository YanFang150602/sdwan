<template>
  <div class="devices main-con">
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
      is-vertical-resize
      :columns="columns"
      :table-data="tableData"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
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
        width="526px"
        :maskClosable="false"
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
                    <a-input size="small" v-model="form.data.description" />
                  </a-form-model-item>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="addtable">
            <div class="addtitle">Traffic Class</div>
            <a-row>
              <a-col :span="20">
                <a-form-model-item label="Traffic Class 0" prop="TrafficZero">
                  <a-select size="small" v-model="form.data.trafficClassZero">
                    <a-select-option
                      v-for="(item, index) in TrafficClassOption"
                      :key="index"
                      :value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="20">
                <a-form-model-item label="Traffic Class 1" prop="TrafficOne">
                  <a-select size="small" v-model="form.data.trafficClassOne">
                    <a-select-option
                      v-for="(item, index) in TrafficClassOption"
                      :key="index"
                      :value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="20">
                <a-form-model-item label="Traffic Class 2" prop="TrafficTwo">
                  <a-select size="small" v-model="form.data.trafficClassTwo">
                    <a-select-option
                      v-for="(item, index) in TrafficClassOption"
                      :key="index"
                      :value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="20">
                <a-form-model-item label="Traffic Class 3" prop="TrafficThree">
                  <a-select size="small" v-model="form.data.trafficClassThree">
                    <a-select-option
                      v-for="(item, index) in TrafficClassOption"
                      :key="index"
                      :value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <div class="main"></div>
          <div class="footer"></div>
        </a-form-model>
      </a-modal>
      <!-- 删除的弹框 -->
      <schedulerMapsDel
        ref="AddressDeleteRef"
        :DeleName="idDele"
      ></schedulerMapsDel>
    </div>
  </div>
</template>
<script>
import {
  seleteList,
  schedulerMapsAdd,
  schedulerMapsForm,
  schedulerMapsEdit
} from 'apis/schedulerMaps';
import Vue from 'vue';
import { mapState } from 'vuex';
import schedulerMapsDel from './SchedulerMapsDelete';
import Pagination from 'components/Pagination';
import common from '@/mixins/common';

export default {
  name: 'QosProfiles',
  components: {
    // AddressAdd,
    schedulerMapsDel,
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
      // 删除弹框
      visibleDelete: false,
      // 查看弹框
      visibleCheck: false,
      // 表格
      tableData: [],
      TrafficClassOption: [],
      form: {
        data: {
          name: '',
          description: '',
          trafficClassZero: '',
          trafficClassOne: '',
          trafficClassTwo: '',
          trafficClassThree: ''
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
          field: 'trafficClassZero',
          title: 'Traffic Class 0',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'trafficClassOne',
          title: 'Traffic Class 1',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'trafficClassTwo',
          title: 'Traffic Class 2',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'trafficClassThree',
          title: 'Traffic Class 3',
          width: 150,
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
      this.form.data = {};
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
        this.TrafficClassOption = res.result;
      } else {
        this.$message.error(res.message);
      }
      console.log(res);
    },
    // 新增
    async addDrop() {
      const res = await schedulerMapsAdd(this.form.data);
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
      const res = await schedulerMapsEdit(this.form.data);
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
      // this.clear();/
      // this.$refs.ruleForm.resetFields();
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
      console.log(params);
    },
    async tableForm(offset, limit) {
      console.log(offset, limit);
      const res = await schedulerMapsForm({
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
Vue.component('table-operation', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.name }}</a>
    </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
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
    height: 385px;
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
.addtable {
  width: 520px;
  border: 1px solid #456880;
  margin-top: 10px;
  padding: 3px 10px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  .addtitle {
    width: 90px;
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
</style>

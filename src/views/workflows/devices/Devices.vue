<template>
  <div class="devices main-con">
    <!-- 搜索框 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showModal"
      @delete-item="showModalDelete"
      @search="search"
      @cancel-search="cancelSearch"
    />
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      :style="{ height: 'calc(100% - 15px)' }"
      class="mainTable"
      is-vertical-resize
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      style="width: 100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 新增弹框 -->
    <div class="add">
      <a-modal
        v-drag
        v-model="visible"
        title="Add Device"
        on-ok="handleOk"
        width="865px"
        height="365px"
        :afterClose="clearData"
        :destroyOnClose="true"
        :maskClosable="false"
      >
        <DevicesAdd ref="devicesAddRef" @dew="dew" @tab="tab" @show="show"></DevicesAdd>
        <template slot="footer">
          <span style="float: left;">
            <a-button key="back" class="back" @click="handleBack" v-if="!showAdd.isShow">&lt; Back</a-button>
          </span>
          <a-button class="cancel" key="cancel" @click="handleCancel">Cancel</a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOk"
            v-if="isSave"
          >Save</a-button>
          <a-button
            key="Deploy"
            type="primary"
            @click="handleOkDeploy"
            v-if="showAdd.isExhibition"
          >Deploy</a-button>
          <a-button
            key="Continue"
            class="continue"
            @click="handleContinue"
            v-if="!showAdd.isExhibition"
          >Continue &gt;</a-button>
        </template>
      </a-modal>
    </div>
    <!-- 删除的弹框 -->
    <div>
      <a-modal
        v-model="visibleDelete"
        title="Confirm Decommission"
        @ok="handleOkDelete"
        width="430px"
        :maskClosable="false"
      >
        <template slot="footer">
          <a-button class="back" key="back" @click="handleCancelDelete">Yes</a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="handleOkDelete">No</a-button>
        </template>
        <!-- <DevicesDelete></DevicesDelete> -->
        <span>
          Are you sure you want to delete the selected device workflow(s)?
          Clicking on "Yes" will perform the following for the selected devices,
          this action can not be reverted.
        </span>
        <ul>
          <li>Deletes Appliance</li>
          <li>Disassociates device from device-group</li>
          <li>Deletes device from Hardware Inventory</li>
          <li>Deletes devices IPSec VPN profile information on all the Controllers</li>
        </ul>
        <!-- 单选框 -->
        <a-radio-group v-model="value" @change="onChange">
          <a-radio :style="radioStyle" :value="1">Erase Running Configuration</a-radio>
          <a-radio :style="radioStyle" :value="2">Reset to Factory Default</a-radio>
          <a-radio
            :style="radioStyle"
            :value="3"
          >Erase Running Configuration and Load Device Defaults</a-radio>
        </a-radio-group>
      </a-modal>
    </div>
    <!-- 查看弹框 -->
    <div>
      <a-modal
        v-drag
        v-model="visibleCheck"
        title="Edit Device"
        width="865px"
        :destroyOnClose="true"
        :maskClosable="false"
      >
        <DevicesCheck
          ref="devicesCheckRef"
          :formCheck="DeviceCheck"
          @DevCheck="DevCheck"
          @edit="edit"
        ></DevicesCheck>
        <template slot="footer">
          <span style="float: left;">
            <a-button
              key="back"
              class="back"
              @click="handleBackCheck"
              v-if="!showEdit.isShow"
            >&lt; Back</a-button>
          </span>
          <a-button class="cancel" key="back" @click="handleCancelCheck">Cancel</a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="handleOkCheck">Save</a-button>
          <a-button
            type="primary"
            key="Deploy"
            @click="handleOkDeployCheck"
            v-if="showEdit.isExhibition"
          >Deploy</a-button>
          <a-button
            key="Continue"
            class="continue"
            @click="handleContinueCheck"
            v-if="!showEdit.isExhibition"
          >Continue &gt;</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import DevicesAdd from './DevicesAdd';
// import DevicesDelete from './DevicesDelete';
import DevicesCheck from './DevicesCheck';
import Pagination from 'components/Pagination';
import { mapState, mapActions } from 'vuex';
import {
  devicesTableForm,
  devicesDelete,
  addDevices,
  DeviceCheck,
  DeviceEdit,
  // DeviceSearch,
  DeviceDeploy
} from 'apis/workFlows';

import {
  DEVICES_HANDLE,
  DEVICES_SHOW,
  DEVICES_BID,
  DEVICES_SHOWADD,
  DEVICES_HANDLEADD,
  DEVICES_BIDADD
} from '@/store/mutation-types';
export default {
  components: {
    DevicesAdd,
    // DevicesDelete,
    DevicesCheck,
    Pagination
  },
  data() {
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 删除弹框
      visibleDelete: false,
      // 查看弹框
      visibleCheck: false,
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'deviceName',
          title: 'Name',
          width: 210,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'vTableName'
        },
        {
          field: 'siteId',
          title: 'Global Device ID',
          width: 200,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'workflowStatus',
          title: 'Status',
          width: 210,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedTime',
          title: 'Last Modified Time',
          width: 230,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastModifiedBy',
          title: 'Last Modified By',
          width: 230,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 删除弹框
      loading: false,
      // 删除参数
      dele: {
        ids: [],
        cleanConfig: '',
        restConfig: '',
        loadDeviceDefaults: ''
      },
      // 新增的参数
      devAdd: {},
      // 查看的数据
      DeviceCheck: {},
      // 编辑需要传入的参数
      dev: {},
      // 当行的数据
      paramsCheck: {},
      // 接收子组件传递来的部署的数据
      dep: {},
      // 部署传参新增
      depl: { id: '' },
      isSave: true,
      // 部署传参查看
      deplCheck: { id: '' },
      // 编辑数据
      editCheck: {},
      // 接收查看弹框里面的显示与隐藏
      showCheck: {},
      // 查看显示与隐藏
      sdShow: {},
      // 单选框
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    };
  },
  computed: {
    ...mapState(['device', 'organization', 'showAdd']),
    ...mapState({
      showEdit: 'show'
    })
  },
  created() {
    //获取组织列表
    // this.getNameList();
  },
  methods: {
    ...mapActions(['getNameList']),
    // 分页
    pageChange(pageIndex) {
      // this.offset = (pageIndex - 1) * this.pageSize;
      this.pageIndex = pageIndex;

      this.lists();
    },
    pageSizeChange(pageSize) {
      this.offset = 1;
      this.pageSize = pageSize;
      this.lists();
    },

    async lists() {
      const { result } = await devicesTableForm({
        orgname: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize,
        deep: true
      });
      this.totalCount = result.totalCount;
      //表单源获取数据
      this.tableData = result['versanms.sdwan-device-list'];
    },

    // 新增弹框
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      this.$refs.devicesAddRef.$refs.ruleForm.validate(async (valid, res) => {
        console.log(this.$refs.devicesAddRef.$refs.ruleForm);
        console.log(res);
        if (valid) {
          this.showMessage();
          const res = await addDevices(this.devAdd);
          console.log(res);
          if (!res.message || res.message !== 'Success')
            return this.$message.error(res.message);
          this.visible = false;
          this.$store.commit(DEVICES_HANDLEADD);
          this.clearAddDevice();
          this.$message.success('Add device successfully.');
          this.lists();
        }
      });
    },
    async showMessage() {
      const res = await addDevices(this.devAdd);
      if (res.message && res.message === 'Success') {
        this.visible = false;
        this.$store.commit(DEVICES_HANDLEADD);
        this.clearAddDevice();
        this.$message.success('Add device successfully.');
      } else {
        this.$message.error(res.message);
      }
      // 刷新表格数据
      this.lists();
    },
    handleCancel() {
      this.visible = false;
      this.$store.commit(DEVICES_HANDLEADD);
      this.clearAddDevice();
      this.$refs.devicesAddRef.$refs.ruleForm.resetFields();
    },
    // 删除弹框
    showModalDelete() {
      this.visibleDelete = true;
    },
    handleOkDelete() {
      this.visibleDelete = false;
    },
    async handleCancelDelete() {
      const res = await devicesDelete(this.dele);
      console.log(res);
      if (res.message === 'Success') {
        this.$message.success('Successfully deleted');
        this.visibleDelete = false;
      } else {
        this.$message.error(res.message);
      }
      // 刷新表格数据
      this.lists();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.ids.push(item.deviceName);
        // this.dele.id = item.deviceName;
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.ids.push(item.deviceName);
        // this.dele.id = item.deviceName;
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      if (params.type === 'delete') {
        this.$delete(this.tableData, params.index);
      } else if (params.type === 'edit') {
        this.visibleCheck = true;
        this.lastCheckDevice = this.curCheckDevice;
        this.curCheckDevice = params.rowData.deviceName;
        if (this.lastCheckDevice != this.curCheckDevice) {
          this.$store.commit(DEVICES_HANDLE);
        }
      }
      const res = await DeviceCheck(params.rowData.deviceName);
      this.DeviceCheck = res.result;
      console.log(this.DeviceCheck);
      this.paramsCheck = params;
      this.$refs.devicesCheckRef.DeviceGroups();
      const orgName = this.DeviceCheck.orgName;
      localStorage.ogn = orgName;
      // localStorage.setItem('ogn', orgName);
      console.log(localStorage.ogn);
    },
    // 接受表单的值
    dew(aa) {
      this.devAdd = { ...aa };
    },
    // 编辑接口
    handleCancelCheck() {
      this.$store.commit(DEVICES_HANDLE);
      this.visibleCheck = false;
    },
    async handleOkCheck() {
      let isOK = this.satisfyCheckValidation();

      if (isOK) {
        const res = await DeviceEdit(this.paramsCheck.rowData.deviceName, {
          ...this.dev
        });
        if (res.message && res.message === 'Success') {
          this.visibleCheck = false;
          this.$store.commit(DEVICES_HANDLE);
          this.$message.success('Edit device successfully.');
        } else {
          this.$message.error(res.message);
        }
      }
    },
    // 接收查看编辑表单的数据
    DevCheck(check) {
      this.dev = { ...check };
    },
    //设备查询old
    // async search() {
    //   const res = await DeviceSearch(this.keyworks);
    //   console.log(res);
    //   this.$store.dispatch('Tabledevice', {
    //     deep: true,
    //     orgname: this.organization,
    //     offset: 0,
    //     limit: this.pageSize
    //   });
    // },

    // 搜索框设备查询
    search(data) {
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.device['versanms.sdwan-device-list'].filter(item =>
        item.deviceName.toLowerCase().includes(keyword)
      );
      this.totalCount = list.length;
      this.device['versanms.sdwan-device-list'] = list;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      this.pageIndex = 1;
      this.lists();
    },

    // 新增中的部署按钮
    async handleOkDeploy() {
      console.log('deploy', this.$refs.devicesAddRef.dev);
      this.depl.id = this.devAdd.deviceName;
      await addDevices(this.devAdd);
      const res = await DeviceDeploy(this.depl);
      if (res.message && res.message === 'Success') {
        this.visible = false;
        this.$store.commit(DEVICES_HANDLEADD);
        this.clearAddDevice();
        this.$message.success('Deploy device successfully.');
        // 刷新表格数据
        this.lists();
      }

      this.$store.dispatch('Tabledevice', {
        deep: true,
        orgname: this.organization,
        offset: 0,
        limit: this.pageSize
      });
    },
    // 查看编辑中的部署
    async handleOkDeployCheck() {
      this.visibleCheck = false;
      this.$store.commit(DEVICES_HANDLE);
      this.deplCheck.id = this.dev.deviceName;
      await DeviceEdit(this.paramsCheck.rowData.deviceName, { ...this.dev });
      const res = await DeviceDeploy(this.deplCheck);
      if (res.message !== 'Success') return this.$message.error(res.message);
      this.visibleCheck = false;
      this.$store.commit(DEVICES_HANDLE);
      this.$message.success('Deploy device successfully.');
    },
    // 接收子组件传递过来的部署的数据
    tab(deploy) {
      this.dep = { ...deploy };
    },
    // 查看编辑中的编辑按钮
    async handleOkEditCheck() {
      this.visibleCheck = false;
      this.$store.commit(DEVICES_HANDLE);
      await DeviceEdit(this.dev.deviceName, { ...this.editCheck });
    },
    // 接受编辑数据
    edit(edit) {
      this.editCheck = { ...edit };
    },
    clearData() {
      this.dep = {};
      this.clearAddDevice();
    },
    show(xs) {
      this.sdShow = { ...xs };
    },
    handleBack() {
      let method =
        this.showAdd.curIndex === 1 ? DEVICES_HANDLEADD : DEVICES_SHOWADD;
      this.$store.commit(method);
    },
    handleContinue() {
      let isJump = this.satisfyAddValidation();

      if (isJump) {
        let method =
          this.showAdd.curIndex === 0 ? DEVICES_SHOWADD : DEVICES_BIDADD;
        this.$store.commit(method);
      }
    },
    handleBackCheck() {
      let method = this.showEdit.curIndex === 1 ? DEVICES_HANDLE : DEVICES_SHOW;
      this.$store.commit(method);
    },
    handleContinueCheck() {
      let isJump = this.satisfyCheckValidation();

      if (isJump) {
        let method = this.showEdit.curIndex === 0 ? DEVICES_SHOW : DEVICES_BID;
        this.$store.commit(method);
      }
    },
    satisfyAddValidation() {
      let isOK = true;
      if (this.showAdd.curIndex != 2) {
        this.$refs.devicesAddRef.$refs.ruleForm.validate(valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        });
      }
      return isOK;
    },
    satisfyCheckValidation() {
      let isOK = true;
      if (this.showEdit.curIndex != 2) {
        this.$refs.devicesCheckRef.$refs.ruleForm.validate(valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        });
      }
      return isOK;
    },
    clearAddDevice() {
      this.$store.commit(DEVICES_HANDLEADD);
      this.$refs.devicesAddRef.dev.deviceName = '';
      this.$refs.devicesAddRef.dev.orgName = '';
      this.$refs.devicesAddRef.dev.serialNumber = '';
      this.$refs.devicesAddRef.dev.deviceGroup = '';
      this.$refs.devicesAddRef.dev.region = '';
      this.$refs.devicesAddRef.dev.bandwidth = '';
      this.$refs.devicesAddRef.initBandwidth();
      this.$refs.devicesAddRef.dev.locationInfo = {};
      this.devAdd.deviceName = '';
      this.devAdd.orgName = '';
      this.devAdd.serialNumber = '';
      this.devAdd.deviceGroup = '';
      this.devAdd.region = '';
      this.devAdd.bandwidth = '';
      this.devAdd.locationInfo = {};
    },
    // 单选框
    onChange(e) {
      console.log('radio checked', e.target.value);
      if (e.target.value == 1) {
        this.dele.cleanConfig = true;
        this.dele.restConfig = false;
        this.dele.loadDeviceDefaults = false;
      } else if (e.target.value == 2) {
        this.dele.cleanConfig = false;
        this.dele.restConfig = true;
        this.dele.loadDeviceDefaults = false;
      } else if (e.target.value == 3) {
        this.dele.cleanConfig = false;
        this.dele.restConfig = false;
        this.dele.loadDeviceDefaults = true;
      }
    }
  },
  watch: {
    a(val, oldVal) {
      //普通的watch监听
      console.log('a: ' + val, oldVal);
    },
    b: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        console.log('b.c: ' + val.c, oldVal.c);
      },
      deep: true //true 深度监听
    },
    organization: {
      handler: 'lists',
      immediate: true
    }
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
  }
};
</script>

<style lang="scss" scoped>
.devices {
  height: 100%;
  padding: 5px 20px 30px 15px;
  // 搜索栏与表格主体的间隔
  .table-header {
    margin-bottom: 10px;
    height: 22px;
    // 统一搜索框这行的样式统一，不需要以下样式
    // /deep/.search-bar {
    //   .ant-input {
    //     width: 700px;
    //     color: #6a6f75;
    //     border: 1px solid #b0c7d5;
    //     height: 20px;
    //     border-radius: 4px;
    //     font-size: 12px;
    //     line-height: 18px;
    //     &:focus {
    //       box-shadow: none;
    //       border-color: #b0c7d5;
    //     }
    //   }
    // }
    // 统一分页器字体颜色
    .pagination {
      color: #0f2c3e;
    }
  }
}
// 解决拖拽超出宽度丢失的bug
/deep/ .ant-modal-wrap {
  overflow: visible;
}
/deep/ .ant-modal {
  // 修改modal字体大小为12px
  font-size: 12px;
  .ant-modal-content {
    max-height: 325px;
    .ant-modal-close-x {
      width: 30px;
      height: 34px;
      line-height: 34px;
      color: #0d496a;
    }
    .ant-modal-header {
      padding: 6px 10px;
      background-color: #e9f4fc;
      .ant-modal-title {
        font-size: 12px;
        line-height: 22px;
      }
    }
    .ant-modal-body {
      font-size: 12px;
      padding: 10px;
      background-color: #36536b;
      // 三个tab下边框和下边距
      .switchover {
        border-bottom: 1px solid #456880;
        margin-bottom: 10px;
      }
    }
    .ant-modal-footer {
      background-color: #e9f4fc;
    }
  }
  // 修改按钮样式
  .ant-btn {
    color: #fff;
    border: none;
    &:hover {
      border: none;
      opacity: 0.8;
    }
  }
  .back,
  .continue {
    background-color: #a7d054;
  }
  .cancel {
    background-color: #3f4a5b;
  }
}
</style>

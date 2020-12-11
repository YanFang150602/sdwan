<template>
  <div class="devices main-con">
    <!--搜索栏-->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      :flag="false"
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
      :style="{ height: 'calc(100% - 15px)' }"
      column-width-drag
      is-horizontal-resize
      is-vertical-resize
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
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Pagination from 'components/Pagination';
import { adDeviceForm } from 'apis/adAppliances';

export default {
  components: {
    Pagination
  },
  data() {
    return {
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      keyworks: '',
      current: ['mail'],
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          titleAlign: 'center',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operation'
        },
        {
          field: 'ipAddress',
          title: 'Mgmt.Address',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'type',
          title: 'Type',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'createdAt',
          title: 'Time Created',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'startTime',
          title: 'Service Start Time',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'softwareVersion',
          title: 'Software Version',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'branchId',
          title: 'Site ID',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ownerOrg',
          title: 'Organizations',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'syncStatus',
          title: 'Config Synchronized',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'pingStatus',
          title: 'Reachability',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'servicesStatus',
          title: 'Service',
          width: 90,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ]
    };
  },

  created() {
    // this.$store.dispatch('getNameList');
    console.log(this.deviceFrom);
    this.tableForm();
  },
  methods: {
    onClick(params) {
      console.log(params);
      if (params.key === 'Devices Templates') {
        this.saveObjectType('template');
        this.$router.push({
          name: 'CommonTemplate',
          params: { name: 'ceshi001' }
        });
      } else if (params.key === 'Devices') {
        this.saveObjectType('device');
      }
    },
    // 分页
    queryDevice() {
      this.$store.dispatch('getNameList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.$store.dispatch('getNameList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.$store.dispatch('getNameList', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.push(item.deviceName);
      });
      const newArr = Array.from(new Set(this.dele));
      this.dele = newArr;
      console.log(this.dele);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      selection.forEach(item => {
        console.log(item.deviceName);
        this.dele.push(item.deviceName);
      });
      const newArr = Array.from(new Set(this.dele));
      this.dele = newArr;
      console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    customCompFunc(params) {
      console.log(params);
      if (params.type === 'jump') {
        //记录deviceName
        this.saveDeviceName({ deviceName: params.rowData.name });
        this.saveObjectType('device');
        // device 对于的home组织名称列表
        this.getNameListDevice(params.rowData.name);
        this.$router.push({
          name: 'DeviceConfig',
          params: { name: params.rowData.name }
        });
      }
    },
    async tableForm() {
      const res = await adDeviceForm({
        offset: 0,
        limit: 20
      });
      console.log(res);
      this.tableData = res.result.appliances;
    },
    ...mapMutations(['saveDeviceName', 'saveObjectType']),
    ...mapActions(['getNameListDevice'])
  },
  computed: {
    ...mapState(['deviceFrom', 'organization'])
  }
};
import Vue from 'vue';
Vue.component('table-operation', {
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
  template: `<span>
        <a href="" @click.stop.prevent="update(rowData,index)">{{rowData.name}}</a>&nbsp;
        </span>`,
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'jump', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>

<style lang="scss" scoped>
.devices {
  padding: 5px 20px 30px 15px;
  /deep/.v-table-rightview {
    right: unset;
  }
  /deep/.search-bar {
    .ant-input {
      width: 400%;
      color: #6a6f75;
      border: 1px solid #b0c7d5;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 18px;
      &:focus {
        box-shadow: none;
        border-color: #b0c7d5;
      }
    }
  }
}

/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
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
    background-color: #e9f4fc;
  }
}
.ant-dropdown-link {
  margin-left: 10px;
}
</style>

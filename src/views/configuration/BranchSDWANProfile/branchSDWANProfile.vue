<template>
  <div class="qosProfiles main-con">
    <!-- 搜索框 -->
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
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 新增弹框 -->
    <branchSDWANProfileAdd
      ref="branchSDWANProfileAddRef"
    ></branchSDWANProfileAdd>
    <!-- 删除的弹框 -->
    <branchSDWANProfileDelete
      ref="branchSDWANProfileDeleteRef"
      :SDWANProfileDelete="dele"
    ></branchSDWANProfileDelete>
    <!-- 查看弹框 -->
    <branchSDWANProfileEdit
      ref="branchSDWANProfileEditRef"
      :SDWANProfileEdit="checkInformation"
    ></branchSDWANProfileEdit>
  </div>
</template>

<script>
import { branchForm } from 'apis/branchSDWANProfile';

import { mapState } from 'vuex';
import branchSDWANProfileAdd from './branchSDWANProfileAdd';
import branchSDWANProfileEdit from './branchSDWANProfileEdit';
import branchSDWANProfileDelete from './branchSDWANProfileDelete';
import Pagination from 'components/Pagination';

export default {
  name: 'BranchSDWANProfile',
  components: {
    branchSDWANProfileAdd,
    branchSDWANProfileEdit,
    branchSDWANProfileDelete,
    Pagination
  },
  data() {
    return {
      // 搜索框
      keyworks: '',
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
          field: 'name',
          title: 'Branch Sdwan Profile',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'dhGroup',
          title: 'DH-Group Number',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'dhGroupSet',
          title: 'DH-Group Set Number',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.dhGroupSet !== null) {
              const res = rowData.dhGroupSet.join(',');
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'lifeTime',
          title: 'Life-time',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'rekeyTime',
          title: 'Rekey-time',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'transform',
          title: 'Encryption and Hashing Aigorithm',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'transformSet',
          title: 'Encryption and Hashing Aigorithm',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.transformSet !== null) {
              const res = rowData.transformSet.join(',');
              return `<span>${res}</span>`;
            }
          }
        }
      ],
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100,
      // 查看信息
      checkInformation: {},
      // 删除的数据
      dele: {
        deviceName: '',
        orgName: '',
        branchSdwanProfileNames: []
      }
    };
  },
  created() {
    this.tableForm();
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  methods: {
    // 新增弹框
    showModal() {
      this.$refs.branchSDWANProfileAddRef.showModalAdd();
    },
    // 删除弹框
    groupDel() {
      this.$refs.branchSDWANProfileDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name, 12331231312313231);
      if (rowData.name && rowData.name !== null) {
        this.dele.branchSdwanProfileNames.push(rowData.name);
      }
      this.dele.deviceName = this.deviceName;
      this.dele.orgName = this.organization;
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      console.log(params.rowData);
      this.$refs.branchSDWANProfileEditRef.showModalEdit();
      this.checkInformation = params.rowData;
    },
    // 表格
    async tableForm() {
      const res = await branchForm({
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: 0,
        limit: 20
      });
      console.log(res);
      this.tableData = res.result.data;
      this.totalCount = res.result.totalCount;
    },
    // 搜索框设备查询
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
    },
    // 分页
    async pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      const res = await branchForm({
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      this.tableData = res.result.data;
    },
    async pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      const res = await branchForm({
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      this.tableData = res.result.data;
    }
  }
};
import Vue from 'vue';
Vue.component('table-operationDevice', {
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
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>

<style lang="scss" scoped>
.qosProfiles {
  padding: 5px 20px 30px 15px;
  /deep/.v-table-rightview {
    right: unset;
  }
  /deep/.search-bar {
    .ant-input {
      width: 700px;
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
</style>

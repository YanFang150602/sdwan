<template>
  <div class="devices">
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
      :columns="columns"
      :table-data="tableData"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="540"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 新增弹框 -->
    <ApplicationGroupsAdd ref="GroupsAddRef"></ApplicationGroupsAdd>
    <!-- 删除的弹框 -->
    <ApplicationGroupsDelete ref="GroupsDeleteRef" :GroupDelete="dele"></ApplicationGroupsDelete>
    <!-- 查看弹框 -->
    <ApplicationEdit ref="GroupsEditRef"></ApplicationEdit>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Pagination from 'components/Pagination';
import { appGroupsForm } from 'apis/applicationGroups';
import ApplicationGroupsDelete from './ApplicationGroupsDelete';
import ApplicationGroupsAdd from './ApplicationGroupsAdd';
import ApplicationEdit from './ApplicationEdit';

export default {
  name: 'QosProfiles',
  components: {
    Pagination,
    ApplicationGroupsDelete,
    ApplicationGroupsAdd,
    ApplicationEdit
  },
  data() {
    return {
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
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'description',
          title: 'Description',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'predefinedApps',
          title: 'Application',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.predefinedApps && rowData.predefinedApps.length > 0) {
              const res = rowData.predefinedApps;
              return `<span>${res}</span>`;
            }
          }
        }
      ],
      addressCheck: {},
      // 删除传递参数
      dele: {
        name: '',
        objectName: '',
        orgName: '',
        objectType: ''
      },
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100
    };
  },
  created() {
    this.tableForm();
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  methods: {
    // 新增弹框
    showModal() {
      this.$refs.GroupsAddRef.showModalAdd();
    },
    // 删除弹框
    groupDel() {
      this.$refs.GroupsDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.dele.name = rowData.name;
      this.dele.orgName = this.organization;
      this.dele.objectType = this.objectType;
      this.dele.objectName = this.deviceName;
      console.log(this.dele);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      console.log(params);
      this.$refs.GroupsEditRef.showModalEdit(params);

      // this.addressCheck = params.rowData;
      // this.addressCheck.tags = this.addressCheck.tags || [];
      // if (this.addressCheck.description === 'null') {
      //   this.addressCheck.description = '';
      // }
      // console.log(this.addressCheck);
      // this.$refs.AddressEditRef.showModalEdit();
    },
    async tableForm() {
      const res = await appGroupsForm({
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization,
        offset: 0,
        limit: 25
      });
      console.log(res);
      if (res.result.data && res.result.data !== 'null') {
        this.tableData = res.result.data;
        this.totalCount = res.result.totalCount;
      }
    },
    // 分页
    async pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      const res = await appGroupsForm({
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization,
        offset: 0,
        limit: 25
      });
      console.log(res);
      this.tableData = res.result.data;
    },
    async pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      const res = await appGroupsForm({
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization,
        offset: 0,
        limit: 25
      });
      console.log(res);
      this.tableData = res.result.data;
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
  }
};
import Vue from 'vue';
// import { import } from '@babel/types';
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
.devices {
  // padding: 5px 20px 30px 15px;
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

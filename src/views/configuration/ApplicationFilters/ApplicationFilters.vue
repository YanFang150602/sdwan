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
      :title-rows="titleRows"
    ></v-table>
    <!-- 新增弹框 -->
    <AppFilter ref="AppFilterRef"></AppFilter>
    <!-- 删除的弹框 -->
    <AppFilterDelete ref="AppFilterDeleteRef" :FilterDelete="dele"></AppFilterDelete>
    <!-- 查看弹框 -->
    <AppFilterEdit ref="AppFilterEditRef"></AppFilterEdit>
  </div>
</template>
<script>
import { FilterForm } from 'apis/applicationFilter';
import { mapState } from 'vuex';
import Pagination from 'components/Pagination';
import AppFilter from './AppFilter';
import AppFilterDelete from './AppFilterDelete';
import AppFilterEdit from './AppFilterEdit';

export default {
  name: 'QosProfiles',
  components: {
    Pagination,
    AppFilter,
    AppFilterDelete,
    AppFilterEdit
  },
  data() {
    return {
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 查看弹框
      visibleCheck: false,
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          field: 'checked',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'description',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },

        {
          field: 'family',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.family && rowData.family.length > 0) {
              const res = rowData.family.join(',');
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'subfamily',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.subfamily && rowData.subfamily.length > 0) {
              const res = rowData.subfamily.join(',');
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'productivity',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.productivity && rowData.productivity.length > 0) {
              const res = rowData.productivity.join(',');
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'securityTag',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.securityTag && rowData.securityTag.length > 0) {
              const res = rowData.securityTag.join(',');
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'sdwanTag',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.sdwanTag && rowData.sdwanTag.length > 0) {
              const res = rowData.sdwanTag.join(',');
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'generalTag',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.generalTag && rowData.generalTag.length > 0) {
              const res = rowData.generalTag.join(',');
              return `<span>${res}</span>`;
            }
          }
        }
      ],
      titleRows: [
        [
          {
            fields: ['checked'],
            title: '',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['name'],
            title: 'Name',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['description'],
            title: 'Description',
            titleAlign: 'left',
            rowspan: 2
          },

          {
            fields: ['family'],
            title: 'Family',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['subfamily'],
            title: 'subFamily',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['productivity'],
            title: 'Productivity',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['securityTag', 'sdwanTag', 'generalTag'],
            title: 'Source',
            titleAlign: 'center',
            colspan: 3
          }
        ],
        [
          {
            fields: ['securityTag'],
            title: 'Security',
            titleAlign: 'left'
          },
          {
            fields: ['sdwanTag'],
            title: 'SDWAN',
            titleAlign: 'left'
          },

          {
            fields: ['generalTag'],
            title: 'General',
            titleAlign: 'left'
          }
        ]
      ],
      addressCheck: {},
      // 删除传递参数
      dele: {
        name: '',
        objectName: '',
        objectType: '',
        orgName: ''
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
      this.$refs.AppFilterRef.showModalAdd();
    },
    // 删除弹框
    groupDel() {
      this.$refs.AppFilterDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.dele.name = rowData.name;
      this.dele.objectName = this.deviceName;
      this.dele.objectType = this.objectType;
      this.dele.orgName = this.organization;
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params) {
      console.log(params.rowData.name);
      this.$refs.AppFilterEditRef.showModalEdit(params.rowData);
    },
    async tableForm() {
      const res = await FilterForm({
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization,
        offset: 0,
        limit: 25
      });
      console.log(res.result);
      if (res.ruselt && res.result.length > 0) {
        res.result.forEach(item => {
          console.log(item);
        });
      }
      this.tableData = res.result.data;
      this.totalCount = res.result.totalCount;
    },
    // 分页
    async pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      const res = await FilterForm({
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
      const res = await FilterForm({
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

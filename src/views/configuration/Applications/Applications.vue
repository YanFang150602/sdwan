<template>
  <div class="devices main-con">
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
      :select-all="delItem"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customCompFunc"
      :title-rows="titleRows"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 新增弹框 -->
    <ApplicationAdd ref="ApplicationAddRef"></ApplicationAdd>
    <!-- 查看弹框 -->
    <ApplicationEdit
      ref="ApplicationEditRef"
      :ApplicationEdit="checkInformation"
    ></ApplicationEdit>
    <!-- 删除的弹框 -->
    <ApplicationDelete
      ref="ApplicationDeleteRef"
      :ApplicationDelete="dele"
    ></ApplicationDelete>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ApplicationAdd from './ApplicationAdd';
import ApplicationEdit from './ApplicationEdit';
import ApplicationDelete from './ApplicationDelete';
import { applicationForm } from 'apis/application';
import Pagination from 'components/Pagination';

export default {
  name: 'URLCategories',
  components: {
    ApplicationAdd,
    ApplicationEdit,
    ApplicationDelete,
    Pagination
  },
  data() {
    return {
      // 搜索框
      keyworks: '',
      // 删除的数据
      dele: {
        name: '',
        objectName: '',
        orgName: '',
        objectType: ''
      },
      //查看数据
      checkInformation: {},
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
          componentName: 'app-qos-name'
        },

        {
          field: 'precedence',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destination',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'family',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'subfamily',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'risk',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'productivity',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'securityTag',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            const res = rowData.securityTag.join(',');
            return `<span>${res}</span>`;
          }
        },
        {
          field: 'sdwanTag',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            const res = rowData.sdwanTag.join(',');
            return `<span>${res}</span>`;
          }
        },
        {
          field: 'generalTag',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            const res = rowData.generalTag.join(',');
            return `<span>${res}</span>`;
          }
        },
        {
          field: 'appTimeout',
          width: 50,
          columnAlign: 'left',
          isResize: true
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
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['precedence'],
            title: 'Precedence',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['destination'],
            title: '#Rules',
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
            fields: ['risk'],
            title: 'Risk',
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
          },
          {
            fields: ['appTimeout'],
            title: 'Application Timeout(sec)',
            titleAlign: 'left',
            rowspan: 2
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
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0
    };
  },
  created() {
    this.tableForm();
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  methods: {
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
    },
    // 新增弹框
    showModal() {
      this.$refs.ApplicationAddRef.showModalAdd();
    },
    // 删除弹框
    groupDel() {
      this.$refs.ApplicationDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    //获取删除表单的name
    delItem(selection, rowData) {
      // 添加单选
      const data = [];
      this.tableData.map(item => {
        item.name != rowData.name
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
      this.delParam.data = rowData.name;
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.dele.name = rowData.name;
      this.dele.objectName = this.deviceName;
      this.dele.orgName = this.organization;
      this.dele.objectType = this.objectType;
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    customCompFunc(params) {
      console.log(params, 78766676768);
      this.$refs.ApplicationEditRef.showModalEdit(params.rowData);
      this.checkInformation = params.rowData;
      console.log(this.checkInformation);
    },
    // 获取列表数据
    async tableForm() {
      const res = await applicationForm({
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization,
        offset: 0,
        limit: 25
      });
      console.log(res.result.data);
      if (res.result.data && res.result.data !== 'null') {
        this.tableData = res.result.data;
      }
    },
    // 分页
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.tableForm();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.tableForm();
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
.devices {
  /deep/.v-table-rightview {
    right: unset;
  }
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
</style>

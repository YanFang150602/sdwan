<template>
  <div class="devices">
    <!-- 搜索框 -->
    <!-- <a-row class="table-header" type="flex" justify="space-between" align="middle"> -->
    <!--搜索栏-->
    <!-- <a-col :style="{ width: 'calc(100%-475px)' }">
        <a-input
          class="search-bar"
          ref="searchInput"
          v-model="keyworks"
          placeholder="Search"
          @keyup.enter="search"
        >
          <a-icon slot="prefix" type="search"/>
          <a-icon @click="keyworks = ''" v-show="keyworks != ''" slot="suffix" type="close"/>
        </a-input>
    </a-col>-->
    <!--表格功能按钮-->
    <!-- <a-col>
        <a-row :style="{ width: '425px' }" type="flex" justify="end" align="middle">
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showModal" type="plus"/>
          </a-col>
          <a-col
            :style="{
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '20px'
            }"
          >
            <a-icon @click="showModalDelete" type="minus"/>
          </a-col>
          <a-col>
            <v-pagination size="small" :layout="['prev', 'jumper', 'next', 'sizer']"></v-pagination>
          </a-col>
        </a-row>
    </a-col>-->
    <!-- </a-row> -->
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
      :title-rows="titleRows"
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
    <URLCategoriesAdd ref="URLCategoriesAddRef"></URLCategoriesAdd>
    <!-- 查看弹框 -->
    <URLCategoriesEdit ref="URLCategoriesEditRef" :URLCategoriesEdit="this.cateCheck"></URLCategoriesEdit>
    <!-- 删除的弹框 -->
    <URLCategoriesDelete ref="URLCategoriesDeleteRef" :URLCategoriesDelete="this.dele"></URLCategoriesDelete>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { urlCategoriesForm } from 'apis/urlCategories';
import URLCategoriesAdd from './URLCategoriesAdd';
import URLCategoriesEdit from './URLCategoriesEdit';
import URLCategoriesDelete from './URLCategoriesDelete';
import Pagination from 'components/Pagination';

export default {
  name: 'QosProfiles',
  components: {
    URLCategoriesAdd,
    URLCategoriesEdit,
    URLCategoriesDelete,
    Pagination
  },
  data() {
    return {
      // 搜索框
      keyworks: '',
      totalCount: 0,
      pageSize: 20,
      pageIndex: 1,
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
          field: 'confidence',
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
          field: 'patternValue',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.urlPatterns !== null) {
              const res = rowData.urlPatterns.map(item => item.patternValue);
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'reputation',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.urlPatterns !== null) {
              const res = rowData.urlPatterns.map(item => item.reputation);
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'string',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.urlStrings !== null) {
              const res = rowData.urlStrings.map(item => item.stringValue);
              return `<span>${res}</span>`;
            }
          }
        },
        {
          field: 'reputationeeee',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            if (rowData.urlStrings !== null) {
              const res = rowData.urlStrings.map(item => item.reputation);
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
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['confidence'],
            title: 'Confidence',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['destination'],
            title: 'URL File',
            titleAlign: 'left',
            rowspan: 2
          },

          {
            fields: ['patternValue', 'reputation'],
            title: 'Source',
            titleAlign: 'center',
            colspan: 2
          },
          {
            fields: ['string', 'reputationeeee'],
            title: 'URL String',
            titleAlign: 'center',
            colspan: 2
          }
        ],
        [
          {
            fields: ['reputation'],
            title: 'Pattern',
            titleAlign: 'left'
          },
          {
            fields: ['patternValue'],
            title: 'Reputation',
            titleAlign: 'left'
          },
          {
            fields: ['string'],
            title: 'String',
            titleAlign: 'left'
          },
          {
            fields: ['reputationeeee'],
            title: 'Reputation',
            titleAlign: 'left'
          }
        ]
      ],
      // 删除的数据
      dele: {
        name: '',
        deviceName: '',
        orgName: ''
      },
      // 查看的数据
      cateCheck: []
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
      this.$refs.URLCategoriesAddRef.showModalAdd();
    },
    // 删除弹框
    groupDel() {
      this.$refs.URLCategoriesDeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.dele.deviceName = this.deviceName;
      this.dele.orgName = this.organization;
      this.dele.name = rowData.name;
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
    customCompFunc(params) {
      this.cateCheck = params.rowData;
      // console.log(params, 78766676768);
      this.$refs.URLCategoriesEditRef.showModalEdit();
      console.log(params.rowData, 1111111111222222222222222);
    },
    // 获取表格数据
    async tableForm(offset, limit) {
      const res = await urlCategoriesForm({
        objectName: this.deviceName,
        orgName: this.organization,
        objectType: this.objectType,
        offset: offset || 0,
        limit: limit || 25
      });
      console.log(res.result.data);
      this.tableData = res.result.data;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      if (this.keyworks.trim() === '') {
        this.tableForm();
      }
    },
    // 搜索框查询
    search(data) {
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.tableData = list;
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

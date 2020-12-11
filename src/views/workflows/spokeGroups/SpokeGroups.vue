<template>
  <div class="spokeGroups main-con">
    <!-- 搜索框 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showModal"
      @delete-item="groupDel"
      @search="search"
      @cancel-search="cancelSearch"
    />
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      :style="{ height: 'calc(100% - 15px)' }"
      is-horizontal-resize
      is-vertical-resize
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
    <div>
      <a-modal
        v-model="visible"
        title="Add Spoke Group"
        @ok="handleOk"
        width="1000px"
        :afterClose="close"
        :destroyOnClose="true"
      >
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk"
            >Save</a-button
          >
          <a-button key="back" type="danger" @click="handleCancel"
            >Cancel</a-button
          >
        </template>
        <SpokeAdd @add="add" ref="spokeAdd"></SpokeAdd>
      </a-modal>
    </div>

    <!-- 查看弹框 -->
    <div>
      <a-modal
        v-model="visibleExamine"
        title="Check Spoke Group"
        @ok="handleOkEdit"
        width="1000px"
        :destroyOnClose="true"
      >
        <SpokeCheck :formCheck="spokeCheck" @edit="edit"></SpokeCheck>
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOkEdit"
            >Save</a-button
          >
          <a-button key="back" type="danger" @click="handleCancelEdit"
            >Cancel</a-button
          >
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import SpokeAdd from './SpokeAdd';
import Pagination from 'components/Pagination';
import SpokeCheck from './SpokeCheck';
import {
  SPTableForm,
  SPDelete,
  spokeAdd,
  spokeCheck,
  spokeEdit
} from 'apis/spokeGroups';
import { mapState } from 'vuex';

export default {
  components: {
    SpokeAdd,
    SpokeCheck,
    Pagination
  },
  data() {
    return {
      list: [],
      delet: true,
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 查看弹框
      visibleExamine: false,
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
          width: 130,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'vTableName'
        },
        {
          field: 'org',
          title: 'Organization',
          width: 140,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'modifyDate',
          title: 'Routing Instance',
          width: 160,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'status',
          title: 'Status',
          width: 130,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'createDate',
          title: 'Create Date',
          width: 160,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'modifyDate',
          title: 'Last Modified Date',
          width: 160,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastUpdatedBy',
          title: 'Last Modified By',
          width: 140,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      // 删除数据
      dele: {
        ids: []
      },
      // 接收子组件的表单数据
      spokeAdd: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      },
      // spoke组查询的数据
      spokeCheck: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      },
      // 点击当行的内容
      spokeParams: {},
      formInline: {
        name: '',
        org: '',
        vrfs: [
          {
            name: '',
            groupType: '',
            hubs: [
              {
                name: '',
                priority: ''
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    // spoke组查询
    this.customCompFunc();
  },
  computed: {
    ...mapState(['spoke', 'organization'])
  },
  methods: {
    // 搜索框查询
    search(data) {
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.totalCount = list.length;
      this.tableData = list;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      this.pageIndex = 1;
      this.tableForm();
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
    },
    // 新增弹框
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      const res = await spokeAdd(this.spokeAdd);
      console.log(res);

      this.tableForm();
      this.$refs.spokeAdd.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.$message.success('创建轮询组成功!');
          // this.visible = false;
          // this.spokeAdd = {};
          if (res.message === 'Success') {
            this.$message.success('创建轮询组成功!');
            this.spokeAdd = {};
            this.visible = false;
            this.$refs.spokeAdd.showX();
            this.$refs.spokeAdd.$refs.ruleForm.resetFields();
          } else {
            this.$message.error(res.message);
            this.visible = true;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.spokeAdd.$refs.ruleForm.resetFields();
      this.visible = false;
      this.$refs.spokeAdd.showX();
    },
    // 查看编辑
    async handleOkEdit() {
      this.visibleExamine = false;
      const res = await spokeEdit(this.spokeParams.rowData.name, {
        ...this.spokeEdit
      });
      console.log(res);
      if (res.message === 'Success') {
        this.$message.success('编辑成功');
      } else {
        this.$message.error(res.message);
      }
    },
    handleCancelEdit() {
      this.visibleExamine = false;
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL1111111111111', selection);
      selection.forEach(item => {
        console.log(item.name);
        this.dele.ids.push(item.name);
      });
      const newArr = Array.from(new Set(this.dele.ids));
      this.dele.ids = newArr;
      console.log(this.dele);
    },

    selectChange(selection, rowData) {
      // console.log('select-change22222222222', selection, rowData);
      // selection.forEach(item => {
      //   console.log(item.name);
      //   this.dele.ids.push(item.name);
      // });
      // const newArr = Array.from(new Set(this.dele.ids));
      // this.dele.ids = newArr;
      // console.log(this.dele);
      // if (this.dele.ids.length <= 0) {
      //   this.delet = true;
      // } else {
      //   this.delet = false;
      // }

      const data = [];
      this.tableData.map(item => {
        item.name != rowData.name
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
      this.dele.ids.push(rowData.name);
    },

    selectGroupChange(selection) {
      console.log('select-group-change3333333333', selection);
      if (selection.length > 1) {
        selection.shift();
      }
    },
    async customCompFunc(params) {
      console.log(params);
      this.spokeParams = params;
      if (params.type === 'delete') {
        this.$delete(this.tableData, params.index);
      } else if (params.type === 'edit') {
        this.visibleExamine = true;
      }
      // spoke组查询
      const res = await spokeCheck(params.rowData.name);
      console.log(res.result);
      this.spokeCheck = res.result;
      console.log(this.spokeCheck);
    },
    // 表格获取数据
    async tableForm() {
      const offset = (this.pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      const orgname = this.organization;
      const res = await SPTableForm(orgname, offset, limit);
      this.tableData = res.result.data;
      this.totalCount = res.result.totalCount;
    },
    // 选取了组织
    queryDeviceGrops() {
      this.$store.dispatch('spoke', {
        orgname: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },

    // 表格数据删除
    async groupDel() {
      const res = await SPDelete(this.dele);
      console.log(res);
      if (res.message === 'Success') {
        this.$message.success('删除成功');
        this.dele.ids = [];
        this.tableForm();
      } else {
        this.$message.error(res.message);
      }
    },
    // 接收子组件的表单数据
    add(ad) {
      this.spokeAdd = { ...ad };
    },
    // 接收编辑子页面的数据
    edit(ed) {
      this.spokeEdit = { ...ed };
    },
    close() {
      this.spokeAdd = {};
      console.log(this.spokeAdd);
    }
  },
  watch: {
    organization: {
      handler: 'tableForm',
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.spokeGroups {
  padding: 5px 20px 30px 15px;
  .table-header {
    margin-bottom: 10px;
    height: 22px;
  }
  // 统一搜索框这行的样式统一，不需要以下样式
  // /deep/.search-bar {
  //   .ant-input {
  //     width: 400%;
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
}
//新增弹框
/deep/.ant-modal-content {
  height: 100%;
  .ant-modal-header {
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 10px;
    height: 100%;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}
/deep/.ant-modal-title {
  font-size: 12px;
  margin-left: -12px;
}
// 模态框标题
/deep/.ant-modal-title {
  font-size: 12px;
}
// 模态框右上角x
/deep/.ant-modal-close-x {
  line-height: 40px;
  width: 40px;
}
// 两个按钮
/deep/.ant-btn-primary {
  width: 56px;
  height: 30px;
  background: #a7d054;
  border-color: unset;
}
/deep/.ant-btn-danger {
  width: 67px;
  height: 30px;
  background-color: #3f4a5b;
  border-color: unset;
}

// 查看弹框
/deep/.ant-modal-content {
  height: 100%;
}
</style>

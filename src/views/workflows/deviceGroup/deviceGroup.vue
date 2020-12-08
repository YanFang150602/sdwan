<template>
  <div class="deviceGroups">
    <!-- 搜索框 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showAddDeviceGroupModal"
      @delete-item="showDelDeviceGroupModal"
      @search="search"
      @cancelSearch="cancelSearch"
    />
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="deviceGroupResult.deviceGroups"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      :height="500"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customDGTableFunc"
    ></v-table>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="visibleDelete"
        title="Confirm Decommission"
        @ok="handleOkDelete"
        width="430px"
        :maskClosable="false"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOkDelete"
            >OK</a-button
          >
          <a-button key="back" @click="handleCancelDelete">Cancel</a-button>
        </template>
        <span style="color:#fff;margin:12px 0;"
          >Are you sure you want to delete the selected record(s)?</span
        >
      </a-modal>
      <a-modal
        v-model="deviceGroupVisiVble"
        :title="title"
        on-ok="handleOK"
        width="940px"
        :destroyOnClose="true"
        :maskClosable="false"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOK"
            >OK</a-button
          >
          <a-button key="back" @click="handleCancel">Cancel</a-button>
        </template>
        <DeviceGroup
          ref="deviceGropRef"
          :groupName="groupName"
          @createGroup="createOrEditGroup"
        ></DeviceGroup>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import {
  DeviceGroupAdd,
  DeviceGroupEdit,
  DeviceGroupDelete
} from 'apis/workFlows';
import Pagination from 'components/Pagination';
import DeviceGroup from 'views/workflows/devices/DeviceGroup';
import { mapState } from 'vuex';
export default {
  name: 'deviceGroup',
  components: {
    DeviceGroup,
    Pagination
  },
  data() {
    return {
      keyworks: '',
      columns: [
        {
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          field: 'custom',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 253,
          columnAlign: 'left',
          isResize: true,
          componentName: 'devicegroups-opration'
        },
        {
          field: 'organization',
          title: 'Organization',
          width: 253,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'poststagingTemplate',
          title: 'Post Staging Template',
          width: 253,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'inventoryName',
          title: 'Inventory Name',
          width: 253,
          columnAlign: 'left',
          isResize: true
        }
      ],
      loading: false,
      deviceGroupVisiVble: false,
      visibleDelete: false,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      title: '',
      groupName: '',
      delDeviceGroups: {
        ids: []
      }
    };
  },
  computed: {
    ...mapState({
      deviceGroupResult: 'deviceGroupResult',
      organization: 'organization'
    })
  },
  created() {
    this.$store.dispatch('getNameList');
    this.queryDeviceGrops();
  },
  methods: {
    // 搜索框查询
    search(data) {
      // 转换全小写,实现模糊匹配
      console.log(11);
      const keyword = data.trim().toLowerCase();
      console.log(this.deviceGroupResult.deviceGroups);
      const list = this.deviceGroupResult.deviceGroups.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.deviceGroupResult.deviceGroups = list;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      if (this.keyworks.trim() === '') {
        this.queryDeviceGrops();
      }
    },
    queryDeviceGrops() {
      this.$store.dispatch('DeviceGroups', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.$store.dispatch('DeviceGroups', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.$store.dispatch('DeviceGroups', {
        organization: this.organization,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
    },
    showAddDeviceGroupModal() {
      this.deviceGroupVisiVble = true;
      this.title = 'Add Device Group';
      this.groupName = '';
      if (this.$refs.deviceGropRef) {
        this.$refs.deviceGropRef.gn = '';
        this.$refs.deviceGropRef.deviceGroup.name = '';
        this.$refs.deviceGropRef.deviceGroup.description = '';
        this.$refs.deviceGropRef.deviceGroup.poststagingTemplate = '';
        this.$refs.deviceGropRef.deviceGroup.caNotification = false;
        this.$refs.deviceGropRef.deviceGroup.organization = '';
        this.$refs.deviceGropRef.deviceGroup.templateAssociation = [{}];
        this.$refs.deviceGropRef.dTitle = 'Devices(0)';
        this.$refs.deviceGropRef.pTitle =
          'Post Staging Template Association(0)';
      }
    },
    showDelDeviceGroupModal() {
      this.visibleDelete = true;
    },
    // 表格方法
    selectALL(selection) {
      this.delDeviceGroups = {
        ids: []
      };
      for (let row of selection) {
        this.delDeviceGroups.ids.push(row.name);
      }
      console.log(this.delDeviceGroups);
    },
    selectChange(selection) {
      this.delDeviceGroups = {
        ids: []
      };
      for (let row of selection) {
        this.delDeviceGroups.ids.push(row.name);
      }
      console.log(this.delDeviceGroups);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async handleOkDelete() {
      const res = await DeviceGroupDelete(this.delDeviceGroups);
      if (res.message == 'Success') {
        this.$message.success('Delete the selected record(s) successfully.');
        this.visibleDelete = false;
        this.queryDeviceGrops();
      } else {
        this.$message.error(res.message);
      }
    },
    handleCancelDelete() {
      this.visibleDelete = false;
    },
    customDGTableFunc(params) {
      if (params.type == 'edit') {
        this.title = 'Edit Device Group';
        this.deviceGroupVisiVble = true;
        this.groupName = params.rowData.name;
        if (this.$refs.deviceGropRef) {
          this.$refs.deviceGropRef.gn = this.groupName;
        }
        console.log('customDGTableFunc', this.$refs.deviceGropRef);
      }
    },
    async handleOK() {
      let isOK = this.satisfyDeviceGroupValidation();

      if (isOK) {
        if (this.groupName) {
          const res = await DeviceGroupEdit(this.deviceGroup);
          if (res.message == 'Success') {
            this.deviceGroupVisiVble = false;
            this.$message.success('Edit device group successfully.');
          } else {
            this.$message.error(res.message);
          }
        } else {
          const res = await DeviceGroupAdd(this.deviceGroup);
          if (res.message == 'Success') {
            this.deviceGroupVisiVble = false;
            this.$message.success('Create device group successfully.');
            this.queryDeviceGrops();
          } else {
            this.$message.error(res.message);
          }
        }
      }
    },
    handleCancel() {
      this.deviceGroupVisiVble = false;
      this.$refs.deviceGropRef.operType = '';
    },
    createOrEditGroup(deviceGroup) {
      this.deviceGroup = deviceGroup;
    },
    satisfyDeviceGroupValidation() {
      let isOK = true;
      this.$refs.deviceGropRef.$refs.ruleForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
        return true;
      });
      return isOK;
    }
  }
};
// 自定义列组件
Vue.component('devicegroups-opration', {
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
.deviceGroups {
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

// label样式
/deep/.ant-modal-title {
  font-size: 12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}
// -----------------------
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
/deep/ .ant-select-selection--single {
  height: 20px;
}
/deep/.ant-select-selection__rendered {
  line-height: 17px;
}
/deep/.ant-form-item label {
  color: #fff;
}
</style>

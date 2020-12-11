<template>
  <div class="schedules main-con">
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showAddWinModal"
      @delete-item="showDelWinModal"
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
      :table-data="tableDataList"
      :select-all="selectALL"
      :select-change="selectChange"
      :select-group-change="selectGroupChange"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="customTableFunc"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="delWinVisible"
        title="Confirm Decommission"
        @ok="delOK"
        width="430px"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="delLoading"
            @click="delOK"
            >OK</a-button
          >
          <a-button key="back" @click="delCancel">Cancel</a-button>
        </template>
        <span style="color:#fff;margin:12px 0;"
          >Are you sure you want to delete the selected record(s)?</span
        >
      </a-modal>
      <a-modal
        v-drag
        v-model="addOrEditWinVisible"
        :title="title"
        :destroyOnClose="true"
        width="940px"
      >
        <ScheduleAddOrEdit
          ref="scheduleAddOrEditRef"
          :schedule="curEditSchedule"
          @passChildContent="passChildContent"
        ></ScheduleAddOrEdit>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="addOrEditLoading"
            @click="addOrEditOK"
            >OK</a-button
          >
          <a-button key="back" @click="addOrEditCancel">Cancel</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import ScheduleAddOrEdit from './ScheduleAddOrEdit';
import Pagination from 'components/Pagination';
import {
  ScheduleQuery,
  ScheduleAdd,
  ScheduleModify,
  ScheduleDelete
} from 'apis/Configuration';
export default {
  name: 'Schedule',
  components: {
    ScheduleAddOrEdit,
    Pagination
  },
  directives: {
    // 拖拽自定义指令
    drag(el) {
      console.log('移动', el);
      // 将ant-modal的position改为静态，使拖拽框按照电脑屏幕定位
      // el.children[1].children[0].style.position = 'static';
      // 获取到ant-modal-content元素
      let targetEl = '';
      if (el.children[1].children) {
        localStorage.setItem('dragDom', el.children[1].children[0].children[1]);
        targetEl = el.children[1].children[0].children[1];
      } else {
        targetEl = localStorage.getItem('dragDom');
      }
      // let targetEl = el.children[1].children[0].children[1];
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
  },
  data() {
    return {
      keywords: '',
      columns: [
        {
          field: 'custom',
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 146,
          columnAlign: 'left',
          isResize: true,
          componentName: 'schedule-opration'
        },
        {
          field: 'description',
          title: 'Description',
          width: 246,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'tags',
          title: 'Tag',
          width: 246,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            const res = rowData.tags.join(',');
            return `<span>${res}</span>`;
          }
        },
        {
          field: 'recurring',
          title: 'Recurrence',
          width: 246,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            const res = rowData.recurring
              .map(item => item.recurrence)
              .join(',');
            return `<span>${res}</span>`;
          }
        },
        {
          field: 'time',
          title: 'Time',
          width: 246,
          columnAlign: 'left',
          isResize: true,
          formatter: rowData => {
            const res = rowData.recurring.map(item => item.time).join(',');
            return `<span>${res}</span>`;
          }
        }
      ],
      tableDataList: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 20,
      delWinVisible: false,
      delLoading: false,
      addOrEditWinVisible: false,
      addOrEditLoading: false,
      curEditSchedule: {},
      curAddSchedule: {},
      title: ''
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  created() {
    this.querySchedules();
  },

  methods: {
    // 表格操作Table start
    search() {
      this.querySchedules();
    },
    customTableFunc(params) {
      this.operType = 'edit';
      this.curEditSchedule = params.rowData;
      this.curEditSchedule.tempDisabled = true;
      this.title = 'Edit Schedule';
      this.addOrEditWinVisible = true;
    },
    cancelSearch() {},
    selectALL(selection) {
      console.log(selection);
      // this.delScheduleList = {
      //   data: []
      // };
      // for (let row of selection) {
      //   this.delScheduleList.data.push(row.name);
      // }
    },
    selectChange(selection, rowData) {
      this.delScheduleList = {
        data: ''
      };
      console.log(rowData.name);
      this.delScheduleList.data = rowData.name;
      // for (let row of selection) {
      //   this.delScheduleList.data.push(row.name);
      // }
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async querySchedules() {
      const res = await ScheduleQuery({
        orgName: this.organization,
        deviceName: this.deviceName,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });

      if (res.message === 'Success') {
        // this.tableDataList = res.result.data ? res.result.data : null;
        this.tableDataList = res.result.data;

        this.totalCount = res.totalCount;
        console.log(this.tableDataList);
        // this.tableDataList.forEach(item => {
        //   console.log(item.tags);
        //   if (item.tags == []) {
        //     for (const i = 0; i++; i <= this.tableDataList.length) {
        //       this.tableDataList[i].tags = '';
        //     }
        //   }
        // });
      } else {
        this.tableDataList = [{}];
        this.totalCount = 0;
      }
    },
    // 表格操作Table end
    // 分页操作Page start
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.querySchedules();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.querySchedules();
    },
    // 分页操作Page end
    // Schedule Add start
    showAddWinModal() {
      this.operType = 'add';
      this.curEditSchedule = {};
      this.title = 'Add Schedule';
      this.addOrEditWinVisible = true;
    },
    async addOrEditOK() {
      let isOK = this.satisfyValidation();
      if (isOK) {
        this.addOrEditLoading = true;
        let params = {
          orgName: this.organization,
          deviceName: this.deviceName
        };
        let res = {};

        for (let key in this.curAddSchedule) {
          if (key.indexOf('temp') == 0) {
            delete this.curAddSchedule[key];
          }
        }
        if (this.curAddSchedule.description === '') {
          this.curAddSchedule.description = null;
        }
        params.data = this.curAddSchedule;
        if (this.operType === 'add') {
          res = await ScheduleAdd(params);
          if (res.message === 'success') {
            this.addOrEditWinVisible = false;
            this.$message('创建成功');
          }
        } else {
          res = await ScheduleModify(params);
        }
        this.addOrEditLoading = false;
        if (res.message === 'Success') {
          this.addOrEditWinVisible = false;
          this.querySchedules();
          this.$message.success('编辑成功');
        } else {
          this.$message.error(res.message);
        }
      }
    },
    addOrEditCancel() {
      this.addOrEditWinVisible = false;
    },
    passChildContent(schedule) {
      this.curAddSchedule = schedule;
    },
    satisfyValidation() {
      let isOK = true;
      this.$refs.scheduleAddOrEditRef.$refs.scheduleForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      return isOK;
    },
    // Schedule Add end
    // Schedule Delete start
    showDelWinModal() {
      this.delWinVisible = true;
    },
    async delOK() {
      // coding
      const res = await ScheduleDelete({
        orgName: this.organization,
        deviceName: this.deviceName,
        data: this.delScheduleList.data
      });
      if (res.message === 'success') {
        this.showDelWinModal = false;
        this.pageIndex = 1;
        this.querySchedules();
      } else {
        this.$message.error(res.message);
      }
    },
    delCancel() {
      this.delWinVisible = false;
    }
    // Schedule Delete end
  }
};
Vue.component('schedule-opration', {
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
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-item-label > label::after {
  display: none;
}
.schedules {
  height: 100%;
  overflow: hidden;
  min-height: 503px;
  .list-action {
    line-height: 18px;
    color: #0f2c3e;
    font-size: 12px;
    margin-bottom: 10px;
    .table-header {
      margin-bottom: 10px;
      height: 22px;
    }
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
/deep/.ant-modal-title {
  font-size: 12px;
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

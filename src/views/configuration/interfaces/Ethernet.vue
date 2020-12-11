<template>
  <div class="spokeGroups main-con">
    <!-- 搜索框 -->
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
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="ethernetColumns"
      :table-data="tableData"
      :select-change="delItem"
      style="width: 100%"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 修改 -->
    <a-modal
      v-drag
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk"
      :width="550"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      :confirm-loading="Loading"
      okText="Ok"
      :afterClose="cleanData"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :layout="form.layout"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        @validate="validate"
      >
        <a-form-model-item ref="name" label="Interfaces">
          <a-input
            size="small"
            style="width: 50px; color: #0f2c3e"
            :disabled="nameDisabled"
            v-model="form.interfacesOne"
          />
          <span style="color: #fff;margin:0px 5px">-</span>
          <a-input
            size="small"
            style="width: 50px; color: #0f2c3e"
            :disabled="nameDisabled"
            v-model="form.slot"
          />
          <span style="color: #fff;margin:0px 5px">/</span>
          <a-input
            size="small"
            style="width: 50px; color: #0f2c3e"
            :disabled="nameDisabled"
            v-model="form.port"
          />
        </a-form-model-item>
        <div style="color: #fff">Bandwidth</div>
        <div class="Bandwidth">
          <a-form-model-item prop="uplink" label="Uplink (Kbps)">
            <a-input
              style="width: 150px"
              size="small"
              @mouseenter="enter('uplink')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="form.uplink"
              type="text"
            />
          </a-form-model-item>
          <a-form-model-item prop="downlink" label="Downlink (Kbps)">
            <a-input
              style="width: 150px"
              size="small"
              @mouseenter="enter('downlink')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="form.downlink"
              type="text"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
      <!-- <div style="color: #fff">Bandwidth</div>
      <div class="Bandwidth">
        <div style="float: left">
          <div>Uplink (Kbps)</div>
          <a-input
          style="width:150px;"
          size="small"
          v-model="form.uplink"
          type="text" />
        </div>
        <div style="float: left; marginLeft: 8px">
          <div>Downlink (Kbps)</div>
          <a-input
          style="width:150px;"
          size="small"
          v-model="form.downlink"
          type="text" />
        </div>
      </div>-->
    </a-modal>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </div>
</template>

<script>
import Pagination from 'components/Pagination';
import { ethernetList, ethernetData, changeEthernet } from 'apis/interfaces';
import { mapState } from 'vuex';
import common from '@/mixins/common';
import { ethernetColumns } from './table';

export default {
  components: {
    Pagination
  },
  mixins: [common],
  data() {
    return {
      totalCount: 0,
      pageSize: 20,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      tableData: [],
      seleteName: '', // 选中的名字
      ethernetColumns,
      visible: false,
      Loading: false,
      modalTitle: '',
      nameDisabled: true,
      form: {
        interfacesOne: 'vni',
        name: '',
        slot: '',
        port: '',
        layout: 'vertical',
        downlink: '',
        uplink: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        uplink: [
          {
            pattern: '^([1-9]\\d{0,6}|10000000)$',
            message: 'Value must be between 1 and 10000000',
            trigger: 'blur'
          }
        ],
        downlink: [
          {
            pattern: '^([1-9]\\d{0,6}|10000000)$',
            message: 'Value must be between 1 and 10000000',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(['deviceName'])
  },
  created() {
    console.log(123);
    this.getList();
  },
  methods: {
    // 查询列表
    async getList() {
      const offset = 0;
      const limit = 20;
      console.log(this.deviceName);
      const res = await ethernetList(this.deviceName, offset, limit);
      console.log(res);
      if (res.message === 'Success') {
        this.tableData = res.result.data;
        this.totalCount = res.result.totalCount;
      } else {
        this.$message.error(res.message);
      }
    },
    // 分页
    pageChange(pageIndex) {
      console.log('分页');
      const offset = (pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      this.pageIndex = pageIndex;
      console.log(this.deviceName);
      ethernetList(this.deviceName, offset, limit).then(res => {
        console.log(res);
        if (res.message === 'Success') {
          this.tableData = res.result.data;
          this.totalCount = res.result.totalCount;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    pageSizeChange(pageSize) {
      console.log('分页');
      this.pageIndex = 1;
      const offset = (this.pageIndex - 1) * pageSize;
      const limit = pageSize;
      this.pageSize = pageSize;
      ethernetList(this.deviceName, offset, limit).then(res => {
        console.log(res);
        if (res.message === 'Success') {
          this.tableData = res.result.data;
          this.totalCount = res.result.totalCount;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 新增弹框
    showModal() {
      console.log('新增');
    },
    // 删除弹框
    groupDel() {
      console.log('删除');
    },
    // 搜索
    search(data) {
      console.log('搜素');
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.tableData = list;
    },
    cancelSearch() {
      this.getList();
    },
    // 获取删除表单的name
    delItem(selection, rowData) {
      console.log(selection, rowData);
      console.log(rowData.name);
      this.seleteName = rowData.name;
      // 添加单选
      const data = [];
      this.tableData.map(item => {
        item.name != rowData.name
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
    },
    // 点击表格第一条数据弹出修改模态框
    async modifyItem({ rowData }) {
      console.log(rowData);
      this.modalTitle = 'Edit Ethernet Interfaces' + '-' + rowData.name;
      const res = await ethernetData(this.deviceName, rowData.name);
      console.log(res);
      if (res.message === 'Success') {
        this.form.slot = res.result.slot;
        this.form.port = res.result.port;
        if (res.result.downlink) {
          this.form.downlink = res.result.downlink.toString();
        }
        if (res.result.uplink) {
          this.form.uplink = res.result.uplink.toString();
        }
        this.form.name = res.result.name;
      } else {
        this.$message.error(res.message);
      }
      console.log(this.form);
      this.visible = true;
    },
    // 修改确认
    async handleOk({ rowData }) {
      console.log(rowData);
      this.Loading = true;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const list = {
            name: this.form.name,
            downlink: this.form.downlink,
            uplink: this.form.uplink
          };
          const res = await changeEthernet(this.deviceName, list);
          console.log(res);
          this.Loading = false;
          if (res.message === 'Success') {
            this.$message.success('修改成功');
            this.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    //关闭修改
    cleanData() {
      this.Loading = false;
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
.Bandwidth {
  display: flex;
  justify-content: flex-start;
  div {
    color: #fff;
    font-size: 12px;
  }
}
/deep/.ant-form-explain {
  display: none !important;
}
</style>

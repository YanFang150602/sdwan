<template>
  <div class="spokeGroups">
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
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="serviceColumns"
      :table-data="tableData"
      :select-change="delItem"
      style="width: 100%"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 新增 -->
    <ServiceAdd ref="ServiceAddRef"></ServiceAdd>
    <!-- 修改 -->
    <ServiceEdit ref="ServiceEditRef" :editData="cateCheck"></ServiceEdit>
    <!-- 删除 -->
    <ServiceDel ref="ServiceDeleteRef" :DeleName="idDele"></ServiceDel>
    <!-- 表单验证悬浮提示框 -->
  </div>
</template>

<script>
import Pagination from 'components/Pagination';
import ServiceAdd from './ServiceAdd';
import ServiceEdit from './ServiceEdit';
import ServiceDel from './ServiceDel';
import { ServiceList } from 'apis/service';
import { mapState } from 'vuex';
import common from '@/mixins/common';
import { serviceColumns } from './table';

export default {
  components: {
    Pagination,
    ServiceAdd,
    ServiceEdit,
    ServiceDel
  },
  mixins: [common],
  data() {
    return {
      totalCount: 0,
      pageSize: 20,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      tableData: [],
      idDele: '', // 选中的名字
      serviceColumns,
      visible: false,
      Loading: false,
      cateCheck: {}, // 修改的数据
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
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  created() {
    console.log(123);
    this.getList();
  },
  methods: {
    // 查询列表
    async getList(offset, limit) {
      console.log(this.deviceName);
      const res = await ServiceList({
        offset: offset || 0,
        limit: limit || 20,
        objectType: this.objectType,
        objectName: this.deviceName,
        orgName: this.organization
      });
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
      this.getList(offset, limit);
    },
    pageSizeChange(pageSize) {
      console.log('分页');
      this.pageIndex = 1;
      const offset = (this.pageIndex - 1) * pageSize;
      const limit = pageSize;
      this.pageSize = pageSize;
      this.getList(offset, limit);
    },
    // 新增弹框
    showModal() {
      console.log('新增');
      this.$refs.ServiceAddRef.showModalAdd();
    },
    // 删除弹框
    async groupDel() {
      console.log(this.idDele, '删除');
      if (this.idDele) {
        this.$refs.ServiceDeleteRef.showModalDelete();
      }
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
      this.idDele = rowData.name;
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
      this.cateCheck = rowData;
      this.$refs.ServiceEditRef.showModalAdd();
    },
    // 修改确认
    async handleOk({ rowData }) {
      console.log(rowData);
      this.Loading = true;
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // const list = {
          //   name: this.form.name,
          //   downlink: this.form.downlink,
          //   uplink: this.form.uplink
          // };
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

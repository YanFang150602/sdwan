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
      @cancelSearch="cancelSearch"
    />
    <!-- 列表 -->
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="pseudoColumns"
      :table-data="tableData"
      :select-change="delItem"
      style="width:100%;"
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
      okText="Ok"
      :confirm-loading="Loading"
      :afterClose="cleanData"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :layout="layout"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        @validate="validate"
      >
        <div>
          <a-form-model-item
            prop="slot"
            class="mandatory"
            ref="slot"
            label="Name"
          >
            <a-input
              size="small"
              style="width:50px; color: #0f2c3e"
              :disabled="nameDisabled"
              defaultValue="ptvi"
            />
            <span style="color: #fff;margin:0px 5px;">-</span>
            <a-input
              size="small"
              style="width:90px; color: #0f2c3e"
              @blur="
                () => {
                  $refs.slot.onFieldBlur();
                }
              "
              @change="
                () => {
                  $refs.slot.onFieldChange();
                }
              "
              @mouseenter="enter('slot')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="form.slot"
              :disabled="otherDisbaled"
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item
            prop="remoteAddress"
            class="mandatory"
            label="Remote IP Address"
          >
            <a-input
              size="small"
              style="width:150px; color: #0f2c3e"
              @mouseenter="enter('remoteAddress')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="form.remoteAddress"
              :disabled="otherDisbaled"
            />
          </a-form-model-item>
          <div class="right">
            <a-form-model-item
              ref="name"
              prop="parentInterface"
              class="mandatory"
              label="Parent Interface"
            >
              <a-select v-model="form.parentInterface">
                <a-select-option
                  v-for="(item, index) in parentInterfaceOption"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-checkbox
              style="color: #fff; marginTop: 12px"
              v-model="form.enable"
              >Enable</a-checkbox
            >
          </div>
        </div>
      </a-form-model>
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
import {
  pseudoList,
  getPtviParent,
  PseudoData,
  changePseudo,
  addPseudo,
  deletePseudo
} from 'apis/interfaces';
import { mapState } from 'vuex';
import common from '@/mixins/common';
import { pseudoColumns } from './table';

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
      seleteName: '', // 选择中的名字
      pseudoColumns,
      visible: false,
      Loading: false,
      changeFlag: false,
      addVisible: false,
      modalTitle: '',
      layout: 'vertical',
      nameDisabled: false,
      otherDisbaled: false,
      parentInterfaceOption: [],
      form: {
        name: '',
        slot: '',
        remoteAddress: '',
        parentInterface: [],
        enable: false
      },
      rules: {
        slot: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          },
          {
            pattern: '^([1-9]\\d{0,6}|10000000)$',
            message: 'Value must be between 1 and 10000000',
            trigger: 'blur'
          }
        ],
        remoteAddress: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          },
          {
            pattern:
              '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4}){1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$',
            message: 'Invalid Ipv4 Or Ipv6 address',
            trigger: 'blur'
          }
        ],
        parentInterface: [
          {
            required: true,
            message: 'Field required',
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
  },
  methods: {
    // 查询列表
    async getList() {
      const offset = 0;
      const limit = 20;
      console.log(this.deviceName);
      const res = await pseudoList(this.deviceName, offset, limit);
      console.log(res);
      if (res.message === 'Success') {
        this.tableData = res.result.data;
        this.totalCount = res.result.totalCount;
      } else {
        this.$message.error(res.message);
      }
      // 查询选择器数据
      const list = await getPtviParent(this.deviceName);
      console.log(res);
      if (list.message === 'Success') {
        console.log(list);
        this.parentInterfaceOption = list.result;
      } else {
        this.$message.error(res.message);
      }
    },
    // 分页
    async pageChange(pageIndex) {
      console.log('分页');
      const offset = (pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      this.pageIndex = pageIndex;
      const res = await pseudoList(this.deviceName, offset, limit);
      console.log(res);
      if (res.message === 'Success') {
        this.tableData = res.result.data;
        this.totalCount = res.result.totalCount;
      } else {
        this.$message.error(res.message);
      }
    },
    async pageSizeChange(pageSize) {
      console.log('分页');
      this.pageIndex = 1;
      const offset = (this.pageIndex - 1) * pageSize;
      const limit = pageSize;
      this.pageSize = pageSize;
      const res = await pseudoList(this.deviceName, offset, limit);
      console.log(res);
      if (res.message === 'Success') {
        this.tableData = res.result.data;
        this.totalCount = res.result.totalCount;
      } else {
        this.$message.error(res.message);
      }
    },
    // 新增弹框
    showModal() {
      console.log('新增');
      this.modalTitle = 'Add Psrudo Interface';
      this.visible = true;
      this.nameDisabled = true;
      this.otherDisbaled = false;
    },
    // 删除弹框
    async groupDel() {
      console.log(this.seleteName, '删除');
      if (this.seleteName) {
        const res = await deletePseudo(this.deviceName, {
          name: this.seleteName
        });
        console.log(res);
        if (res.message === 'Success') {
          this.$message.success('删除成功');
          this.getList();
          console.log('1233');
        } else {
          this.$message.error(res.message);
        }
      } else {
        this.$message.warning('至少选择一条数据');
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
      this.modalTitle = 'Edit Pseudo Tunnel' + '-' + rowData.name;
      const res = await PseudoData(this.deviceName, rowData.name);
      console.log(res);
      if (res.message === 'Success') {
        this.form = res.result;
        this.form.slot = res.result.name.split('ptvi')[1];
        this.changeFlag = true;
        this.visible = true;
      } else {
        this.$message.error(res.message);
      }
      console.log(this.form);
      this.nameDisabled = true;
      this.otherDisbaled = true;
    },
    // 修改和新增确认
    async handleOk() {
      this.form.name = 'ptvi' + this.form.slot;
      console.log(this.form, '开始');
      console.log(this.form);
      this.Loading = true;
      if (this.changeFlag) {
        // 修改
        this.$refs.ruleForm.validate(async valid => {
          if (valid) {
            const res = await changePseudo(this.deviceName, this.form);
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
      } else {
        // 新增
        this.$refs.ruleForm.validate(async valid => {
          if (valid) {
            const res = await addPseudo(this.deviceName, this.form);
            if (res.message === 'Success') {
              this.$message.success('新增成功');
              this.getList();
              this.visible = false;
            } else {
              this.$message.error(res.message);
            }
          }
        });
      }
      console.log(this.form, '结束');
    },
    //关闭修改
    cleanData() {
      this.form = {};
      this.form.parentInterface = [];
      this.Loading = false;
      this.$refs.ruleForm.resetFields();
      this.changeFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.right {
  width: 270px;
  position: absolute;
  top: 46px;
  left: 292px;
}
/deep/.ant-form-explain {
  display: none !important;
}

/deep/.mandatory.ant-form-item {
  .ant-form-item-label {
    label {
      &::after {
        color: #ee6978 !important;
        display: block !important;
      }
    }
  }
}
</style>

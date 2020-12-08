<template>
  <div class="main-con">
    <!-- 头部信息 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="createItem"
      @delete-item="deleteItem"
      @search="search"
    />
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-change="delItem"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-drag
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk"
      :width="300"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
      :maskClosable="false"
    >
      <!-- 添加修改表单 -->
      <a-form-model
        :model="formParam"
        ref="form"
        :rules="rules"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
      >
        <!-- Name -->
        <a-col>
          <a-form-model-item class="mandatory" label="Name" prop="name">
            <a-input
              :disabled="modalType === 'edt'"
              @mouseenter="enter('name')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="formParam.name"
            />
          </a-form-model-item>
        </a-col>
        <!-- Description -->
        <a-col>
          <a-form-model-item label="Description">
            <a-input v-model="formParam.description" size="small" />
          </a-form-model-item>
        </a-col>
        <!-- Zone Protection Profile -->
        <a-col>
          <a-form-model-item label="Zone Protection Profile">
            <a-select v-model="formParam.zoneProtectionProfile">
              <a-select-option value="">--Select--</a-select-option>
              <a-select-option
                v-for="(item, index) in zoneProtectProfilesData"
                :key="index"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-form-model>
      <template slot="footer">
        <a-button type="primary" key="Ok" @click="handleOk" :loading="loading"
          >Ok</a-button
        >
        <a-button key="Cancel" @click="visible = false">Cancel</a-button>
      </template>
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
import { mapState } from 'vuex';
import { columns } from './table';
import { name } from '@/validate/common';
import common from '@/mixins/common';
import { removeNull } from '@/utils/assits';

import Pagination from 'components/Pagination';

import {
  zoneTemLists,
  zoneTemCreate,
  zoneTemSearch,
  zoneTemModify,
  zoneTemDelete,
  zonePPName
} from 'apis/zoneQos';

export default {
  mixins: [common],
  data() {
    return {
      columns, // 表格据模型
      // 列表查询参数
      admodleShow: 0, //addModle显示隐藏
      // addModle 标题
      interfaceTit: 'Interfaces',
      routingTit: 'Routing Instances',
      networkTit: 'Networks',
      organTit: 'Organizations',

      // zoneProtectProfile列表数据
      zoneProtectProfilesData: [],

      // 新建更新数据模型
      formParam: {
        description: '',
        name: '',
        objectName: '',
        objectType: 'template',
        orgName: '',
        zoneProtectionProfile: ''
      },
      // 列表数据模板
      listParam: {
        objectName: '',
        orgName: '',
        offset: 0,
        limit: 20,
        objectType: 'template'
      },
      //查询数据模型
      searchParam: {
        objectType: 'template',
        objectName: '',
        orgName: '',
        name: ''
      },
      //删除数据模型
      delParam: {
        objectType: 'template',
        objectName: '',
        orgName: '',
        name: ''
      },
      // 表单校验规则
      rules: {
        name: [{ validator: name }]
      }
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  created() {
    //获取zone列表
    this.lists();
  },
  methods: {
    // 获取Zone Protection Profile 列表
    async zoneProtectionList() {
      const { result } = await zonePPName({
        objectType: 'template',
        objectName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.zoneProtectProfilesData = result;
    },

    // 获取zone列表
    async lists() {
      this.listParam = {
        objectName: this.deviceName,
        orgName: this.organization,
        offset: this.offset,
        objectType: 'template',
        limit: this.pageSize
      };
      const { result } = await zoneTemLists(this.listParam);
      this.totalCount = result.totalCount;
      this.tableData = result.data;
    },

    //新建zone
    async createItem() {
      this.modalTitle = 'Add Zone';
      this.modalType = 'add';
      this.zoneProtectionList();
      this.visible = true;
    },

    //编辑zone
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Zone';
      this.modalType = 'edt';
      this.searchParam = {
        objectName: this.deviceName,
        orgName: this.organization,
        name: rowData.name,
        objectType: 'template'
      };
      this.zoneProtectionList();
      const { result } = await zoneTemSearch(this.searchParam);
      this.formParam = Object.assign(this.formParam, removeNull(result));
      this.visible = true;
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
      this.delParam.name = rowData.name;
    },
    // 删除选中zone
    async deleteItem() {
      this.delParam.objectName = this.deviceName;
      this.delParam.orgName = this.organization;
      const res = await zoneTemDelete(this.delParam);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('zone删除成功！');
      this.lists();
    },

    //表单提交
    async handleOk() {
      this.formParam.objectName = this.deviceName;
      this.formParam.orgName = this.organization;
      // 新建zone数据
      if (this.modalType === 'add') {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true;
            const addRes = await zoneTemCreate(this.formParam);
            this.loading = false;
            if (addRes.status !== '0000')
              return this.$message.error(addRes.message);
            this.$message.success('zone创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      // 修改zone数据
      if (this.modalType === 'edt') {
        this.$refs.form.validateField(['name'], async () => {
          if (!this.message.name) {
            this.loading = true;
            const edtRes = await zoneTemModify(this.formParam);
            this.loading = false;
            if (edtRes.status !== '0000')
              return this.$message.error(edtRes.message);
            this.$message.success('zone更新成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
    },
    // 关闭弹窗清楚表单 验证信息
    cleanData() {
      this.$refs.form.clearValidate();
      this.formParam = {
        description: '',
        name: '',
        objectName: '',
        objectType: 'template',
        orgName: '',
        zoneProtectionProfile: ''
      };
      this.message = {};
      this.loading = false;
    }
  },
  components: {
    Pagination
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
/deep/.v-table-title-class tr td:nth-of-type(1) .table-title {
  display: none;
}
</style>

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
      :width="645"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
    >
      <!-- 添加修改表单 -->
      <a-form-model
        :model="formParam.data"
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
              v-model="formParam.data.name"
              size="small"
            />
          </a-form-model-item>
        </a-col>
        <!-- Description -->
        <a-col>
          <a-form-model-item label="Description">
            <a-input v-model="formParam.data.description" size="small" />
          </a-form-model-item>
        </a-col>
        <!-- Tags -->
        <a-col>
          <a-form-model-item label="Tags">
            <TagInput @addtag="addtag" :tags="formParam.data.tags" />
          </a-form-model-item>
        </a-col>
        <a-row type="flex" justify="space-between" align="top">
          <!-- Zone Protection Profile -->
          <a-col :span="11">
            <a-form-model-item label="Zone Protection Profile">
              <a-select placeholder="-select-">
                <a-select-option
                  v-for="(item, index) in zoneProtectProfilesData"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- Log Profile -->
          <a-col :span="11">
            <a-form-model-item label="Log Profile">
              <a-select
                placeholder="-select-"
                v-model="formParam.data.logProfile"
              >
                <a-select-option
                  v-for="(item, index) in logProfilesData"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          class="create-btn"
          type="flex"
          justify="space-between"
          align="top"
        >
          <!-- Create Zone Protection Profile -->
          <!-- <a-col :span="11"
            ><a href="javascript:;">+ Create Zone Protection Profile</a></a-col
          >-->
          <!-- Create Log Profile -->
          <!-- <a-col :span="11"
            ><a href="javascript:;">+ Create Log Profile</a></a-col
          >-->
        </a-row>
        <a-radio-group class="add-modle-type" v-model="admodleShow">
          <a-radio :value="1">Interface and Networks</a-radio>
          <a-radio :value="2">Routing Instance</a-radio>
          <a-radio :value="3">Organization</a-radio>
        </a-radio-group>
        <a-row
          class="add-modle-con"
          type="flex"
          justify="space-between"
          align="top"
        >
          <a-col class="add-modle-item">
            <ListCrt
              v-if="visible"
              ref="interfaces"
              :list-data="interfacesData"
              :item-data="formParam.data.interfaceList"
              :title="interfaceTit"
              @subdata="interfaceSub"
            />
            <div v-show="admodleShow !== 1" class="disabled-component"></div>
          </a-col>
          <a-col class="add-modle-item">
            <ListCrt
              v-if="visible"
              ref="routingInstance"
              :list-data="routingInstanceData"
              :item-data="formParam.data.routingInstance"
              :title="routingTit"
              @subdata="routingSub"
            />
            <div v-show="admodleShow !== 2" class="disabled-component"></div>
          </a-col>
          <a-col class="add-modle-item">
            <ListCrt
              v-if="visible"
              ref="networks"
              :list-data="networksData"
              :item-data="formParam.data.networks"
              :title="networkTit"
              @subdata="networkSub"
            />
            <div v-show="admodleShow !== 1" class="disabled-component"></div>
          </a-col>
          <a-col class="add-modle-item">
            <ListCrt
              v-if="visible"
              ref="organizations"
              :list-data="organizationsData"
              :item-data="formParam.data.orgs"
              :title="organTit"
              @subdata="organSub"
            />
            <div v-show="admodleShow !== 3" class="disabled-component"></div>
          </a-col>
        </a-row>
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
import TagInput from 'components/TagInput';
import ListCrt from 'components/ListCrt';

import {
  zoneLists,
  zoneSearch,
  zoneCreate,
  zoneModify,
  zoneDelete,
  zoneProtection,
  logProfile,
  interfaces,
  networks,
  routingInstance,
  organizations
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
      // logProfile列表数据
      logProfilesData: [],
      // interfaces列表数据
      interfacesData: [],
      // networks列表数据
      networksData: [],
      // routingInstance列表数据
      routingInstanceData: [],
      // organizations列表数据
      organizationsData: [],

      // 新建更新数据模型
      formParam: {
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          description: '',
          zoneProtectProfile: '',
          tags: [],
          logProfile: '',
          interfaceList: [],
          networks: [],
          routingInstance: [],
          orgs: []
        }
      },
      // 列表数据模板
      listParam: {
        deviceName: '',
        orgName: '',
        offset: 0,
        pageSize: 20
      },
      //查询数据模型
      searchParam: {
        deviceName: '',
        orgName: '',
        name: ''
      },
      //删除数据模型
      delParam: {
        deviceName: '',
        orgName: '',
        data: ''
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
    // 添加tag标签
    addtag(tag) {
      this.formParam.data.tags = tag;
    },
    // 获取Zone Protection Profile 列表
    async zoneProtectionList() {
      const { result } = await zoneProtection({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.zoneProtectProfilesData = result;
    },
    // 获取Log Profile 列表
    async logProfileList() {
      const { result } = await logProfile({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.logProfilesData = result;
    },
    // 获取Interfaces
    async interfacesList() {
      const { result } = await interfaces({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.interfacesData = result;
      console.log('this.interfacesData', this.interfacesData);
    },
    // 获取Networks
    async networksList() {
      const { result } = await networks({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.networksData = result;
    },
    // 获取Routing Instances
    async routingInstanceList() {
      const { result } = await routingInstance({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.routingInstanceData = result;
    },
    // 获取Organizations
    async organizations() {
      const { result } = await organizations({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      if (result && result.length > 0) this.organizationsData = result;
    },

    // addModle 数据提交
    interfaceSub(data) {
      if (data.length > 0) {
        this.formParam.data.interfaceList = data;
      } else {
        this.formParam.data.interfaceList = null;
      }
    },
    routingSub(data) {
      if (data.length > 0) {
        this.formParam.data.routingInstance = data;
      } else {
        this.formParam.data.routingInstance = null;
      }
    },
    networkSub(data) {
      if (data.length > 0) {
        this.formParam.data.networks = data;
      } else {
        this.formParam.data.networks = null;
      }
    },
    organSub(data) {
      if (data.length > 0) {
        this.formParam.data.orgs = data;
      } else {
        this.formParam.data.orgs = null;
      }
    },

    // 获取zone列表
    async lists() {
      this.listParam = {
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: this.offset,
        pageSize: this.pageSize
      };
      const { result } = await zoneLists(this.listParam);
      if (result) {
        this.tableData = result.data.forEach(item => {
          for (let key in item) {
            item[key] = Array.isArray(item[key])
              ? item[key].join(';')
              : item[key];
          }
        });
        // 获取总条数
        this.totalCount = result.total;
        this.tableData = result.data;
      } else {
        this.tableData = [];
      }
    },

    //新建zone
    async createItem() {
      this.modalTitle = 'Add Zone';
      this.modalType = 'add';
      this.zoneProtectionList();
      this.logProfileList();
      this.interfacesList();
      this.networksList();
      this.routingInstanceList();
      this.organizations();
      this.visible = true;
    },

    //编辑zone
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Zone';
      this.modalType = 'edt';
      this.searchParam = {
        deviceName: this.deviceName,
        orgName: this.organization,
        name: rowData.name
      };
      this.zoneProtectionList();
      this.logProfileList();

      this.interfacesList();

      this.networksList();

      this.routingInstanceList();
      this.organizations();
      const { result } = await zoneSearch(this.searchParam);
      this.formParam.data = Object.assign(
        this.formParam.data,
        removeNull(result)
      );

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
      this.delParam.data = rowData.name;
    },
    // 删除选中zone
    async deleteItem() {
      this.delParam.deviceName = this.deviceName;
      this.delParam.orgName = this.organization;
      const res = await zoneDelete(this.delParam);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('zone删除成功！');
      this.lists();
    },

    //表单提交
    async handleOk() {
      this.formParam.deviceName = this.deviceName;
      this.formParam.orgName = this.organization;
      // 新建zone数据
      if (this.modalType === 'add') {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.$nextTick(() => {
              this.$refs.interfaces.param();
              this.$refs.networks.param();
              this.$refs.organizations.param();
              this.$refs.routingInstance.param();
            });

            this.loading = true;
            const addRes = await zoneCreate(this.formParam);
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
            this.$nextTick(() => {
              this.$refs.interfaces.param();
              this.$refs.networks.param();
              this.$refs.organizations.param();
              this.$refs.routingInstance.param();
            });
            this.loading = true;
            const edtRes = await zoneModify(this.formParam);
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
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          description: '',
          zoneProtectProfile: '',
          tags: [],
          logProfile: '',
          interfaceList: [],
          networks: [],
          routingInstance: [],
          orgs: []
        }
      };
      this.message = {};
      this.loading = false;
    }
  },
  components: {
    TagInput,
    Pagination,
    ListCrt
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
.form-wrap {
  .create-btn {
    a {
      color: #aac0d5;
      line-height: 20px;
      font-size: 12px;
    }
  }
  .add-modle-type {
    padding: 5px 0;
  }
  .add-modle-con {
    .add-modle-item {
      width: 300px;
      height: 140px;
      overflow: hidden;
      position: relative;
      margin-bottom: 20px;
      background: #fff;
      .disabled-component {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #8fa7b7;
        cursor: not-allowed;
        opacity: 0.5;
        top: 0;
        left: 0;
      }
    }
  }
}

.roles-select {
  position: relative;
  width: 225px;
  padding: 10px 10px 10px;
  border: 1px solid #456880;
  border-radius: 4px;
  margin-top: 40px;
  &::before {
    content: 'Roles';
    background: #507691;
    border-radius: 4px;
    padding: 2px 5px;
    position: absolute;
    left: 5px;
    top: -10px;
    font-size: 12px;
    color: #fff;
  }
}
</style>

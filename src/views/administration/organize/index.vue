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
      @cancel-search="cancelSearch"
    />
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-change="delItem"
      :select-all="selectAll"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      :width="865"
      wrapClassName="form-wrap"
      :afterClose="cleanData"
      :maskClosable="false"
    >
      <!-- 提交表单 -->
      <a-form-model
        :model="formParam"
        ref="form"
        :rules="rules"
        layout="vertical"
        @validate="validate"
        class="mandatory"
        hideRequiredMark
      >
        <a-row type="flex" justify="space-between" align="top">
          <!-- 组织名称 -->
          <a-col :style="{ width: '270px' }">
            <a-form-model-item
              @blur.native.capture="routeAdd"
              label="Name"
              prop="orgName"
            >
              <a-input
                size="small"
                :disabled="modalType === 'edt'"
                v-model="formParam.orgName"
                @mouseenter="enter('orgName')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 全局组织ID -->
          <a-col :style="{ width: '270px' }">
            <a-form-model-item label="Global Organization ID">
              <a-input size="small" disabled v-model="formParam.globalId" />
            </a-form-model-item>
          </a-col>
          <!-- 设备部署类型 -->
          <a-col
            :style="{ width: '270px' }"
            @mouseenter="enter('cpeDeploymentType')"
            @mouseleave="leave"
            @mousemove="updateXY"
          >
            <a-form-model-item
              label="CPE Deployment Type"
              prop="cpeDeploymentType"
            >
              <a-select
                size="small"
                :disabled="modalType === 'edt'"
                v-model="formParam.cpeDeploymentType"
                placeholder="select"
              >
                <a-select-option value="SDWAN">SDWAN</a-select-option>
                <a-select-option value="vCPE">vCPE</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- 父级组织名称 -->
          <a-col
            :style="{ width: '413px' }"
            @mouseenter="enter('parentOrg')"
            @mouseleave="leave"
            @mousemove="updateXY"
          >
            <a-form-model-item label="Parent Organization" prop="parentOrg">
              <a-select
                size="small"
                :disabled="modalType === 'edt'"
                @change="organChange"
                v-model="formParam.parentOrg"
              >
                <a-select-option
                  v-for="(item, index) in admNameList"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- 控制器选择 -->
          <a-col
            :style="{ width: '413px' }"
            @mouseenter="enter('controllers')"
            @mouseleave="leave"
            @mousemove="updateXY"
          >
            <a-form-model-item label="Controllers" prop="controllers">
              <a-select
                size="small"
                mode="multiple"
                placeholder="Organizations must exist"
                v-model="formParam.controllers"
                @change="contrChange"
                @mouseenter="enter('controllers')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-select-option
                  v-for="(item, index) in controllerList"
                  :key="index"
                  :value="item"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 组织权限部分 -->
        <a-row class="organRole">
          <h6>Routing Instance</h6>
          <table>
            <thead>
              <tr>
                <th style="width:199px">Name</th>
                <th style="width:199px">ID</th>
                <th style="width:199px">VPN</th>
                <th style="width:48px"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a-input
                    v-model="vrfsData.name"
                    style="width:194px"
                    size="small"
                  />
                </td>
                <td>
                  <a-input
                    disabled
                    v-model="vrfsData.id"
                    style="width:194px"
                    size="small"
                  />
                </td>
                <td style="text-align:left">
                  <a-checkbox v-model="vrfsData.enableVpn"></a-checkbox>
                </td>
                <td>
                  <a-button class="addRow" @click="addVrfs">+</a-button>
                </td>
              </tr>
              <tr v-for="(item, index) in formParam.vrfs" :key="index">
                <td>
                  <a-input
                    v-model="item.name"
                    style="width:194px"
                    size="small"
                  />
                </td>

                <td>
                  <a-input
                    disabled
                    v-model="item.id"
                    style="width:194px"
                    size="small"
                  />
                </td>
                <td style="text-align:left">
                  <a-checkbox v-model="item.enableVpn"></a-checkbox>
                </td>
                <td>
                  <span @click="delVrfs(index)">
                    <img src="@/assets/images/organize/del.png" alt />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="visible = false">Cancel</a-button>
        <a-button
          type="primary"
          v-if="userInfo.level === 1"
          key="submit"
          @click="handleOk"
          :loading="loading"
          >Ok</a-button
        >
      </template>
    </a-modal>
    <!-- task 提示信息 -->
    <TaskNotice :taskinfo="taskinfo" @task-complete="taskComplete" />
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
import { mapState, mapActions } from 'vuex';
import { columns } from './table';
import { name, select, inputs } from '@/validate/common';
import common from '@/mixins/common';

import {
  adminList,
  controllerWrap,
  adminAdd,
  adminDel,
  adminId,
  adminRouerId,
  adminSearch,
  adminedit
} from 'apis/administration';

import TaskNotice from 'components/TaskNotice';
export default {
  mixins: [common],
  data() {
    return {
      columns,
      //任务进度查询
      taskinfo: {
        taskId: '',
        type: ''
      },
      controllerList: [],
      vrfsData: {
        id: '',
        name: '',
        enableVpn: false
      },
      //新建组织提交表单模型
      formParam: {
        globalId: '',
        ikeAuthType: 'psk',
        orgName: '',
        sharedControlPlane: false,
        cpeDeploymentType: '',
        supportedRoles: [],
        vrfs: [],
        controllers: [],
        parentOrg: ''
      },
      // 列表数据模型
      listParam: {
        offset: 0,
        limit: 20
      },
      //查询数据模型
      searchParam: '',
      //删除数据模型
      delParam: {
        ids: []
      },
      //角色权限添加
      admRight: {
        orgName: '',
        roleNames: []
      },

      // 表单校验规则
      rules: {
        orgName: [{ validator: name }],
        parentOrg: [{ validator: select }],
        cpeDeploymentType: [{ validator: select }],
        controllers: [{ validator: inputs }]
      }
    };
  },
  created() {
    //组织列表获取
    this.lists();
  },
  computed: {
    ...mapState({
      userInfo: state => state.common.userInfo,
      admNameList: state => state.admNameList
    })
  },
  methods: {
    ...mapActions(['getNameList']),

    // 组织下拉框控制器查询
    async organChange(value) {
      this.getController(value);
    },
    // 控制器选择
    contrChange(selectedItems) {
      this.formParam.controllers = selectedItems;
    },
    // 获取控制器
    async getController(value) {
      this.controllerList = [];
      const { result } = await controllerWrap({
        organization: value
      });
      result['appliance-list'].forEach(item => {
        this.controllerList.push(item.name);
      });
    },
    // 路由添加
    async routeAdd() {
      const { result } = await adminRouerId();
      console.log(result);
      //路由name获取
      if (this.formParam.vrfs.length == 0) {
        this.formParam.vrfs.push({
          id: '',
          name: '',
          enableVpn: true
        });
        this.formParam.vrfs[0].id = result.SdwanGlobalIds.globalIds[0];

        this.vrfsData.id = result.SdwanGlobalIds.globalIds[1];
        console.log(this.vrfsData.id);
      }
      this.formParam.vrfs[0].name = this.formParam.orgName + '-LAN-VR';
    },
    //routing Instance 添加
    async addVrfs() {
      if (this.vrfsData.name && this.vrfsData.id) {
        this.formParam.vrfs.push(this.vrfsData);
        this.vrfsData = {
          id: '',
          name: '',
          enableVpn: false
        };
        const { result } = await adminRouerId();

        this.vrfsData.id = result.SdwanGlobalIds.globalIds[0];
      }
    },
    //routing Instance 删除
    delVrfs(index) {
      this.formParam.vrfs.splice(index, 1);
    },

    // 获取组织列表
    async lists() {
      this.listParam = {
        offset: this.offset,
        limit: this.pageSize
      };
      const { result } = await adminList(this.listParam);
      this.totalCount = result.totalCount;
      //表单源获取数据
      this.tableData = result.data;
    },
    // 创建组织
    async createItem() {
      this.visible = true;
      this.modalTitle = 'Add Organization';
      this.modalType = 'add';
      // 获取组织名称列表
      if (!this.admNameList.length) {
        this.getNameList();
      }
      //获取全局ID 10个
      const { result } = await adminId();
      //获取角色权限列表
      this.formParam.globalId = result;
      this.visible = true;
    },
    // 编辑查看
    async modifyItem(params) {
      this.modalTitle = 'Edit Organization';
      this.modalType = 'edt';
      this.searchParam = params.rowData.orgName;
      // 查询当前组织信息
      const { result } = await adminSearch(this.searchParam);
      //控制器查询
      this.formParam = result;
      this.getController(this.formParam.parentOrg);
      this.formParam.vrfs.forEach(item => {
        item.enableVpn = item.enableVpn === 'true' ? true : false;
      });
      const RouerIdRes = await adminRouerId();
      this.vrfsData.id = RouerIdRes.result.SdwanGlobalIds.globalIds[0];
      this.visible = true;
    },

    // 表格单选
    delItem(selection) {
      selection.forEach(item => {
        this.delParam.ids.push(item.orgName);
      });
      const newArr = Array.from(new Set(this.delParam.ids));
      this.delParam.ids = newArr;
    },
    // 删除组织项
    async deleteItem() {
      if (!this.delParam.ids.length > 0) return;
      const res = await adminDel(this.delParam);
      this.delParam = {
        ids: []
      };
      if (res.status !== '0000') return this.$message.error(res.message);
      // 任务进度
      this.taskinfo = {
        taskId: res.result.TaskResponse['task-id'],
        type: 'del'
      };
    },
    //组织创建更新提交
    async handleOk() {
      // 组织添加
      if (this.modalType === 'add' && !this.loading) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true;
            const res = await adminAdd(this.formParam);
            this.loading = false;
            if (res.status !== '0000') return this.$message.error(res.message);

            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              type: 'add'
            };
            this.visible = false;
          }
        });
      }
      // 组织编辑查看
      if (this.modalType === 'edt' && !this.loading) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true;
            const res = await adminedit(this.formParam.orgName, this.formParam);
            this.loading = false;
            if (res.status !== '0000') return this.$message.error(res.message);
            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              type: 'edt'
            };
            this.visible = false;
          }
        });
      }
    },

    // tasknotice 关闭
    taskComplete() {
      this.lists();
      // 更新home页下拉组织列表
      this.getNameList();
    },

    // 弹出关闭清空表单和验证规则
    cleanData() {
      this.$refs.form.clearValidate();
      this.formParam = {
        globalId: '',
        ikeAuthType: 'psk',
        orgName: '',
        sharedControlPlane: false,
        cpeDeploymentType: '',
        supportedRoles: [],
        vrfs: [],
        controllers: [],
        parentOrg: ''
      };
      this.vrfsData = {
        id: '',
        name: '',
        enableVpn: false
      };
      this.message = {};
      this.loading = false;
    },
    // 搜索框设备查询
    search(data) {
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.orgName.toLowerCase().includes(keyword)
      );

      this.totalCount = list.length;
      this.tableData = list;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      this.lists();
    }
  },
  components: { TaskNotice }
};
</script>
<style lang="scss" scoped>
/deep/.v-table-title-class tr td:nth-of-type(1) .table-title .v-checkbox {
  display: block;
}
.organRole {
  width: 844px;
  h6 {
    color: #fff;
    font-size: 12px;
  }
  thead {
    th {
      border: 1px solid #d3d3d3;
      border-right: 0;
      border-left: 1px solid #97acbe;
      background: #b6c9db;
      height: 22px;
      padding: 0 2px 0 2px;
      color: #0f2c3e;
      font-size: 12px;
      font-weight: normal;
    }
  }
  tbody {
    background: #fff;
    tr {
      height: 24px;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
    }
    td {
      border-right-color: #ccc;
      padding-top: 2px;
      padding-bottom: 2px;
      border-top-color: #ccc;
      border-right-width: 1px;
      border-right-style: solid;
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      height: 21px;
      padding: 0 2px 0 2px;
      border-top-width: 1px;
      border-top-style: solid;
      font-size: 12px;
      font-weight: normal;
      input {
        padding: 0px 3px;
        height: 20px;
        border-radius: 4px;
        color: #0f2c3e;
        font-size: 12px;
        line-height: 18px;
        border: 1px solid #b0c7d5;
        border-left: 1px solid #dee3e8;
      }
      .addRow {
        min-width: 24px;
        background: none;
        padding: 0;
        background-color: #a7d054;
        font-size: 20px !important;
        color: #fff;
        display: inline-block;
        text-align: center;
      }
    }
    tr:nth-child(even) td {
      background: #e9eef4;
    }
  }
}
</style>

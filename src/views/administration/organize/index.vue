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
      :style="{ height: 'calc(100% - 15px)' }"
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-change="delItem"
      :select-all="selectAll"
      style="width: 100%;"
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
          <a-col>
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
          <a-col>
            <a-form-model-item label="Global Organization ID">
              <a-input size="small" disabled v-model="formParam.globalId" />
            </a-form-model-item>
          </a-col>
          <!-- 设备部署类型 -->
          <a-col
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
          <!-- IKE Authentication -->
          <a-col :style="{ paddingTop: '2px' }">
            <a-form-model-item label="IKE Authentication">
              <a-radio-group disabled v-model="formParam.ikeAuthType">
                <a-radio value="psk">
                  PSk
                </a-radio>
                <a-radio value="pki">
                  PKI
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 组织权限部分 -->
        <a-row class="tableSub">
          <h6>Routing Instance</h6>
          <a-col :style="{ height: '200px', width: '100%' }">
            <a-form-model
              ref="vrfs"
              :rules="rulesVrfs"
              :model="vrfsCrt"
              @validate="validate"
              hideRequiredMark
            >
              <table>
                <thead>
                  <tr>
                    <th :style="{ width: '265px' }" class="mandatory">
                      <span>Name</span>
                    </th>
                    <th :style="{ width: '265px' }">
                      <span>Idk</span>
                    </th>
                    <th :style="{ width: '265px' }">
                      <span>VPN</span>
                    </th>
                    <th style="width: 50px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a-form-model-item prop="name">
                        <a-input
                          @mouseenter="enter('name')"
                          @mouseleave="leave"
                          @mousemove="updateXY"
                          v-model="vrfsCrt.name"
                        />
                      </a-form-model-item>
                    </td>
                    <td>
                      <a-form-model-item prop="internalAddress">
                        <a-input v-model="vrfsCrt.id" />
                      </a-form-model-item>
                    </td>
                    <td>
                      <a-form-model-item>
                        <a-checkbox v-model="vrfsCrt.enableVPN" />
                      </a-form-model-item>
                    </td>
                    <td class="addBtn">
                      <button @click="addParam">+</button>
                    </td>
                  </tr>
                  <tr v-for="item in formParam.vrfs" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.id }}</td>
                    <td><input type="checkBox" :checked="item.enableVPN" /></td>
                    <td class="delBtn">
                      <a href="javascript:;" @click="delVrfsParam(item.id)"
                        ><img src="@/assets/images/organize/del.png" alt
                      /></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </a-form-model>
          </a-col>
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
import { removeNull } from '@/utils/assits';

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
      vrfsCrt: {
        id: '',
        name: '',
        enableVPN: true
      },
      rulesVrfs: {
        name: [{ required: true, message: 'field required' }]
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
      if (this.formParam.vrfs.length > 0) {
        this.formParam.vrfs[0].name = this.formParam.orgName + '-LAN-VR';
      } else {
        this.formParam.vrfs.push({
          id: result.SdwanGlobalIds.globalIds[0],
          name: this.formParam.orgName + '-LAN-VR',
          enableVPN: true
        });
        this.vrfsCrt.id = result.SdwanGlobalIds.globalIds[1];
      }
    },
    //routing Instance 添加
    addParam() {
      this.$refs.vrfs.validate(async valid => {
        if (valid) {
          this.formParam.vrfs.push({ ...this.vrfsCrt });
          const { result } = await adminRouerId();
          this.vrfsCrt.id = result.SdwanGlobalIds.globalIds[0];
          this.vrfsCrt.name = '';
          this.$refs.form.clearValidate();
        }
      });
    },
    //routing Instance 删除
    delVrfsParam(id) {
      this.formParam.vrfs = this.formParam.vrfs.filter(item => {
        return item.id !== id;
      });
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
      this.formParam = { ...this.formParam, ...removeNull(result) };
      this.getController(this.formParam.parentOrg);

      const { result: resId } = await adminRouerId();
      this.vrfsCrt.id = resId.SdwanGlobalIds.globalIds[0];
      this.visible = true;
    },

    // 表格单选
    delItem(selection, rowData) {
      // 添加单选
      const data = [];
      this.tableData.map(item => {
        item.orgName != rowData.orgName
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
      this.delParam.ids.push(rowData.orgName);
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
        enableVPN: true
      };
      this.message = {};
      this.loading = false;
    }
  },
  components: { TaskNotice }
};
</script>
<style lang="scss" scoped>
.form-wrap .ant-col {
  width: 270px;
}
.tableSub {
  padding: 0;
  width: 100%;
  border: none;
  &::before {
    display: none;
  }
  h6 {
    color: #fff;
    font-size: 12px;
  }
  .ant-form-item {
    padding: 0;
    .ant-input {
      margin: 0;
      width: 97%;
    }
  }
}
</style>

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
      :width="526"
      wrapClassName="form-wrap"
      :afterClose="cleanData"
      :maskClosable="false"
    >
      <!-- 添加修改表单 -->
      <a-form-model
        :model="formParam.user"
        ref="form"
        :rules="rules"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
        class="mandatory"
      >
        <a-row type="flex" justify="space-between" align="top">
          <!-- 组织用户名 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="User Name" prop="name">
              <a-input
                size="small"
                :disabled="modalType === 'edt'"
                v-model="formParam.user.name"
                @mouseenter="enter('name')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- First Name -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="First Name" prop="firstname">
              <a-input
                size="small"
                v-model="formParam.user.firstname"
                @mouseenter="enter('firstname')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- Last Name -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Last Name" prop="lastname">
              <a-input
                size="small"
                v-model="formParam.user.lastname"
                @mouseenter="enter('lastname')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 密码 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Password" prop="password">
              <a-input-password
                :disabled="modalType === 'edt'"
                size="small"
                type="password"
                v-model="formParam.user.password"
                @mouseenter="enter('password')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 确认密码 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Confirm Password" prop="confirm">
              <a-input-password
                :disabled="modalType === 'edt'"
                size="small"
                type="password"
                v-model="formParam.user.confirm"
                @mouseenter="enter('confirm')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 邮箱地址 -->
          <a-col :style="{ width: '162px' }">
            <a-form-model-item label="Email Address" prop="email">
              <a-input
                :disabled="modalType === 'edt'"
                size="small"
                v-model="formParam.user.email"
                @mouseenter="enter('email')"
                @mouseleave="leave"
                @mousemove="updateXY"
              />
            </a-form-model-item>
          </a-col>
          <!-- 组织角色列表 -->
          <a-col :style="{ marginTop: '10px' }">
            <a-form-model-item
              class="roles-select"
              label="Available Roles"
              v-model="formParam.user.primaryRole"
              prop="primaryRole"
            >
              <a-select
                size="small"
                placeholder="-select-"
                v-model="formParam.user.primaryRole"
                @mouseenter="enter('primaryRole')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-select-option
                  v-if="userInfo.level === 1"
                  value="TenantSuperAdmin"
                  >TenantSuperAdmin</a-select-option
                >
                <a-select-option
                  v-if="!(userInfo.level === 3)"
                  value="TenantOperator"
                  >TenantOperator</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="visible = false">Cancel</a-button>
        <a-button
          type="primary"
          v-if="userInfo.level === 1 || 2"
          key="submit"
          @click="handleOk"
          :loading="loading"
          >Ok</a-button
        >
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
import { mapState, mapActions } from 'vuex';
import { columns } from './table';
import { name, password, confirm, email, select } from '@/validate/common';
import common from '@/mixins/common';

import {
  adminUsersLists,
  adminUserAdd,
  adminUserDel,
  adminUserEdt
} from 'apis/administration';
export default {
  mixins: [common],
  data() {
    return {
      columns,
      userRoles: [], //用户权限列表
      // 表单提交更新模型
      formParam: {
        user: {
          name: '',
          password: '',
          confirm: '',
          firstname: '',
          lastname: '',
          email: '',
          organization: '',
          primaryRole: ''
        }
      },
      // 列表数据模型
      listParam: {
        organization: '',
        offset: 0,
        limit: 20
      },
      //查询数据模型
      searchParam: '',
      //删除数据模型
      delParam: {
        id: ''
      },
      // 表单校验规则
      rules: {
        name: [{ validator: name }],
        firstname: [{ validator: name }],
        lastname: [{ validator: name }],
        password: [{ validator: password }],
        confirm: [{ validator: confirm('') }],
        email: [{ validator: email }],
        primaryRole: [{ validator: select }]
      }
    };
  },
  computed: {
    ...mapState({
      // 获取当前组织
      organization: state => state.organization,
      // 获取用户信息 level
      userInfo: state => state.common.userInfo
    })
  },
  created() {
    //获取组织列表
    this.getNameList();
  },
  methods: {
    ...mapActions(['getNameList']),
    // 获取组织用户列表
    async lists() {
      if (this.organization) {
        this.listParam = {
          organization: this.organization,
          offset: this.offset,
          limit: this.pageSize
        };
        const { result } = await adminUsersLists(this.listParam);
        console.log(result);
        this.totalCount = result.totalCount;
        //表单源获取数据
        this.tableData = result.list;
      }
    },

    //添加组织用户
    async createItem() {
      if (!this.organization) {
        return this.$message.error('请选择组织用户！');
      }
      this.modalTitle = `Add user for Organization ${this.organization}`;
      this.modalType = 'add';
      //获取当前组织并赋值
      this.formParam.user.organization = this.organization;
      this.visible = true;
    },

    //编辑查看组织用户
    async modifyItem(params) {
      this.modalTitle = 'Edit Organization User';
      this.modalType = 'edt';
      this.visible = true;
      this.formParam.user = { ...this.formParam.user, ...params.rowData };
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
      this.delParam.id = rowData.name;
    },
    // 删除选中组织用户
    async deleteItem() {
      if (!this.delParam.id) return;
      const res = await adminUserDel(this.delParam);
      if (res.status !== '0000') return this.$message.error(res.status.message);
      this.$message.success('组织用户删除成功！');
      this.delParam.id = '';
      this.lists();
    },
    // 新增修改提交
    async handleOk() {
      if (this.modalType === 'add' && !this.loading) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true;
            const result = await adminUserAdd(this.formParam);
            this.loading = false;
            if (result.status !== '0000')
              return this.$message.error(result.message);
            this.$message.success('组织用户创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      if (this.modalType === 'edt' && !this.loading) {
        this.$refs.form.validateField(
          ['firstname', 'lastname', 'primaryRole'],
          async () => {
            if (
              !this.message.firstname &&
              !this.message.lastname &&
              !this.message.primaryRole
            ) {
              this.loading = true;
              const res = await adminUserEdt(
                this.formParam.user.name,
                this.formParam
              );
              this.loading = false;
              if (res.status !== '0000')
                return this.$message.error(res.message);
              this.$message.success('组织用户更新成功！');
              this.visible = false;
              this.lists();
            }
          }
        );
      }
    },
    cleanData() {
      this.$refs.form.clearValidate();
      this.formParam = {
        user: {
          name: '',
          password: '',
          confirm: '',
          firstname: '',
          lastname: '',
          email: '',
          organization: '',
          primaryRole: ''
        }
      };
      this.message = {};
      this.loading = false;
    }
  },
  watch: {
    organization: {
      handler: 'lists',
      immediate: true
    },

    ['formParam.user.password']() {
      this.rules.confirm = [
        { validator: confirm(this.formParam.user.password) }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
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

<template>
  <a-modal
    wrapClassName="form-wrap"
    title="Create  WAN Network"
    :visible="visible"
    :width="400"
    :maskClosable="false"
    :afterClose="CleanData"
    @cancel="close"
  >
    <a-form-model
      ref="form"
      :model="formParam"
      :rules="rules"
      layout="vertical"
      @validate="validate"
      hideRequiredMark
    >
      <a-form-model-item class="mandatory" label="Name" prop="name">
        <a-input
          @mouseenter="enter('name')"
          @mouseleave="leave"
          @mousemove="updateXY"
          size="small"
          v-model="formParam.name"
        />
      </a-form-model-item>
      <a-form-model-item label="Description" prop="description">
        <a-input size="small" v-model="formParam.description" />
      </a-form-model-item>
      <a-col
        @mouseenter="enter('domains')"
        @mouseleave="leave"
        @mousemove="updateXY"
      >
        <a-form-model-item
          class="mandatory"
          label="Transport Domain"
          prop="domains"
        >
          <a-select mode="multiple" size="small" v-model="formParam.domains">
            <a-select-option v-for="(item, index) in domainList" :key="index">
              {{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-form-model>
    <template slot="footer">
      <a-button type="primary" key="submit" @click="handleOk">
        Ok
      </a-button>
      <a-button @click="close" key="back">
        Cancel
      </a-button>
    </template>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </a-modal>
</template>

<script>
import { name, inputs } from '@/validate/common';
import { TraDomain, netWrokNameCre } from 'apis/administration';
import tip from '@/mixins/tip';
export default {
  mixins: [tip],
  props: {
    visible: {
      type: Boolean
    },
    orguuid: {
      type: String
    }
  },
  data() {
    return {
      networkNames: [],
      formParam: {
        orguuid: this.orguuid,
        name: '',
        domains: [],
        description: ''
      },
      domainList: [],
      rules: {
        name: [{ validator: name }],
        domains: [{ validator: inputs }]
      }
    };
  },
  created() {
    this.addNetwork();
  },
  methods: {
    // 模板Transport Domain查询
    async addNetwork() {
      const { result } = await TraDomain();
      this.domainList = result.domainList;
    },
    // networkname提交
    async handleOk() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          //组织详细信息 获取uuid
          console.log(this.orguuid);
          const resNetWorkName = await netWrokNameCre(this.formParam);
          if (resNetWorkName.status !== '0000')
            return this.$message.error(resNetWorkName.message);
          this.$message.success('NetWork Name 创建成功！');
          this.$emit('new-netwrok', this.formParam.name);
        }
      });
    },
    close() {
      this.$emit('new-netwrok');
    },
    // networkname弹出关闭
    CleanData() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped></style>

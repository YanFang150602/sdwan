<template>
  <div>
    <a-modal
      v-model="visible"
      title="create Service"
      on-ok="handleOk"
      width="600px"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :rules="rules" :model="form.address" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="20">
              <a-form-model-item label="Name" prop="name">
                <a-input size="small" v-model="form.address.name" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Description">
                <a-input size="small" v-model="form.address.description" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group
                  v-model="form.address.isProtocol"
                  @change="radio"
                >
                  <a-radio value="true"> Protocol </a-radio>
                  <a-radio value="false"> Protocol Value </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Protocol" prop="protocol">
                <a-select
                  :disabled="form.address.isProtocol === 'true' ? false : true"
                  v-model="form.address.protocol"
                  size="small"
                  @change="handleChange"
                >
                  <a-select-option value="">
                    ---Pleace Select---
                  </a-select-option>
                  <a-select-option value="TCP"> TCP </a-select-option>
                  <a-select-option value="UDP"> UDP </a-select-option>
                  <a-select-option value="ICMP"> ICMP </a-select-option>
                  <a-select-option value="ESP"> ESP </a-select-option>
                  <a-select-option value="AH"> AH </a-select-option>
                  <a-select-option value="TCP_OR_UDP">
                    TCP_OR_UDP
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Protocol Value">
                <a-input
                  :disabled="form.address.isProtocol === 'true' ? true : false"
                  size="small"
                  v-model="form.address.ProtocolValue"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group name="radioGroup" v-model="form.address.isPort">
                  <a-radio value="true"> Port </a-radio>
                  <a-radio value="false"> Source/Destination </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="7">
              <a-form-model-item label="Port" prop="Port">
                <a-input
                  :disabled="form.address.isPort === 'true' ? false : true"
                  size="small"
                  v-model="form.address.Port"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item label="Source Port" prop="SourcePort">
                <a-input
                  :disabled="form.address.isPort === 'true' ? true : false"
                  size="small"
                  v-model="form.address.SourcePort"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item
                label="Destination Port"
                prop="destinationPort"
              >
                <a-input
                  :disabled="form.address.isPort === 'true' ? true : false"
                  size="small"
                  v-model="form.address.destinationPort"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { ServiceAdd } from 'apis/customApplication';
import { mapState } from 'vuex';
// import { urlCategoriesSelect } from 'apis/urlCategories';

// import Vue from 'vue';
export default {
  data() {
    return {
      // loading: false,
      visible: true,
      form: {
        deviceName: '',
        userName: '',
        address: {
          name: '',
          description: '',
          isProtocol: 'true',
          protocol: '',
          ProtocolValue: '',
          isPort: 'true',
          Port: '',
          SourcePort: '',
          destinationPort: ''
        }
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          }
        ],
        protocol: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          }
        ],
        Port: [
          {
            pattern: '^(^24[0-4]\\d{2}$)|(^24500$)|(^2500[0-2]$)',
            message: 'Value must be between 1 and 10000000',
            trigger: 'blur'
          }
        ],
        SourcePort: [
          {
            pattern: '^(^24[0-4]\\d{2}$)|(^24500$)|(^2500[0-2]$)',
            message: 'Value must be between 1 and 10000000',
            trigger: 'blur'
          }
        ],
        destinationPort: [
          {
            pattern: '^(^24[0-4]\\d{2}$)|(^24500$)|(^2500[0-2]$)',
            message: 'Value must be between 1 and 10000000',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(['organization'])
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      let rule = ['name', 'Port', 'SourcePort', 'destinationPort'];
      if (this.form.address.isProtocol === 'true') {
        rule.push('protocol');
      }
      const formBool = [];
      this.$refs.ruleForm.validateField(rule, value => {
        if (value) {
          // 代表有错
          formBool.push(0);
        }
      });
      if (formBool.length === 0) {
        this.createdService();
      }
    },
    async createdService() {
      this.form.address.orgName = this.organization;
      // if (this.form.address.isProtocol === 'Protocol') {
      //   this.form.address.isProtocol = 'true';
      // } else {
      //   this.form.address.isProtocol = 'false';
      // }
      // if (this.form.address.isPort === 'Port') {
      //   this.form.address.isPort = 'true';
      // } else {
      //   this.form.address.isPort = 'false';
      // }
      console.log(this.form.address);
      const res = await ServiceAdd(this.form.address);
      console.log(res, '调用新增接口');
    },
    handleCancel() {
      this.visible = false;
      // this.clear();
      // this.$refs.ruleForm.resetFields();
    },
    radio(e) {
      console.log(e);
      if (e.target.value === 'Protocol') {
        this.form.address.ProtocolValue = '';
      } else {
        this.form.address.protocol = '';
      }
    },
    handleChange(e) {
      // console.log(`selected ${value}`);
      console.log(e);
      console.log(this.form.address.protocol);
      // this.form.address.tags = value;
      // console.log(this.form.address.tags);
    },
    clear() {},
    callback(key) {
      console.log(key);
    }
  }
};
</script>
<style lang="scss" scoped>
// 弹框的样式
/deep/.ant-modal-close-x {
  line-height: 36px;
}
/deep/.ant-modal-content {
  max-height: 1000px;
  .ant-modal-header {
    height: 31px;
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    height: 300px;
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
}
.title {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 5px;
    margin-bottom: 0;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-input {
      width: 100%;
      height: 20px;
    }
  }
}
</style>

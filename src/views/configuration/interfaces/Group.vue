<template>
  <div>
    <a-modal
      v-model="visible"
      title="Create Custom Application Group"
      on-ok="handleOk"
      width="376px"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :rules="rules" :model="form.address" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="23">
              <a-form-model-item label="Name" prop="name">
                <a-input size="small" v-model="form.address.name" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="23">
              <a-form-model-item label="Description">
                <a-input size="small" v-model="form.address.description" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <AddModle
            title="Applications"
            style="width:341px;margin:10px 6px;"
            @subdata="ApplicationsData"
            :listdate="predefinedApp"
            :list="AppData"
          />
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { GroupAdd } from 'apis/customApplication';
import { predefinedApp } from './PredefinedApp';
import { mapState } from 'vuex';
import AddModle from 'components/PeerFqdnAdd';
// import { urlCategoriesSelect } from 'apis/urlCategories';

// import Vue from 'vue';
export default {
  components: {
    AddModle
  },
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
          predefinedApps: []
        }
      },
      AppData: [],
      predefinedApp,
      rules: {
        name: [
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
    ...mapState(['organization'])
  },
  created() {
    this.getPredefined();
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    async getPredefined() {
      //  const res = await predefinedApplication();
      //  console.log(res);
      //  if (res.message === 'Success') {
      //    this.AppList = res.result;
      //  }
    },
    handleOk() {
      let rule = ['name', 'Port', 'SourcePort', 'DestinationPort'];
      if (this.form.address.ProtocolRadio === 'Protocol') {
        rule.push('ProtocolSelect');
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
      const res = await GroupAdd(this.form.address);
      console.log(res);
      console.log('调用新增接口');
    },
    handleCancel() {
      this.visible = false;
      // this.clear();
      // this.$refs.ruleForm.resetFields();
    },
    // 获取Applications数据
    ApplicationsData(data) {
      console.log(data[0].subData);
      this.form.address.predefinedApps = data[0].subData;
    },
    handleChange(e) {
      // console.log(`selected ${value}`);
      console.log(e);
      console.log(this.form.address.ProtocolSelect);
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
    height: 217px;
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

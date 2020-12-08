<template>
  <div>
    <a-modal
      v-model="visible"
      title="Edit Branch SDWAN Profile"
      on-ok="handleOk"
      width="420px"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :loading="loading"
          >Ok</a-button
        >
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm" :rules="rules">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Profile Name" prop="name">
                  <a-input v-model="SDWANProfileEdit.name" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Transform">
                  <a-select v-model="SDWANProfileEdit.transform">
                    <a-select-option :value="null">--Select--</a-select-option>
                    <a-select-option
                      :value="item.name"
                      v-for="item in transList"
                      :key="item.lable"
                      >{{ item.lable }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Transform Set">
                <a-select
                  mode="tags"
                  style="width: 100%"
                  :token-separators="[',']"
                  @change="handleChange"
                  size="small"
                  v-model="SDWANProfileEdit.transformSet"
                >
                  <a-select-option
                    :value="item"
                    v-for="item in tsList"
                    :key="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="DH Group">
                  <a-select v-model="SDWANProfileEdit.dhGroup">
                    <a-select-option :value="null">--Select--</a-select-option>
                    <a-select-option
                      :value="item.name"
                      v-for="item in dhList"
                      :key="item.lable"
                      >{{ item.lable }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="DH Group Set">
                  <a-select
                    mode="tags"
                    style="width: 100%"
                    :token-separators="[',']"
                    @change="handleChange"
                    size="small"
                    v-model="SDWANProfileEdit.dhGroupSet"
                  >
                    <a-select-option
                      :value="item.name"
                      v-for="item in dgList"
                      :key="item.name"
                      >{{ item.lable }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <a-row>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item label="Life Time(sec)">
                  <a-input v-model="SDWANProfileEdit.lifeTime" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item label="Rekey Time">
                  <a-input v-model="SDWANProfileEdit.rekeyTime" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { branchEdit } from 'apis/branchSDWANProfile';

export default {
  created() {},
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  props: ['SDWANProfileEdit'],
  data() {
    return {
      loading: false,
      visible: false,
      // transform下拉框的数据
      transList: [
        { lable: 'esp-3des-md5', name: 'esp-3des-md5' },
        { lable: 'esp-3des-sha1', name: 'esp-3des-sha1' },
        { lable: 'esp-aes128-ctr-sha1', name: 'esp-aes128-ctr-sha1' },
        { lable: 'esp-aes128-ctr-xcbc', name: 'esp-aes128-ctr-xcbc' },
        { lable: 'esp-aes128-gcm', name: 'esp-aes128-gcm' },
        { lable: 'esp-aes128-md5', name: 'esp-aes128-md5' },
        { lable: 'esp-aes128-sha1', name: 'esp-aes128-sha1' },
        { lable: 'esp-aes128-sha256', name: 'esp-aes128-sha256' },
        { lable: 'esp-aes128-sha384', name: 'esp-aes128-sha384' },
        { lable: 'esp-aes128-sha512', name: 'esp-aes128-sha512' },
        { lable: 'esp-aes256-gcm', name: 'esp-aes256-gcm' },
        { lable: 'esp-aes256-md5', name: 'esp-aes256-md5' },
        { lable: 'esp-aes256-sha1', name: 'esp-aes256-sha1' },
        { lable: 'esp-aes256-sha256', name: 'esp-aes256-sha256' },
        { lable: 'esp-aes256-sha384', name: 'esp-aes256-sha384' },
        { lable: 'esp-aes256-sha512', name: 'esp-aes256-sha512' },
        { lable: 'esp-null-md5', name: 'esp-null-md5s' }
      ],
      // transform Set下拉框
      tsList: [
        'esp-3des-md5',
        'esp-3des-sha1',
        'esp-aes128-ctr-sha1',
        'esp-aes128-ctr-xcbc',
        'esp-aes128-gcm',
        'esp-aes128-md5',
        'esp-aes128-sha1',
        'esp-aes128-sha256',
        'esp-aes128-sha384',
        'esp-aes128-sha512',
        'esp-aes256-gcm',
        'esp-aes256-md5',
        'esp-aes256-sha1',
        'esp-aes256-sha256',
        'esp-aes256-sha384',
        'esp-aes256-sha512',
        'esp-null-md5'
      ],
      // DH Group下拉框的数据
      dhList: [
        { lable: 'Diffie-Hellman Group 1 - 768-bit modulus', name: 'mod1' },
        { lable: 'Diffie-Hellman Group 2 - 1024-bit modulus', name: 'mod2' },
        { lable: 'Diffie-Hellman Group 5 - 1536-bit modulus', name: 'mod5' },
        { lable: 'Diffie-Hellman Group 14 - 2048 bit modulus', name: 'mod14' },
        { lable: 'Diffie-Hellman Group 15 - 3072 bit modulus', name: 'mod15' },
        { lable: 'Diffie-Hellman Group 16 - 4096 bit modulus', name: 'mod16' },
        { lable: 'Diffie-Hellman Group 19 - 256 bit modulus', name: 'mod19' },
        { lable: 'Diffie-Hellman Group 20 - 384 bit modulus', name: 'mod20' },
        { lable: 'Diffie-Hellman Group 25 - 192 bit modulus', name: 'mod25' },
        { lable: 'Diffie-Hellman Group 26 - 224 bit modulus', name: 'mod26' }
      ],
      // DH Group Set下拉框
      dgList: [
        { lable: 'Diffie-Hellman Group 1 - 768-bit modulus', name: 'mod1' },
        { lable: 'Diffie-Hellman Group 2 - 1024-bit modulus', name: 'mod2' },
        { lable: 'Diffie-Hellman Group 5 - 1536-bit modulus', name: 'mod5' },
        { lable: 'Diffie-Hellman Group 14 - 2048 bit modulus', name: 'mod14' },
        { lable: 'Diffie-Hellman Group 15 - 3072 bit modulus', name: 'mod15' },
        { lable: 'Diffie-Hellman Group 16 - 4096 bit modulus', name: 'mod16' },
        {
          lable: 'Diffie-Hellman Group 19 - 256 bit elliptic curve',
          name: 'mod19'
        },
        {
          lable: 'Diffie-Hellman Group 20 - 384 bit elliptic curve',
          name: 'mod20'
        },
        {
          lable: 'Diffie-Hellman Group 25 - 192 bit elliptic curve',
          name: 'mod25'
        },
        {
          label: 'Diffie-Hellman Group 26 - 224 bit elliptic curve',
          name: 'mod26'
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ]
      },
      form: {}
    };
  },
  methods: {
    showModalEdit() {
      this.visible = true;
    },
    async handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      this.SDWANProfileEdit.deviceName = this.deviceName;
      this.SDWANProfileEdit.orgName = this.organization;
      delete this.SDWANProfileEdit.totalCount;
      const res = await branchEdit(this.SDWANProfileEdit);
      console.log(res);
      if (res.message === 'Success') {
        this.$message.success('编辑成功');
        this.visible = false;
        this.$parent.tableForm();
      } else {
        this.$message.error(res.message);
      }
    },
    handleCancel() {
      this.visible = false;
      this.clear();
      this.$refs.ruleForm.resetFields();
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    clear() {}
  }
};
</script>
<style lang="scss">
.ant-form-item-required {
  &::before {
    display: none;
  }
  &::after {
    content: '*' !important;
    color: #f5222d !important;
    font-size: 18px !important;
    margin-left: 4px !important;
    display: inline-block !important;
  }
}
</style>

<style lang="scss" scoped>
// label样式
/deep/.ant-modal-title {
  font-size: 12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}
// -----------------------
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-item-label > label::after {
  display: none;
}
/deep/.ant-checkbox + span {
  padding-right: 0px !important;
}
// 弹框的样式
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
    // height: 267px;
    padding: 3px;
    background-color: #36536b;
    padding-left: 3px;
    padding-bottom: 10px;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
}
/deep/.ant-modal-title {
  margin-left: -12px;
}
.title {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 400px;
    margin-bottom: 0;
    margin-left: 3px;
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
    .ant-select-selection--single {
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
}
.footer {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 196px;
    margin-bottom: 0;
    margin-left: 3px;
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

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
  font-size: 12px;
}
/deep/.ant-btn:nth-child(2) {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
  font-size: 12px;
}
</style>

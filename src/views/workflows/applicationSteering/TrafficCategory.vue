<template>
  <div>
    <a-modal
      v-model="visible"
      title="Create Traffic Category"
      on-ok="handleOk"
      width="865px"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Create</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm" :rules="rulesT">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name" prop="categoryName">
                  <a-input v-model="form.categoryName"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Forwarding Class" prop="forwardingClass">
                  <a-select v-model="form.forwardingClass">
                    <a-select-option
                      :value="item.name"
                      v-for="(item,index) in forClassList"
                      :key="index"
                    >{{item.lable}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Loss Priority">
                  <a-select v-model="form.transform">
                    <a-select-option
                      :value="item"
                      v-for="(item,index) in transList"
                      :key="index"
                    >{{item}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="main">
          <div class="traffic">Traffic Conditioning</div>
          <a-row>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox name="type" v-model="selectForm.fec">FEC</a-checkbox>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox name="type" v-model="selectForm.replication">Replication</a-checkbox>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Load Balance">
                <a-select v-model="selectForm.per">
                  <a-select-option value="Per_Flow">Per Flow</a-select-option>
                  <a-select-option value="Per_Packet">Per Packet</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="bottom">
          <div class="circuit">Circuit Selection Criteria</div>
          <a-row>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox name="type" v-model="selectForm.lowLatency">Low Latency</a-checkbox>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox name="type" v-model="selectForm.lowPacketLoss">Low Packet Loss</a-checkbox>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox name="type" v-model="selectForm.lowDelayVariation">Low Delay Variation</a-checkbox>
              </a-form-model-item>
            </a-col>
            <AddModleDouble :title="Priority" :titleSecond="WANCircuit" style="width:800px;"/>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >{{ formTips.tipText }}</div>
  </div>
</template>
<script>
import tip from '@/mixins/tip';
import AddModleDouble from 'components/TrafficDouble/AddModle';

export default {
  mixins: [tip],
  created() {},
  components: {
    AddModleDouble
  },
  data() {
    return {
      Priority: 'Priority',
      WANCircuit: 'WAN Circuit',
      visible: false,
      // transform下拉框的数据
      transList: ['Low', 'High'],
      // forwarding class下拉框数据
      forClassList: [
        { lable: 'Forwarding Class 0(Network-Control)', name: 'fc_nc' },
        { lable: 'Forwarding Class 1', name: 'fc1' },
        { lable: 'Forwarding Class 2', name: 'fc2' },
        { lable: 'Forwarding Class 3', name: 'fc3' },
        { lable: 'Forwarding Class 4(Expedited-Forwarding)', name: 'fc_ef' },
        { lable: 'Forwarding Class 5', name: 'fc5' },
        { lable: 'Forwarding Class 6', name: 'fc6' },
        { lable: 'Forwarding Class 7', name: 'fc7' },
        { lable: 'Forwarding Class 8(Assured-Forwarding)', name: 'fc_af' },
        { lable: 'Forwarding Class 9', name: 'fc9' },
        { lable: 'Forwarding Class 10', name: 'fc10' },
        { lable: 'Forwarding Class 11', name: '11' },
        { lable: 'Forwarding Class 12(Best-Effort)', name: 'fc_be' },
        { lable: 'Forwarding Class 13', name: 'fc13' },
        { lable: 'Forwarding Class 14', name: 'fc14' },
        { lable: 'Forwarding Class 15', name: 'fc15' }
      ],
      form: {
        categoryName: '',
        defaultActions: [],
        defaultPathPriorities: {},
        forwardingClass: '',
        lossPriority: '',
        rules: []
      },
      rulesT: {
        categoryName: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        forwardingClass: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
          }
        ]
      },
      selectForm: {
        fec: false,
        replication: false,
        lowLatency: false,
        lowPacketLoss: false,
        lowDelayVariation: false,
        per: ''
      }
    };
  },
  watch: {
    'selectForm.fec'(value) {
      if (value) return this.form.defaultActions.push('FEC');
    },
    'selectForm.replication'(value) {
      if (value) return this.form.defaultActions.push('REPLICATION');
    },
    'selectForm.lowLatency'(value) {
      if (value) return this.form.defaultActions.push('LOW_LATENCY');
    },
    'selectForm.lowPacketLoss'(value) {
      if (value) return this.form.defaultActions.push('LOW_PACKET_LOSS');
    },
    'selectForm.lowDelayVariation'(value) {
      if (value) return this.form.defaultActions.push('LOW_DELAY_VARIATION');
    },
    'selectForm.per'(value) {
      if (value === 'Per_Flow')
        return this.form.defaultActions.push('PER_FLOW');
      if (value === 'Per_Packet')
        return this.form.defaultActions.push('PER_PACKET');
    }
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.visible = false;
          this.$emit('table', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
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
    height: 475px;
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
      width: 845px;
      height: 20px;
    }
    .ant-select-selection--single {
      width: 845px;
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
}
.main {
  width: 845px;
  height: 71px;
  border: 1px solid #456880;
  margin-top: 10px;
  padding: 3px 10px 10px;
  position: relative;
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
    .ant-select-selection--single {
      width: 184px;
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
  /deep/.ant-checkbox-wrapper {
    color: #f9f9f9;
    margin-top: 10px;
  }
  .traffic {
    position: absolute;
    width: 119px;
    height: 22px;
    font-size: 12px;
    color: #fff;
    left: 12px;
    top: -10px;
    background: #507691;
    text-align: center;
  }
  /deep/.ant-select-selection--single {
    height: 20px;
  }
  /deep/.ant-select-selection__rendered {
    line-height: unset;
  }
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
}
.bottom {
  width: 845px;
  // height: 71px;
  border: 1px solid #456880;
  margin-top: 10px;
  padding: 3px 10px 10px;
  position: relative;
  /deep/.ant-checkbox-wrapper {
    color: #fff;
  }
  .circuit {
    position: absolute;
    width: 143px;
    height: 22px;
    font-size: 12px;
    color: #fff;
    left: 12px;
    top: -10px;
    background: #507691;
    text-align: center;
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

<template>
  <div>
    <a-modal v-model="visible" title="Add Match Information" on-ok="handleOk" width="645px">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form.address" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name">
                  <a-input v-model="form.name"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="main">
          <a-row>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item label="Host Pattern">
                  <a-input v-model="form.hostPattern"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item label="Protocol Value">
                  <a-input v-model="form.protocol"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item label="Source Address">
                  <a-input v-model="form.sourceAddress"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item label="Destination Address">
                  <a-input v-model="form.destinationAddress"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <!-- 上框 -->
        <div class="SourcePort">
          <a-form-model-item class="Source">
            <a-checkbox name="type" v-model="form.SourcePort">Source Port</a-checkbox>
          </a-form-model-item>
          <a-form-model-item>
            <a-radio-group v-model="form.resource">
              <a-radio value="value">value</a-radio>
              <a-radio value="Range">Range</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="Source Port Value">
                <a-input
                  v-model="form.SourcePortValue"
                  :disabled="isDisabled.includes('Source Port Value')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Low">
                <a-input v-model="form.SourceLow" :disabled="isDisabled.includes('Low')"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Highs">
                <a-input v-model="form.SourceHighs" :disabled="isDisabled.includes('Highs')"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <!-- 下框 -->
        <div class="DestinationPort">
          <a-form-model-item class="Destination">
            <a-checkbox name="type1" v-model="form.DestinationPort">Destination Port</a-checkbox>
          </a-form-model-item>
          <a-form-model-item>
            <a-radio-group v-model="form.Destination">
              <a-radio value="DestinationValue">value</a-radio>
              <a-radio value="DestinationRange">Range</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="Destination Prot Value">
                <a-input
                  v-model="form.DestinationProtValue"
                  :disabled="isDisabled.includes('Destination Prot Value')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Low">
                <a-input
                  v-model="form.DestinationLow"
                  :disabled="isDisabled.includes('DestinationLow')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Highs">
                <a-input
                  v-model="form.DestinationHighs"
                  :disabled="isDisabled.includes('DestinationHighs')"
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
// import { mapState } from 'vuex';
const originForm = {
  name: '',
  hostPattern: '',
  protocol: '',
  sourceAddress: '',
  destinationAddress: '',
  SourcePort: false,
  resource: '',
  SourcePortValue: '',
  SourceLow: '',
  SourceHighs: '',
  DestinationPort: false,
  Destination: '',
  DestinationProtValue: '',
  DestinationLow: '',
  DestinationHighs: ''
};
export default {
  components: {},
  data() {
    return {
      visible: false,
      form: { ...originForm },
      tableList: []
    };
  },
  computed: {
    isDisabled() {
      console.log(this.form.SourceLow);
      const res = [];
      if (this.form.resource == 'Range') res.push('Source Port Value');
      if (this.form.resource == 'value') res.push('Low', 'Highs');

      if (this.form.Destination == 'DestinationRange')
        res.push('Destination Prot Value');
      if (this.form.Destination == 'DestinationValue')
        res.push('DestinationLow', 'DestinationHighs');

      return res;
    }
  },
  watch: {
    'form.SourcePort'(newValue) {
      if (newValue) {
        this.form.resource = 'value';
      } else {
        this.form.resource = '';
      }
    },
    'form.DestinationPort'(newValue) {
      if (newValue) {
        this.form.Destination = 'DestinationValue';
      } else {
        this.form.Destination = '';
      }
    }
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      console.log(this.form);
      this.$emit('table', this.form);
      this.clear();
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      console.log(value);
    },
    clear() {
      this.form = { ...originForm };
    }
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
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-item-label > label::after {
  display: none;
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
    height: 386px;
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
}
// label样式
/deep/.ant-modal-title {
  font-size: 12px;
  margin-left: -12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}
// -----------------------
.title {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 625px;
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
.main {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 306px;
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
.SourcePort {
  width: 625px;
  height: 109px;
  border: 1px solid #456880;
  margin-top: 10px;
  position: relative;
  /deep/.ant-form-item {
    padding: 0;
    width: 200px;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      // line-height: 19px;
    }
    .ant-input {
      height: 20px;
    }
  }
  /deep/.ant-form-item-label > label {
    color: #fff;
  }
  /deep/.ant-checkbox-wrapper {
    color: #fff;
  }
  /deep/.ant-radio-wrapper {
    color: #fff;
  }
  .Source {
    position: absolute !important;
    left: 10px;
    top: -20px;
  }
}

.DestinationPort {
  width: 625px;
  height: 109px;
  border: 1px solid #456880;
  margin-top: 10px;
  position: relative;
  /deep/.ant-form-item {
    padding: 0;
    width: 200px;
    margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      // line-height: 19px;
    }
    .ant-input {
      height: 20px;
    }
  }
  /deep/.ant-form-item-label > label {
    color: #fff;
  }
  /deep/.ant-checkbox-wrapper {
    color: #fff;
  }
  /deep/.ant-radio-wrapper {
    color: #fff;
  }
  .Destination {
    position: absolute !important;
    left: 10px;
    top: -20px;
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

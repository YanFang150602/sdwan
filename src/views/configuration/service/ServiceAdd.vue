<template>
  <div>
    <a-modal
      v-model="visible"
      title="Create Service"
      on-ok="handleOk"
      @cancel="handleCancel"
      width="600px"
      v-drag
    >
      <template slot="footer">
        <a-button key="submit" :loading="loading" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :rules="rules" :model="form.ServiceEdit" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="20">
              <a-form-model-item label="Name" prop="name">
                <a-input size="small" v-model="form.ServiceEdit.name"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Description">
                <a-input size="small" v-model="form.ServiceEdit.description"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group v-model="form.ServiceEdit.isProtocol" @change="radio">
                  <a-radio value="true">Protocol</a-radio>
                  <a-radio value="false">Protocol Value</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Protocol" prop="protocol">
                <a-select
                  :disabled="
                    form.ServiceEdit.isProtocol === 'true' ? false : true
                  "
                  v-model="form.ServiceEdit.protocol"
                  size="small"
                  @change="handleChange"
                >
                  <a-select-option value>---Pleace Select---</a-select-option>
                  <a-select-option value="TCP">TCP</a-select-option>
                  <a-select-option value="UDP">UDP</a-select-option>
                  <a-select-option value="ICMP">ICMP</a-select-option>
                  <a-select-option value="ESP">ESP</a-select-option>
                  <a-select-option value="AH">AH</a-select-option>
                  <a-select-option value="TCP_OR_UDP">TCP_OR_UDP</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Protocol Value">
                <a-input
                  :disabled="
                    form.ServiceEdit.isProtocol === 'true' ? true : false
                  "
                  size="small"
                  v-model="form.ServiceEdit.ProtocolValue"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group name="radioGroup" v-model="form.ServiceEdit.isPort">
                  <a-radio value="true">Port</a-radio>
                  <a-radio value="false">Source/Destination</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="7">
              <a-form-model-item label="Port" prop="Port">
                <a-input
                  :disabled="form.ServiceEdit.isPort === 'true' ? false : true"
                  size="small"
                  v-model="form.ServiceEdit.Port"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item label="Source Port" prop="SourcePort">
                <a-input
                  :disabled="form.ServiceEdit.isPort === 'true' ? true : false"
                  size="small"
                  v-model="form.ServiceEdit.SourcePort"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="7">
              <a-form-model-item label="Destination Port" prop="destinationPort">
                <a-input
                  :disabled="form.ServiceEdit.isPort === 'true' ? true : false"
                  size="small"
                  v-model="form.ServiceEdit.destinationPort"
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
import { ServiceAdd } from 'apis/service';
import { mapState } from 'vuex';
// import { urlCategoriesSelect } from 'apis/urlCategories';

// import Vue from 'vue';
export default {
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        deviceName: '',
        userName: '',
        ServiceEdit: {
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
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      let rule = ['name', 'Port', 'SourcePort', 'destinationPort'];
      if (this.form.ServiceEdit.isProtocol === 'true') {
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
      this.loading = true;
      this.form.ServiceEdit.orgName = this.organization;
      this.form.ServiceEdit.objectName = this.deviceName;
      this.form.ServiceEdit.objectType = this.objectType;
      console.log(this.form.ServiceEdit);
      const res = await ServiceAdd(this.form.ServiceEdit);
      if (res.message === 'Success') {
        this.visible = false;
        this.loading = false;
        this.$message.success('新增成功');
        this.$parent.getList();
      }
      console.log(res, '调用新增接口');
    },
    handleCancel() {
      this.visible = false;
      this.form.ServiceEdit = {};
      this.form.ServiceEdit.isProtocol = 'true';
      this.form.ServiceEdit.isPort = 'true';
      // this.clear();
      // this.$refs.ruleForm.resetFields();
    },
    radio(e) {
      console.log(e);
      if (e.target.value === 'Protocol') {
        this.form.ServiceEdit.ProtocolValue = '';
      } else {
        this.form.ServiceEdit.protocol = '';
      }
    },
    handleChange(e) {
      // console.log(`selected ${value}`);
      console.log(e);
      console.log(this.form.ServiceEdit.protocol);
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
    .ant-select-selection--single {
      height: 20px;
    }
  }
}
/deep/.ant-modal-title {
  font-size: 12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
</style>

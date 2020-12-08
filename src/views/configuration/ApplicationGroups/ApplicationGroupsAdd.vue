<template>
  <div>
    <a-modal
      v-model="visible"
      title="Create Custom Application Group"
      on-ok="handleOk"
      width="300px"
      v-drag
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" type="danger" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :rules="rules" :model="form.address" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="23">
              <a-form-model-item label="Name" prop="name">
                <a-input size="small" v-model="form.address.name"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="23">
              <a-form-model-item label="Description">
                <a-input size="small" v-model="form.address.description"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <AddModle
            title="Applications"
            style="width:280px;margin:10px 6px;"
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
import { GroupAdd } from 'apis/applicationGroups';
import { predefinedApp } from './PredefinedApp';
import { mapState } from 'vuex';
import AddModle from 'components/PeerFqdnAdd';

// import Vue from 'vue';
export default {
  components: {
    AddModle
  },
  data() {
    return {
      // loading: false,
      visible: false,
      form: {
        deviceName: '',
        userName: '',

        address: {
          name: '',
          description: '',
          predefinedApps: [],
          objectName: '',
          objectType: ''
        }
      },
      AppData: [],
      predefinedApp,
      // 查看需要的信息
      check: {
        name: '',
        objectName: '',
        objectType: '',
        orgName: ''
      },
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
      this.form.address.objectName = this.deviceName;
      this.form.address.objectType = this.objectType;
      const res = await GroupAdd(this.form.address);
      console.log(res);
      if (res.message === 'Success') {
        this.visible = false;
        this.$parent.tableForm();
        this.form.address = {};
        this.form.address.predefinedApps = [];
      }
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
      font-size: 12px;
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
      width: 280px;
      height: 20px;
    }
  }
}
/deep/.ant-form label {
  font-size: 12px;
}
// 两个按钮
.ant-btn-primary {
  width: 70px;
  height: 30px;
  background: #a7d054;
  border-color: unset;
}
.ant-btn-danger {
  width: 70px;
  height: 30px;
  background: #3f4a5b;
  border-color: unset;
}
</style>

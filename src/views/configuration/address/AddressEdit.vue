<template>
  <div>
    <a-modal
      v-drag
      v-model="visible"
      title="Edit Address"
      on-ok="handleOk"
      width="420px"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk" :loading="loading">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="addressEdit" :rules="rules" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name" prop="name">
                  <a-input v-model="addressEdit.name" disabled/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description">
                  <a-input v-model="addressEdit.description"/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Tags">
                  <a-select
                    mode="tags"
                    v-model="addressEdit.tags"
                    size="small"
                    :open="false"
                    style="width: 100%"
                    :token-separators="[',']"
                  ></a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Type" prop="type">
                <a-select v-model="addressEdit.type">
                  <a-select-option value="Ipv4">Ipv4</a-select-option>
                  <a-select-option value="Ipv4 Wildcard Mask">Ipv4 Wildcard Mask</a-select-option>
                  <a-select-option value="Ipv4-Range">Ipv4 Range</a-select-option>
                  <a-select-option value="Ipv6-prefix">Ipv6 Address/Prefix</a-select-option>
                  <a-select-option value="fqdn">FQDN</a-select-option>
                  <a-select-option value="dynamic-address">Dynamic Address</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item>
                <a-form-model-item :label="title" prop="value">
                  <a-input v-model="addressEdit.value"/>
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
import { addressEdit } from 'apis/address';
import { mapState } from 'vuex';

export default {
  props: ['addressEdit'],
  computed: {
    title() {
      if (this.addressEdit.type === 'Ipv4') {
        return 'IPv4 Address/Prefix';
      }
      if (this.addressEdit.type === 'Ipv4 Wildcard Mask') {
        return 'IPv4 Ipv4 Wildcard Mask';
      }
      if (this.addressEdit.type === 'Ipv4 Range') {
        return 'Ipv4 Range';
      }
      if (this.addressEdit.type === 'Ipv6-prefix') {
        return 'Ipv6 Address/Prefix';
      }
      if (this.addressEdit.type === 'fqdn') {
        return 'FQDN';
      }
      if (this.addressEdit.type === 'dynamic-address') {
        return 'Match';
      }
      return 'IPv4 Address/Prefix';
    },

    ...mapState(['organization', 'deviceName'])
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        name: '',
        description: '',
        tags: '',
        type: '',
        addressPrefix: ''
      },
      formEdit: {
        description: '',
        name: '',
        objectName: '',
        objectType: '',
        orgName: '',
        tags: [],
        type: '',
        value: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
          }
        ],
        value: [
          {
            required: true,
            message: 'Please input Activity name',
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
  methods: {
    showModalEdit() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      console.log(this.addressEdit);
      this.formEdit = this.addressEdit;
      console.log(this.formEdit.tags);
      console.log(this.addressEdit.tags);
      // this.formEdit.objectName = this.deviceName;
      // this.formEdit.orgName = this.organization;
      // this.formEdit.name = this.addressEdit.name;
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          const res = await addressEdit(this.formEdit);
          console.log(res);
          if (res.message === 'Success') {
            this.visible = false;
            this.$message.success('编辑成功');
            this.$parent.tableForm();
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
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
    height: 193px;
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
    padding: 0;
    width: 400px;
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

.footer {
  // margin-top: 14px;
  padding-top: 5px;
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }

  /deep/.ant-form-item {
    padding: 0;
    width: 196px;
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
    .ant-select-selection__rendered {
      line-height: unset;
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

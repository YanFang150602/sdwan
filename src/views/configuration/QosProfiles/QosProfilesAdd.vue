<template>
  <div>
    <a-modal
      v-drag
      v-model="visible"
      title="Add Qos Profile"
      on-ok="handleOk"
      width="526px"
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
      <a-form-model :model="form.data" ref="ruleForm" :rules="rules">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name" prop="name">
                  <a-input v-model="form.data.name" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description">
                  <a-input v-model="form.data.description" />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="main">
          <div class="subscrition">Ingress Policing</div>
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="Peak Rate(pps)">
                <a-input
                  :disabled="!!form.data.peakRateKbps"
                  v-model="form.data.peakRatePps"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Peak Rate(Kbps)">
                <a-input
                  :disabled="!!form.data.peakRatePps"
                  v-model="form.data.peakRateKbps"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Peak Burst Size(Bytes)">
                <a-input v-model="form.data.peakBurstSize" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <div class="ForWardingClass">Forwarding Class</div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                label="Forwarding Class"
                prop="forwardingClass"
              >
                <a-select v-model="form.data.forwardingClass">
                  <a-select-option value="shanghai">--Select</a-select-option>
                  <a-select-option value="fc_nc"
                    >Forwarding Class 0(Network-control)</a-select-option
                  >
                  <a-select-option value="fc1"
                    >Forwarding Class 1</a-select-option
                  >
                  <a-select-option value="fc2"
                    >Forwarding Class 2</a-select-option
                  >
                  <a-select-option value="fc3"
                    >Forwarding Class 3</a-select-option
                  >
                  <a-select-option value="fc_ef"
                    >Forwarding Class 4(Expedited-Forwarfing)</a-select-option
                  >
                  <a-select-option value="fc5"
                    >Forwarding Class 5</a-select-option
                  >
                  <a-select-option value="fc6"
                    >Forwarding Class 6</a-select-option
                  >
                  <a-select-option value="fc7"
                    >Forwarding Class 7</a-select-option
                  >
                  <a-select-option value="fc_af"
                    >Forwarding Class 8(Assured-Forwarding)</a-select-option
                  >
                  <a-select-option value="fc9"
                    >Forwarding Class 9</a-select-option
                  >
                  <a-select-option value="fc10"
                    >Forwarding Class 10</a-select-option
                  >
                  <a-select-option value="fc11"
                    >Forwarding Class 11</a-select-option
                  >
                  <a-select-option value="fc_be"
                    >Forwarding Class 12(Best-Effort)</a-select-option
                  >
                  <a-select-option value="fc13"
                    >Forwarding Class 13</a-select-option
                  >
                  <a-select-option value="fc14"
                    >Forwarding Class 14</a-select-option
                  >
                  <a-select-option value="fc15"
                    >Forwarding Class 15</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Loss Priority" prop="lossPriority">
                <a-select v-model="form.data.lossPriority">
                  <a-select-option value="shanghai">--Select--</a-select-option>
                  <a-select-option value="low">low</a-select-option>
                  <a-select-option value="high">high</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-checkbox-group v-model="form.data.checkArr">
                  <a-checkbox value="dscpRwEnable" name="type"
                    >DSCP Rewrite</a-checkbox
                  >
                  <a-checkbox value="dot1pRwEnable" name="type"
                    >Dot 1P Rewrite</a-checkbox
                  >
                </a-checkbox-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { qosProfilesAdd } from 'apis/qosProfiles';
import { mapState } from 'vuex';

export default {
  created() {
    console.log(this.$parent);
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          description: '',
          peakRatePps: '',
          peakRateKbps: '',
          peakBurstSize: '',
          forwardingClass: '',
          lossPriority: '',
          checkArr: []
        }
      },
      rules: {
        name: [
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
        ],
        lossPriority: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
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
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      if (
        this.form.data.checkArr &&
        this.form.data.checkArr.includes('dot1pRwEnable')
      )
        this.form.data.dot1pRwEnable = 'yes';
      else this.form.data.dot1pRwEnable = 'no';

      if (
        this.form.data.checkArr &&
        this.form.data.checkArr.includes('dscpRwEnable')
      )
        this.form.data.dscpRwEnable = 'yes';
      else this.form.data.dscpRwEnable = 'no';

      // this.form.data.dscpRwEnable = this.form.data.checkArr.includes(
      //   'dscpRwEnable'
      // )
      //   ? 'yes'
      //   : 'no';
      if (this.form.data.peakRatePps == '') {
        this.form.data.peakRatePps = null;
      }
      if (this.form.data.peakRateKbps == '') {
        this.form.data.peakRateKbps = null;
      }
      if (this.form.data.peakBurstSize == '') {
        this.form.data.peakBurstSize = null;
      }
      if (this.form.data.description == '') {
        this.form.data.description = null;
      }
      this.form.deviceName = this.deviceName;
      this.form.orgName = this.organization;
      delete this.form.data.checkArr;
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          // alert('submit!');
          const res = await qosProfilesAdd(this.form);
          console.log(res);
          if (res.message === 'success') {
            this.visible = false;
            this.$message.success('创建成功');
            this.$parent.tableForm();
            this.clear();
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log('error submit!!');
          // return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.clear();
      this.$refs.ruleForm.resetFields();
    },
    clear() {
      this.form.data.name = '';
      this.form.data.description = '';
      this.form.data.peakRatePps = '';
      this.form.data.peakRateKbps = '';
      this.form.data.peakBurstSize = '';
      this.form.data.peakBurstSize = '';
      this.form.data.forwardingClass = '';
      this.form.data.lossPriority = '';
      this.form.data.checkArr = [];
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
    height: 302px;
    padding: 3px;
    background-color: #36536b;
    padding-left: 3px;
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
    width: 506px;
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

.main {
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }

  /deep/.ant-form-item {
    padding: 0;
    width: 155px;
    margin-bottom: 0;
    margin-left: 4px;

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
  width: 506px;
  height: 78px;
  margin: auto;
  margin-top: 14px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding-top: 5px;
  .subscrition {
    width: 96px;
    height: 22px;
    background-color: #507691;
    border-radius: 5px;
    position: absolute;
    left: 29px;
    top: -12px;
    line-height: 21px;
    text-align: center;
    color: #fff;
    font-size: 12px;
  }
}
.footer {
  width: 506px;
  height: 78px;
  margin: auto;
  margin-top: 14px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding-top: 5px;
  /deep/.ant-checkbox-wrapper {
    color: #fff;
  }
  .ForWardingClass {
    width: 105px;
    height: 22px;
    background-color: #507691;
    border-radius: 5px;
    position: absolute;
    left: 29px;
    top: -12px;
    line-height: 21px;
    text-align: center;
    color: #fff;
    font-size: 12px;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }

  /deep/.ant-form-item {
    padding: 0;
    width: 237px;
    margin-bottom: 0;
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

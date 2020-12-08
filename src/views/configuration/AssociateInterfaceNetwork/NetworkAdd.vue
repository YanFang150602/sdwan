<template>
  <div>
    <a-modal
      v-drag
      v-model="visible"
      title="Associate Interface/Network"
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
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        @validate="validate"
      >
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-radio-group v-model="form.value" @change="onChange">
                  <a-radio :value="1">Interface</a-radio>
                  <a-radio :value="2">Network</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Name" prop="name">
                <a-select
                  v-model="form.name"
                  @mouseenter="enter('name')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-select-option
                    v-for="item in seleList"
                    :value="item"
                    :key="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Description">
                <a-input v-model="form.description" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Tags">
                <a-select
                  mode="tags"
                  style="width: 100%"
                  :token-separators="[',']"
                  @change="handleChange"
                  size="small"
                  :open="false"
                  v-model="form.tags"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="main">
          <div class="subscrition">Shaping</div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Burst Size(Bytes)">
                <a-input
                  v-model="form.burstSize"
                  :disabled="disabledList.includes('Burst Size(Bytes)')"
                  placeholder="e.g.1000-4294967295"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Rate(Kbps)">
                <a-input
                  v-model="form.Rate"
                  :disabled="disabledList.includes('Rate(Kbps)')"
                  placeholder="e.g.8-10000000"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="footer">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="DSCP Rewrite Rule">
                <a-select
                  v-model="form.dscpRewriteRule"
                  :disabled="disabledList.includes('DSCP Rewrite Rule')"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in eightRewriteRuleSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="DSCP6 Rewrite Rule">
                <a-select
                  v-model="form.dscp6RewriteRule"
                  :disabled="disabledList.includes('DSCP6 Rewrite Rule')"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in RewriteRuleSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="802.1p Rewrite Rule">
                <a-select
                  v-model="form.iee802Value"
                  :disabled="disabledList.includes('802.1p Rewrite Rule')"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in RewriteSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Scheduler Map">
                <a-select
                  v-model="form.schedulerMap"
                  :disabled="disabledList.includes('Scheduler Map')"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in schedulerMapSelect"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="Logging Interval(Secs)">
                <a-input
                  v-model="form.loggingInterval"
                  :disabled="disabledList.includes('Logging Interval(Secs)')"
                  placeholder="e.g.2-300"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Bandwidth sharing">
                <a-select
                  v-model="form.bandWidthSharing"
                  :disabled="disabledList.includes('Bandwidth sharing')"
                >
                  <a-select-option value="Off">Off</a-select-option>
                  <a-select-option value="On">On</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </div>
</template>
<script>
import {
  AssInterfaceAdd,
  AssInterfaceSelect,
  AssNetWorkSelect,
  AssInterfaceSchedulerMap,
  AssInterfaceDSCPRewriteRuleSelect,
  DSCPRewriteRule,
  AssInterfaceDSCPRewriteRule
} from 'apis/AssInterface';
import { mapState } from 'vuex';
import { select } from '@/validate/common';
import tip from '@/mixins/tip';

export default {
  mixins: [tip],
  data() {
    return {
      loading: false,
      visible: false,
      disabled: false,
      form: {
        value: 1,
        name: '',
        description: '',
        tags: [],
        BurstSize: '',
        Rate: '',
        dscpRewriteRule: '',
        dscp6RewriteRule: '',
        pRewriteRule: '',
        schedulerMap: '',
        loggingInterval: '',
        bandWidthSharing: ''
      },
      netWorkAdd: {
        deviceName: '',
        orgName: '',
        data: {
          name: '',
          description: '',
          tags: [],
          dscpRewriteRule: '',
          dscp6RewriteRule: '',
          mode: '',
          burstSize: '',
          rate: '',
          schedulerMap: '',
          loggingInterval: '',
          iee802Value: '',
          bandWidthSharing: ''
        }
      },
      InterfaceSelectAdd: [],
      NetworkSelectAdd: [],
      RewriteSelect: [],
      RewriteRuleSelect: [],
      eightRewriteRuleSelect: [],
      schedulerMapSelect: [],
      // 表单校验规则
      rules: {
        name: [{ validator: select }]
      }
    };
  },
  created() {
    console.log(this.form.value);
    this.init();
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
    ...mapState(['organization', 'deviceName']),
    seleList() {
      if (this.form.value == 1) return this.InterfaceSelectAdd;
      return this.NetworkSelectAdd;
    },
    disabledList() {
      const { name, value } = this.form;
      if (value === 1) {
        if (name === 'tvi-0/28.0' || name === 'tvi-0/29.0') {
          return [
            'Burst Size(Bytes)',
            'Rate(Kbps)',
            '802.1p Rewrite Rule',
            'Scheduler Map',
            'Logging Interval(Secs)',
            'Bandwidth sharing'
          ];
        }
        if (name === 'tunnel') {
          return [
            'Burst Size(Bytes)',
            'Rate(Kbps)',
            'Scheduler Map',
            'Logging Interval(Secs)',
            'Bandwidth sharing'
          ];
        }
        if (name === 'vni-0/0' || name === 'vni-0/2') {
          return [
            'DSCP Rewrite Rule',
            'DSCP6 Rewrite Rule',
            '802.1p Rewrite Rule'
          ];
        }
        return ['DSCP Rewrite Rule', 'DSCP6 Rewrite Rule'];
      }
      return [];
    }
  },
  watch: {
    'form.value'() {
      this.form.name = '';
    }
  },
  methods: {
    showModalAdd() {
      this.visible = true;
      this.SchedulerSelect();
      this.RewriteRule();
      this.eightRewriteRule();
      this.Rewrite();
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      const {
        name,
        description,
        tags,
        dscpRewriteRule,
        dscp6RewriteRule,
        schedulerMap,
        rate,
        loggingInterval,
        iee802Value,
        burstSize,
        bandWidthSharing
      } = this.form;

      this.netWorkAdd.data = {
        ...this.netWorkAdd.data,
        name,
        description,
        tags,
        dscpRewriteRule,
        dscp6RewriteRule,
        schedulerMap,
        rate,
        loggingInterval,
        iee802Value,
        burstSize,
        bandWidthSharing
      };

      Object.keys(this.netWorkAdd.data).forEach(key => {
        if (this.netWorkAdd.data[key] === '') this.netWorkAdd.data[key] = null;
        if (key === 'bandWidthSharing') {
          if (this.netWorkAdd.data[key] === 'On')
            this.netWorkAdd.data[key] = true;
          if (this.netWorkAdd.data[key] === 'Off')
            this.netWorkAdd.data[key] = false;
        }
      });

      if (this.form.value === 1) {
        this.netWorkAdd.data.mode = 'interface';
      } else {
        this.netWorkAdd.data.mode = 'network';
      }

      this.netWorkAdd.deviceName = this.deviceName;
      this.netWorkAdd.orgName = this.organization;
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          // alert('submit!');
          const res = await AssInterfaceAdd(this.netWorkAdd);
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
          return false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
      this.clear();
      this.$refs.ruleForm.resetFields();
    },
    // 单选框的值
    onChange(e) {
      console.log('radio checked', e.target.value);
    },
    init() {
      this.AssInterfaceSelectAdd();
      this.AssNetworkSelectAdd();
      this.SchedulerSelect();
      this.Rewrite();
      this.RewriteRule();
      this.eightRewriteRule();
    },
    async AssInterfaceSelectAdd() {
      const res = await AssInterfaceSelect(this.deviceName, this.organization);
      // console.log(res.result);
      this.InterfaceSelectAdd = res.result;
    },
    async AssNetworkSelectAdd() {
      const res = await AssNetWorkSelect(this.deviceName, this.organization);
      console.log(res.result);
      this.NetworkSelectAdd = res.result;
    },
    //下拉框Scheduler Map
    async SchedulerSelect() {
      const res = await AssInterfaceSchedulerMap(
        this.deviceName,
        this.organization
      );
      // console.log(res.result);
      this.schedulerMapSelect = res.result;
    },

    //下拉框DSCPRewriteRule
    async Rewrite() {
      const res = await AssInterfaceDSCPRewriteRule(
        this.deviceName,
        this.organization
      );
      // console.log(res.result);
      this.RewriteSelect = res.result;
    },
    //下拉框DSCP6RewriteRule
    async RewriteRule() {
      const res = await AssInterfaceDSCPRewriteRuleSelect(
        this.deviceName,
        this.organization
      );
      // console.log(res.result);
      this.RewriteRuleSelect = res.result;
    },
    //下拉框802.1pRewriteRule
    async eightRewriteRule() {
      const res = await DSCPRewriteRule(this.deviceName, this.organization);
      console.log(res.result);
      this.eightRewriteRuleSelect = res.result;
    },

    clear() {
      this.form.name = '';
      this.form.description = '';
      this.form.tags = [];
      this.form.dscpRewriteRule = '';
      this.form.BurstSize = '';
      this.form.Rate = '';
      this.form.dscp6RewriteRule = '';
      this.form.pRewriteRule = '';
      this.form.SchedulerMap = '';
      this.form.LoggingInterval = '';
      this.form.BandwidthSharing = '';
      this.form.iee802Value = '';
    },
    // tags
    handleChange(value) {
      console.log(`selected ${value}`);
      console.log(value);
      this.form.tags = value;
      console.log(this.form.tags);
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
    height: 390px;
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
    .ant-select-selection--single {
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
}

.main {
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 185px;
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
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
  width: 400px;
  height: 78px;
  margin: auto;
  margin-top: 14px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding-top: 5px;
  .subscrition {
    width: 55px;
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
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 195px;
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

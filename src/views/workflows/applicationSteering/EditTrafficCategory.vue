<template>
  <div>
    <a-modal
      v-model="visible"
      :title="titleName"
      on-ok="handleOk"
      width="865px"
      :maskClosable="false"
      v-drag
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name">
                  <a-input v-model="form.categoryName" disabled/>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Forwarding Class">
                  <a-select v-model="form.forwardingClass">
                    <a-select-option
                      :value="item.name"
                      v-for="(item, index) in forClassList"
                      :key="index.name"
                    >{{ item.lable }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Loss Priority">
                  <a-select v-model="form.lossPriority">
                    <a-select-option
                      :value="item"
                      v-for="(item, index) in transList"
                      :key="index"
                    >{{ item }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <a-checkbox-group v-model="form.defaultActions">
          <div class="main">
            <div class="traffic">Traffic Conditioning</div>
            <a-row>
              <a-col :span="8">
                <a-form-model-item>
                  <a-checkbox name="type" value="FEC" v-model="fec">FEC</a-checkbox>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item>
                  <a-checkbox name="type" value="REPLICATION" v-model="rep">Replication</a-checkbox>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="Load Balance">
                  <a-select v-model="LoadBalance">
                    <a-select-option value="PER_FLOW">Per Flow</a-select-option>
                    <a-select-option value="PER_PACKET">Per Packet</a-select-option>
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
                  <a-checkbox name="type" value="LOW_LATENCY" v-model="loLa">Low Latency</a-checkbox>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item>
                  <a-checkbox name="type" value="LOW_PACKET_LOSS" v-model="lowPaLo">Low Packet Loss</a-checkbox>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item>
                  <a-checkbox
                    name="type"
                    value="LOW_DELAY_VARIATION"
                    @change="handleChange('ldv')"
                    v-model="lowDeVa"
                  >Low Delay Variation</a-checkbox>
                </a-form-model-item>
              </a-col>
            </a-row>
            <div>
              <a-form-model-item>
                <AddModleDouble
                  :title="Priority"
                  :titleSecond="WANCircuit"
                  :listdate="wanNetworkGroups"
                  style="width:800px;"
                  ref="AddModleDoubleRef"
                  v-model="form.defaultPathPriorities"
                />
              </a-form-model-item>
            </div>
          </div>
        </a-checkbox-group>
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
  props: ['EditTraffic', 'wanNetworkGroups'],
  mixins: [tip],
  created() {
    // console.log(this.index);
  },
  components: {
    AddModleDouble
  },
  data() {
    return {
      titleName: '',
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
        categoryName: 'Real_Time',
        defaultActions: ['LOW_DELAY_VARIATION', 'LOW_LATENCY'],
        defaultPathPriorities: {},
        forwardingClass: 'fc_ef',
        lossPriority: 'low'
      },
      disabled: true,
      fec: false,
      rep: false,
      loLa: false,
      lowPaLo: false,
      lowDeVa: false,
      LoadBalance: ''
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
  watch: {
    fec(value) {
      if (value) {
        this.EditTraffic.defaultActions[0] = 'FEC';
      } else {
        this.EditTraffic.defaultActions[0] = '';
      }
    },
    rep(value) {
      if (value) {
        this.EditTraffic.defaultActions[1] = 'REPLICATION';
      } else {
        this.EditTraffic.defaultActions[1] = '';
      }
    },
    loLa(value) {
      if (value) {
        this.EditTraffic.defaultActions[3] = 'LOW_LATENCY';
      } else {
        this.EditTraffic.defaultActions[3] = '';
      }
    },
    lowPaLo(value) {
      if (value) {
        this.EditTraffic.defaultActions[4] = 'LOW_PACKET_LOSS';
      } else {
        this.EditTraffic.defaultActions[4] = '';
      }
    },
    lowDeVa(value) {
      if (value) {
        this.EditTraffic.defaultActions[5] = 'LOW_DELAY_VARIATION';
      } else {
        this.EditTraffic.defaultActions[5] = '';
      }
    }
  },
  methods: {
    showModalAdd(index, item) {
      console.log(this.wanNetworkGroups);
      this.visible = true;
      console.log(index);
      console.log(item);
      this.form = item;
      this.titleName = 'Edit Traffic Category' + '_' + item.categoryName;
      console.log(this.form.defaultActions);
      if (this.form.defaultActions.includes('FEC')) return (this.fec = true);
      if (this.form.defaultActions.includes('REPLICATION'))
        return (this.rep = true);
      if (this.form.defaultActions.includes('LOW_LATENCY'))
        return (this.loLa = true);
      if (this.form.defaultActions.includes('LOW_PACKET_LOSS'))
        return (this.lowPaLo = true);
      if (this.form.defaultActions.includes('LOW_DELAY_VARIATION'))
        return (this.lowDeVa = true);
      if (this.form.defaultActions.includes('PER_FLOW')) {
        this.LoadBalance = 'Per Flow';
      } else if (this.form.defaultActions.includes('PER_PACKET')) {
        this.LoadBalance = 'Per Packet';
      } else {
        this.LoadBalance = '';
      }

      console.log(43883643647);
      this.$nextTick(() => {
        this.$refs.AddModleDoubleRef && this.$refs.AddModleDoubleRef.init();
      });
    },
    handleOk() {
      this.visible = false;
      console.log(this.form);
      this.$emit('table', this.form);
    },
    handleCancel() {
      this.visible = false;
    },
    // handleChange(value) {
    //   console.log(`selected ${value}`);
    // },
    clear() {},
    handleChange(type, e) {
      console.log(type, e);
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
  height: 171px;
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

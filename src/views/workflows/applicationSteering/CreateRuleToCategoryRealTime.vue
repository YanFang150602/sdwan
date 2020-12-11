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
        <a-button key="submit" type="primary" @click="handleOk" :loading="loading">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form">
        <a-tabs class="tabs-wrap" type="card">
          <!-- Base -->
          <a-tab-pane key="1" tab="General">
            <div class="title">
              <a-row>
                <a-col :span="24">
                  <a-form-model-item>
                    <a-form-model-item label="Name" prop="name">
                      <a-input v-model="form.name"/>
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item>
                    <a-form-model-item label="Description">
                      <a-input v-model="form.description"/>
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <!-- source/Destination -->
          <a-tab-pane key="2" tab="source/Destination">
            <a-row type="flex" justify="space-between" align="top">
              <a-col :span="4">
                <p class="height-100">
                  <a-form-model-item style="float:left">
                    <AddModle
                      title="Source Address"
                      style="width:405px;margin-left:15px"
                      :listdate="address"
                      @subdata="val => (currentEdit.destinationAddress = val)"
                    />
                  </a-form-model-item>
                </p>
              </a-col>
              <a-col :span="4">
                <p class="height-50">
                  <a-form-model-item style="float:right">
                    <AddModle
                      title="Destination Address"
                      style="width:405px;margin-left:15px"
                      :listdate="address"
                      @subdata="val => (currentEdit.destinationAddress = val)"
                    />
                  </a-form-model-item>
                </p>
              </a-col>
            </a-row>
            <a-form-model-item style="float:left">
              <AddModle
                title="Source Zones"
                style="width:405px;margin-left:15px"
                :listdate="FZones"
                @subdata="val => subit(val, 'SourceZones')"
              />
            </a-form-model-item>
            <a-form-model-item style="float:right">
              <AddModle
                title="Destination Zones"
                style="width:405px;margin-left:15px"
                :listdate="FZones"
                @subdata="val => subit(val, 'DestinationZones')"
              />
            </a-form-model-item>
          </a-tab-pane>
          <!-- Application/URL -->
          <a-tab-pane key="3" tab="Application/URL">
            <div class="item-warp">
              <AddModle
                class="item"
                :title="item.title"
                :key="item.valKey"
                ref="addModleRef"
                v-for="item in seleArr"
                :listdate="selects[item.valKey]"
                v-model="currentEdit[item.valKey]"
              />
            </div>
          </a-tab-pane>
          <!-- Enforce -->
          <a-tab-pane key="4" tab="Enforce">
            <div class="EnforceTra">
              <div class="tracon">Traffic conditioning</div>
              <a-row type="flex" justify="space-between" align="bottom">
                <a-col :span="4">
                  <p class="height-100">
                    <a-form-model-item>
                      <a-checkbox value="1" name="type" v-model="fec">FEC</a-checkbox>
                    </a-form-model-item>
                  </p>
                </a-col>
                <a-col :span="4">
                  <p class="height-50">
                    <a-form-model-item>
                      <a-checkbox value="1" name="type" v-model="replication">Replication</a-checkbox>
                    </a-form-model-item>
                  </p>
                </a-col>
                <a-col :span="8">
                  <p class="height-120">
                    <a-form-model-item label="Load Balance">
                      <a-select v-model="LoadBalance">
                        <a-select-option value="PER_FLOW">Per Flow</a-select-option>
                        <a-select-option value="PER_PACKET">Per Packet</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </p>
                </a-col>
              </a-row>
            </div>
            <div class="CircuitSe">
              <div class="tracon">Circuit Selection Criteria</div>
              <a-row type="flex" justify="space-between" align="bottom">
                <a-col :span="4">
                  <p class="height-100">
                    <a-form-model-item>
                      <a-checkbox value="1" name="type" v-model="LowLatency">Low Latency</a-checkbox>
                    </a-form-model-item>
                  </p>
                </a-col>
                <a-col :span="4">
                  <p class="height-50">
                    <a-form-model-item>
                      <a-checkbox value="1" name="type" v-model="LowPacketLoss">Low Packet Loss</a-checkbox>
                    </a-form-model-item>
                  </p>
                </a-col>
                <a-col :span="8">
                  <p class="height-120">
                    <a-form-model-item>
                      <a-checkbox
                        value="1"
                        name="type"
                        v-model="LowDelayVariation"
                      >Low Delay Variation</a-checkbox>
                    </a-form-model-item>
                  </p>
                </a-col>
              </a-row>
              <AddModleDouble
                :listdate="wanNetworkGroups"
                style="width:806px;margin-left:15px"
                :title="Priority"
                v-model="wanNetworkGroupsRes"
                ref="addModleDoubleRef"
              ></AddModleDouble>
            </div>
          </a-tab-pane>
        </a-tabs>
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
import AddModle from 'components/Traffic/AddModle';
import AddModleDouble from 'components/TrafficDouble/AddModle';
export default {
  props: [
    'EditRuleTo',
    'EditRuleToline',
    'selects',
    'rule',
    'wanNetworkGroups'
  ],
  mixins: [tip],
  created() {},
  components: {
    AddModle,
    AddModleDouble
  },
  data() {
    return {
      fec: false,
      replication: false,
      LowLatency: false,
      LowPacketLoss: false,
      LowDelayVariation: false,
      LoadBalance: '',
      titleName: '',
      seleArr: [
        { title: 'Predefined Applications', valKey: 'preDefinedApplications' },
        { title: 'Custom Applications', valKey: 'customApplications' },
        {
          title: 'Predefined Application Filters',
          valKey: 'preDefinedFilters'
        },
        { title: 'Custom Application Filters', valKey: 'customFilters' },
        { title: 'Predefined Application Groups', valKey: 'preDefinedGroups' },
        { title: 'Custom Application Groups', valKey: 'customGroups' },
        { title: 'Predefined URL Categories', valKey: 'preDefinedCategories' },
        { title: 'Custom URL Categories', valKey: 'customCategories' },
        { title: 'Predefined Services', valKey: 'preDefinedService' },
        { title: 'Custom Services', valKey: 'customService' }
      ],
      Priority: 'Priority',
      loading: false,
      visible: false,
      //SourceZones下拉框数据
      addressSource: [],
      sourceList: [],
      predeList: [],
      cusappList: [],
      preAppGroList: [],
      CustomerList: [],
      cusSerList: [],
      allListappGroups: [],
      allListcategories: [],
      allListpredefinedApps: [],
      allListpredefinedFilters: [],
      allListservices: [],
      address: [],
      FZones: [],
      form: {
        name: '',
        description: '',
        customApplications: [],
        customCategories: [],
        customFilters: [],
        customGroups: [],
        customService: [],
        dstAddresses: [],
        dstZones: [],
        pathPriorities: {},
        preDefinedApplications: [],
        preDefinedCategories: [],
        preDefinedFilters: [],
        preDefinedGroups: [],
        preDefinedService: [],
        ruleActions: [],
        srcAddresses: [],
        srcZones: []
      },
      currentEdit: {},
      wanNetworkGroupsRes: {}
    };
  },
  watch: {
    wanNetworkGroupsRes(newVal) {
      console.log(newVal);
    }
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
    getData(val) {
      this.currentEdit = val;
      console.log(this.currentEdit);
    },
    showModalAdd(originItem) {
      this.fec = false;
      this.replication = false;
      this.LowLatency = false;
      this.LowPacketLoss = false;
      this.LowDelayVariation = false;
      this.LoadBalance = '';
      this.originItem = originItem;
      this.visible = true;
      // this.sourceList = this.EditRuleTo.sourceSelect;
      // this.predeList = this.EditRuleTo.appSelect;
      // this.cusappList = this.EditRuleTo.filterSelect;
      // this.preAppGroList = this.EditRuleTo.groupSelect;
      // this.CustomerList = this.EditRuleTo.categoriesSelect;
      // this.cusSerList = this.EditRuleTo.serSelect;
      // this.allListappGroups = this.EditRuleTo.leftSelectAll.appGroups;
      // this.allListcategories = this.EditRuleTo.leftSelectAll.urlCategoryNames;
      // this.allListpredefinedApps = this.EditRuleTo.leftSelectAll.predefinedApps;
      // this.allListpredefinedFilters = this.EditRuleTo.leftSelectAll.predefinedFilters;
      // this.allListservices = this.EditRuleTo.leftSelectAll.services;
      // this.address = this.EditRuleTo.sourceAddressSelect;
      // this.FZones = this.EditRuleTo.zones;
      // console.log(this.address);
      // console.log(this.EditRuleTo);
      // console.log(originItem);
      this.titleName =
        'Create Rule to category' + '-' + originItem.categoryName;
    },
    handleOk() {
      this.visible = false;
      this.originItem.rules.push(this.form);
      this.originItem.rules.defaultPathPriorities = this.wanNetworkGroupsRes;
      console.log(this.originItem.rules);
      this.form = {};
      console.log(this.$refs.addModleRef);
      if (Array.isArray(this.$refs.addModleRef)) {
        this.$refs.addModleRef.forEach(item => item.init());
      }
      console.log(this.$refs.addModleDoubleRef);
      this.$refs.addModleDoubleRef.init();
    },
    handleCancel() {
      this.visible = false;
      this.form = {};
    },
    clear() {},
    subit(val, type) {
      // this.$emit('customerSelect', type, val);
      this.currentEdit[type] = val;
    }
    // tab 验证切换
    // tabClick(key) {
    //   if (key === '1') {
    //     this.actKey = '1';
    //   } else if (key === '2') {
    //     this.$refs.basic.$refs.form.validate(valid => {
    //       if (valid) {
    //         this.actKey = '2';
    //       }
    //     });
    //   }
    // }
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
.item-warp {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
  .item {
    width: 400px;
    height: 100px;
    margin: 10px;
  }
}
.EnforceTra {
  position: relative;
  width: 828px;
  height: 71px;
  border: 1px solid #456880;
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-checkbox-wrapper {
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
      width: 148px;
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: unset;
    }
  }
  .tracon {
    width: 119px;
    height: 22px;
    position: absolute;
    left: 11px;
    top: -8px;
    background: #507691;
    border-radius: 4px;
    color: #fff;
  }
}
.CircuitSe {
  position: relative;
  width: 828px;
  // height: 136px;
  border: 1px solid #456880;
  margin-top: 10px;
  /deep/.ant-checkbox-wrapper {
    color: #f9f9f9;
    margin-top: 10px;
  }
  .tracon {
    width: 160px;
    height: 22px;
    position: absolute;
    left: 11px;
    top: -8px;
    background: #507691;
    border-radius: 4px;
    color: #fff;
  }
}
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
    height: 100%;
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
// 标签页的样式
/deep/ .tabs-wrap {
  padding-top: 10px;
  .ant-tabs-bar {
    border: none;
    .ant-tabs-nav-container {
      height: auto;
    }
    .ant-tabs-tab {
      background: #8d9fb3;
      border-radius: 4px 4px 0 0;
      border: none;
      color: #0f2c3e;
      padding: 2px 12px;
      line-height: 18px;
      height: auto;
    }
    .ant-tabs-tab-active {
      background: #aac0d5;
      font-weight: 400;
    }
  }
}
</style>

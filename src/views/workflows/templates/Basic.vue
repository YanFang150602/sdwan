<template>
  <a-form-model
    ref="form"
    :rules="rules"
    :model="formParam"
    layout="vertical"
    @validate="validate"
    hideRequiredMark
  >
    <a-row type="flex" justify="space-between" align="middle">
      <!-- 模板名称 -->
      <a-col>
        <a-form-model-item
          class="mandatory"
          style="width:392px"
          label="Name"
          prop="templateName"
        >
          <a-input
            :disabled="modalType === 'edt'"
            v-model="formParam.templateName"
            @mouseenter="enter('templateName')"
            @mouseleave="leave"
            @mousemove="updateXY"
          />
        </a-form-model-item>
      </a-col>
      <!-- 模板风格 -->
      <a-col>
        <a-form-model-item
          class="mandatory"
          size="small"
          style="width:392px"
          label="Type"
        >
          <a-select v-model="formParam.templateType">
            <a-select-option value="sdwan-post-staging">
              sdwan-post-staging
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <!-- 模板父级组织 -->
      <a-col
        @mouseenter="enter('orgName.name')"
        @mouseleave="leave"
        @mousemove="updateXY"
      >
        <a-form-model-item
          class="mandatory"
          style="width:392px"
          label="Organization"
          prop="orgName.name"
        >
          <a-select v-model="formParam.orgName.name">
            <a-select-option value="">
              --Select--
            </a-select-option>
            <a-select-option
              v-for="(item, index) in admNameList"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row
      style="width:750px"
      type="flex"
      justify="space-between"
      align="bottom"
      class="device-type"
    >
      <!-- device类型 -->
      <a-col>
        <a-form-model-item style="width:355px">
          <a-select default-value="SDWAN">
            <a-select-option value="SDWAN">
              SDWAN
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-radio-group v-model="formParam.deviceType" @change="deviceChange">
            <a-radio value="full-mesh">
              Full Mesh
            </a-radio>
            <a-radio value="hub">
              Hub
            </a-radio>
            <a-radio value="spoke">
              Spoke
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-col>
      <!-- spoke组列表 -->
      <a-col
        @mouseenter="enter('spokeGroup')"
        @mouseleave="leave"
        @mousemove="updateXY"
      >
        <a-form-model-item
          style="width:230px"
          label="Spoke Group"
          prop="spokeGroup"
        >
          <a-select
            :disabled="this.formParam.deviceType !== 'spoke'"
            v-model="formParam.spokeGroup"
          >
            <a-select-option selected value="">
              --Select--
            </a-select-option>
            <a-select-option
              v-for="(item, index) in spokeOptions"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
    <!-- subscription -->
    <a-row class="subscription" type="flex" justify="space-between" align="top">
      <a-col
        @mouseenter="enter('controllers')"
        @mouseleave="leave"
        @mousemove="updateXY"
      >
        <a-form-model-item
          class="mandatory"
          style="width:252px"
          label="Controllers"
          prop="controllers"
        >
          <a-select
            size="small"
            mode="multiple"
            @change="contrChange"
            placeholder="Organizations must exist"
            v-model="formParam.controllers"
          >
            <a-select-option
              v-for="(item, index) in controllerList"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col
        @mouseenter="enter('serviceBandwidth')"
        @mouseleave="leave"
        @mousemove="updateXY"
      >
        <a-form-model-item
          class="mandatory"
          style="width: 185px"
          label="Service Bandwidth"
          prop="serviceBandwidth"
        >
          <a-select
            mode="multiple"
            placeholder="Select options"
            size="small"
            v-model="formParam.serviceBandwidth"
            option-label-prop="label"
            @change="handleChange"
            maxTagPlaceholder="..."
          >
            <a-select-option :value="5" label="5 Mbps">
              5 Mbps
            </a-select-option>
            <a-select-option :value="10" label="10 Mbps">
              10 Mbps
            </a-select-option>
            <a-select-option :value="25" label="25 Mbps">
              25 Mbps
            </a-select-option>
            <a-select-option :value="50" label="50 Mbps">
              50 Mbps
            </a-select-option>
            <a-select-option :value="100" label="100 Mbps">
              100 Mbps
            </a-select-option>
            <a-select-option :value="200" label="200 Mbps">
              200 Mbps
            </a-select-option>
            <a-select-option :value="500" label="500 Mbps">
              500 Mbps
            </a-select-option>
            <a-select-option :value="1000" label="1 Gbps">
              1 Gbps
            </a-select-option>
            <a-select-option :value="5000" label="5 Gbps">
              5 Gbps
            </a-select-option>
            <a-select-option :value="10000" label="10 Gbps">
              10 Gbps
            </a-select-option>
            <a-select-option :value="20000" label="20 Gbps">
              20 Gbps
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col>
        <a-form-model-item style="width:252px" label="Aggregate Bandwidth">
          <a-input size="small" disabled :value="bandwidthNew" />
        </a-form-model-item>
        <a-row class="check-btn" type="flex" justify="start" align="middle">
          <a-col
            ><a-checkbox
              default-checked
              disabled
              v-model="formParam.isAnalyticsEnabled"
            />&nbsp;Primary</a-col
          >
          <a-col
            ><a-checkbox
              default-checked
              v-model="formParam.isPrimary"
            />&nbsp;Analytics Enabled</a-col
          >
        </a-row>
      </a-col>
    </a-row>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </a-form-model>
</template>

<script>
import { name, select, inputs } from '@/validate/common';
import tip from '@/mixins/tip';

import { spokeList, controllerWrap } from 'apis/administration';

export default {
  mixins: [tip],
  props: {
    basicData: {
      type: Object
    },
    admNameList: {
      type: Array
    },
    modalType: {
      type: String
    }
  },
  data() {
    return {
      controllerList: [], //更加组织查询的控制器
      spokeOptions: [], //根据组织查询Spoke Group
      formParam: {
        templateName: this.basicData.templateName,
        templateType: this.basicData.templateType,
        orgName: this.basicData.orgName,
        deviceType: this.basicData.deviceType,
        spokeGroup: this.basicData.spokeGroup,
        controllers: this.basicData.controllers,
        bandwidth: this.basicData.bandwidth,
        isStaging: this.basicData.isStaging,
        isPrimary: this.basicData.isPrimary,
        isAnalyticsEnabled: this.basicData.isAnalyticsEnabled,
        serviceBandwidth: this.basicData.serviceBandwidth
      },
      //表单校验
      rules: {
        templateName: [{ validator: name }],
        'orgName.name': [{ validator: select }],
        controllers: [{ validator: inputs }],
        serviceBandwidth: [{ validator: inputs }]
      }
    };
  },
  computed: {
    bandwidthNew: function() {
      if (this.formParam.bandwidth) {
        return this.formParam.bandwidth > 1000
          ? this.formParam.bandwidth / 1000 + ' Gbps'
          : this.formParam.bandwidth + 'Mbps';
      } else {
        return '';
      }
    }
  },
  created() {
    if (this.formParam.orgName.name) {
      this.getControllerSpoke();
    }
  },
  methods: {
    //控制器
    async getControllerSpoke() {
      this.controllerList = [];
      const { result } = await controllerWrap({
        organization: this.formParam.orgName.name
      });
      result['appliance-list'].forEach(item => {
        this.controllerList.push(item.name);
      });
      // spoke列表
      const spokeRes = await spokeList({
        offset: 0,
        limit: 25,
        orgname: this.formParam.orgName.name
      });
      if (spokeRes) {
        spokeRes.result.data.forEach(item => {
          this.spokeOptions.push(item.name);
        });
      }
    },
    // 设备选择
    deviceChange() {
      if (this.formParam.deviceType !== 'spoke') {
        this.formParam.spokeGroup = '';
      }
    },
    //controller 获取
    contrChange(selectedItems) {
      this.formParam.controllers = selectedItems;
    },
    // 计算带宽
    handleChange(value) {
      this.formParam.serviceBandwidth = value;
      if (value.length > 0) {
        this.formParam.bandwidth = value.reduce(function(prev, cur) {
          return parseInt(prev) + parseInt(cur);
        });
      } else {
        this.formParam.bandwidth = '';
      }
    },
    param() {
      this.$emit('basic-param', this.formParam);
    }
  },
  watch: {
    'formParam.orgName.name'(val) {
      if (val) {
        this.getControllerSpoke();
      } else {
        this.controllerList = [];
        this.spokeOptions = [];
        this.formParam.spokeGroup = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-form-explain {
  display: none !important;
}
.device-type,
.subscription {
  border: 1px solid #456880;
  padding: 20px 10px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  margin-top: 18px;
  &::before {
    position: absolute;
    content: 'Device Type ';
    background: #507691;
    border-radius: 4px;
    padding: 2px 5px;
    position: absolute;
    left: 10px;
    top: -10px;
    font-size: 12px;
    color: #fff;
  }
}
.subscription {
  width: 812px;
  padding: 12px 70px 10px 30px;
  &::before {
    content: 'Subscription';
  }
}
.check-btn .ant-col {
  color: #f9f9f9;
  font-size: 12px;
  line-height: 18px;
  margin-right: 5px;
}
</style>

<template>
  <div>
    <a-modal
      v-drag
      v-model="visible"
      title="Add Application"
      on-ok="handleOk"
      width="865px"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm" @validate="validate" :rules="rules">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Name" prop="name">
                  <a-input
                    v-model="form.name"
                    @mouseenter="enter('name')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item>
                <a-form-model-item label="Description" prop="description">
                  <a-input
                    v-model="form.description"
                    @mouseenter="enter('description')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  />
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="main">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="Precedence" prop="precedence">
                <a-input
                  v-model="form.precedence"
                  @mouseenter="enter('precedence')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="Application Apptimeout(sec)">
                <a-input v-model="form.appTimeout"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-checkbox-group v-model="form.checkArr">
                  <a-checkbox value="appMatchIps" name="type">Application match IPS</a-checkbox>
                </a-checkbox-group>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>

        <div class="ft-table">
          <!-- 分页1 -->
          <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="Attributes">
              <!-- 表格 -->
              <a-row>
                <a-col :span="24">
                  <v-table
                    is-horizontal-resize
                    class="ztable"
                    :columns="columnsLeft"
                    @on-custom-comp="getForm"
                    :title-rows="titleRowsLeft"
                    :table-data="tableDataLeft"
                    style="width:100%;"
                    isFrozen="true"
                    error-content="Temporarily no data"
                  ></v-table>
                </a-col>
              </a-row>
            </a-tab-pane>
            <!-- 分页2 -->
            <a-tab-pane key="2" tab="Match Information" force-render>
              <!-- 头部信息 -->
              <div class="list-action">
                <a-row class="table-header" type="flex" justify="space-between" align="middle">
                  <!-- 表格功能按钮 -->
                  <a-col>
                    <a-row :style="{ width: '425px' }" type="flex" justify="end" align="middle">
                      <a-col
                        @click="createItem"
                        :style="{
                          fontSize: '18px',
                          cursor: 'pointer',
                          marginRight: '20px'
                        }"
                      >
                        <a-icon type="plus"/>
                      </a-col>
                      <a-col
                        :style="{
                          fontSize: '18px',
                          cursor: 'pointer',
                          marginRight: '20px'
                        }"
                      >
                        <a-icon @click="del" type="minus"/>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </div>
              <!-- 表格 -->
              <a-row>
                <a-col :span="24">
                  <v-table
                    is-horizontal-resize
                    :columns="columns"
                    :title-rows="titleRows"
                    :table-data="tableData"
                    :height="180"
                    style="width:100%;"
                    isFrozen="true"
                    @on-custom-comp="customCompFunc"
                    :select-all="selectALL"
                    :select-change="selectChange"
                    :select-group-change="selectGroupChange"
                    error-content="Temporarily no data"
                  ></v-table>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-form-model>
    </a-modal>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >{{ formTips.tipText }}</div>
    <!-- 新增弹框 -->
    <MatchInformation ref="MatchInformationRef" @table="table"></MatchInformation>
    <!-- 查看编辑弹框 -->
    <MatchInformationEdit ref="MatchInformationEditRef" :MatchInformationEdit="this.check"></MatchInformationEdit>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import MatchInformation from './MatchInformation';
import MatchInformationEdit from './MatchInformationEdit';
import Vue from 'vue';
import { applicationAdd } from 'apis/application';
import { name } from '@/validate/common';
import tip from '@/mixins/tip';

export default {
  mixins: [tip],

  name: 'URLCategories',
  components: { MatchInformation, MatchInformationEdit },
  data() {
    return {
      visible: false,
      form: {
        objectName: '',
        objectType: '',
        orgName: '',
        name: '',
        description: '',
        precedence: '',
        appTimeout: '',
        checkArr: [],
        family: '',
        subfamily: '',
        risk: '',
        productivity: '',
        appMatchRules: [],
        securityTag: [],
        sdwanTag: [],
        generalTag: []
      },
      name: '',
      //查看的数据
      check: {},
      // 第一个表格
      tableDataLeft: [{ name: '1111', description: '222' }],
      columnsLeft: [
        {
          field: 'name',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radios'
        },
        {
          field: 'hostPattern',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radiosSub'
        },
        {
          field: 'destination',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radiosRisk'
        },
        {
          field: 'producitivity',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radiosProductivity'
        },

        {
          field: 'SourcePortValue',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radiosSecurity'
        },
        {
          field: 'low',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radiosSdwan'
        },
        {
          field: 'high',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-radiosGeneral'
        }
      ],
      titleRowsLeft: [
        [
          {
            fields: ['name'],
            title: 'Family',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['hostPattern'],
            title: 'Sub-Family',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['destination'],
            title: 'Risk',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['producitivity'],
            title: 'Producitivity',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['SourcePortValue', 'low', 'high'],
            title: 'Application Tags',
            titleAlign: 'center',
            colspan: 3
          }
        ],
        [
          {
            fields: ['SourcePortValue'],
            title: 'Security',
            titleAlign: 'left'
          },
          {
            fields: ['low'],
            title: 'SDWAN',
            titleAlign: 'left'
          },

          {
            fields: ['high'],
            title: 'General',
            titleAlign: 'left'
          }
        ]
      ],
      // 第二个表格
      tableData: [],
      columns: [
        {
          width: 36,
          field: 'checked',
          columnAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'app-qos-name'
        },

        {
          field: 'hostPattern',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'destination',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },

        {
          field: 'SourcePortValue',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'low',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'high',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },

        {
          field: 'destinationPortvalue',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'low2',
          width: 50,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'high2',
          width: 50,
          columnAlign: 'left',
          isResize: true
        }
      ],
      titleRows: [
        [
          {
            fields: ['checked'],
            title: '',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['name'],
            title: 'Name',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['hostPattern'],
            title: 'Host Pattern',
            titleAlign: 'center',
            rowspan: 2
          },
          {
            fields: ['destination'],
            title: 'Destination',
            titleAlign: 'left',
            rowspan: 2
          },
          {
            fields: ['SourcePortValue', 'low', 'high'],
            title: 'Source',
            titleAlign: 'center',
            colspan: 3
          },
          {
            fields: ['destinationPortvalue', 'low2', 'high2'],
            title: 'Destination',
            titleAlign: 'center',
            colspan: 3
          }
        ],
        [
          {
            fields: ['SourcePortValue'],
            title: 'Source Port Value',
            titleAlign: 'left'
          },
          {
            fields: ['low'],
            title: 'Low',
            titleAlign: 'left'
          },

          {
            fields: ['high'],
            title: 'High',
            titleAlign: 'left'
          },
          {
            fields: ['destinationPortvalue'],
            title: 'Destination Port value',
            titleAlign: 'left'
          },
          {
            fields: ['low2'],
            title: 'Low',
            titleAlign: 'left'
          },
          {
            fields: ['high2'],
            title: 'High',
            titleAlign: 'left'
          }
        ]
      ],
      // 表单校验规则
      rules: {
        name: [{ validator: name }],
        description: [{ validator: name }],
        precedence: [{ validator: name }]
      }
    };
  },
  created() {},
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
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
      // this.form[params] = '';
    },
    async handleOk() {
      if (this.form.checkArr && this.form.checkArr.includes('appMatchIps'))
        this.form.appMatchIps = 'true';
      else this.form.appMatchIps = 'false';
      delete this.form.checkArr;
      this.form.objectName = this.deviceName;
      this.form.objectType = this.objectType;
      this.form.orgName = this.organization;
      this.form.precedence = Number(this.form.precedence) || null;
      delete this.form.edita;
      delete this.form.editb;
      delete this.form.editc;
      delete this.form.editd;
      delete this.form.edite;
      delete this.form.editf;
      delete this.form.editg;
      if (this.tableData.length == 0) {
        this.form.appMatchRules = [];
      }
      this.form.risk = String(this.form.risk);
      this.form.productivity = String(this.form.productivity);
      this.form.appMatchRules = this.tableData;

      const res = await applicationAdd(this.form);
      console.log(res);
      if (res.message === 'Success') {
        this.visible = false;
        this.$message.success('创建成功');
        this.$parent.tableForm();
        this.form = {};
      } else {
        this.$message.error(res.message);
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      console.log(value);
    },
    clear() {},
    callback(key) {
      console.log(key);
    },
    getForm(params) {
      if (params.val) {
        console.log(this.form, params.type);
        this.form[params.type] = params.val;
      }
    },
    // 第二个表格的方法
    customCompFunc(params) {
      if (!params || !params.rowData) return;
      console.log(params, 78766676768);
      console.log(params.rowData, 78576977);
      this.check = params.rowData;
      this.$refs.MatchInformationEditRef.showModalEdit();
    },
    // 第一个表格的方法
    customCompFuncSecond(params) {
      console.log(params, 1111111111111112222222222222222222);
    },
    createItem() {
      this.$refs.MatchInformationRef.showModalAdd();
    },
    // 接收子组件传递的数据
    table(able) {
      this.tableData.push({ ...able });
      // console.log(this.tableData);
    },
    //表格的方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.name = rowData.name;
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    // 表格删除方法
    del() {
      const { name } = this;
      console.log(name);
      this.tableData = this.tableData.filter(item => {
        return item.name !== name;
      });
    }
  }
};

// import Vue from 'vue';
// 第一个表格
// 表格第一列
Vue.component('check-radios', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
    <a-radio-group class='radioWapper' v-model='current'>
    <a-radio
    v-for='(item,index) in list'
      class="radioItem"
      size="small"
     :key='item.name'
      :value='item.name'
    >{{ item.lable }}</a-radio>
    </a-radio-group>
   `,
  data() {
    return {
      list: [
        { lable: 'Business-system', name: 'business-system' },
        { lable: 'Collaboration', name: 'collaboration' },
        { lable: 'General-internet', name: 'general-internet' },
        { lable: 'Media', name: 'media' },
        { lable: 'Networking', name: 'networking' }
      ],
      current: ''
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'family', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 表格第二列
Vue.component('check-radiosSub', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
    <a-radio-group v-model='current' class='radioWapper'>
   <a-radio
      v-for='(item,index) in list'
      class='radioItem'
      size="small"
      :key='item.name'
      :value='item.name'
    >{{ item.lable }}</a-radio>

    </a-radio-group>
   `,
  data() {
    return {
      list: [
        { lable: 'Antivirus', name: 'antivirus' },
        { lable: 'Application-se', name: 'application-se' },
        { lable: 'Audio_video', name: 'audio_video' },
        { lable: 'Authentication', name: 'authentication' },
        { lable: 'Behavioral', name: 'behavioral' },
        { lable: 'Compression', name: 'compression' },
        { lable: 'Database', name: 'database' },
        { lable: 'Encrypted-tunnel', name: 'encrypted-tunnel' },
        { lable: 'Erp', name: 'erp' },
        { lable: 'File-serve', name: 'file-serve' },
        { lable: 'File-transfer', name: 'file-transfer' },
        { lable: 'Forum', name: 'forum' },
        { lable: 'Game', name: 'game' },
        { lable: 'Instant-messaging', name: 'instant-messaging' },
        { lable: 'Internet-utility', name: 'internet-utility' },
        { lable: 'Mail', name: 'mail' },
        { lable: 'Microsoft-office', name: 'microsoft-office' },
        { lable: 'Middleware', name: 'middleware' },
        { lable: 'Network-management', name: 'network-management' },
        { lable: 'Network-service', name: 'network-service' },
        { lable: 'Peer-to-peer', name: 'peer-to-peer' },
        { lable: 'Printer', name: 'printer' },
        { lable: 'Routing', name: 'routing' },
        { lable: 'Security-service', name: 'security-service' },
        { lable: 'Standard', name: 'standard' },
        { lable: 'Telephony', name: 'telephony' },
        { lable: 'Terminal', name: 'terminal' },
        { lable: 'Thin-client', name: 'thin-client' },
        { lable: 'Tunneling', name: 'tunneling' },
        { lable: 'Unknown', name: 'unknown' },
        { lable: 'Wap', name: 'wap' },
        { lable: 'Web', name: 'web' },
        { lable: 'Webmail', name: 'webmail' }
      ],
      current: ''
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'subfamily', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 表格第三列
Vue.component('check-radiosRisk', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
    <a-radio-group class='radioWapper' v-model='current'>
    <a-radio
      class="radioItem"
      size="small"
      :value='1'
    > <div style="display:inline-block;width:20px;height:20px;background:#0eba65;text-align:center">1</div></a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='2'
    >
     <div style="display:inline-block;width:20px;height:20px;background:#255bbe;text-align:center">2</div></a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='3'
    >
     <div style="display:inline-block;width:20px;height:20px;background:#c0b51a;text-align:center">3</div>
     </a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='4'
    >
    <div style="display:inline-block;width:20px;height:20px;background:#bf700a;text-align:center">4</div>
    </a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='5'
    > <div style="display:inline-block;width:20px;height:20px;background:#c02405;text-align:center">5</div>
    </a-radio>
    </a-radio-group>
   `,
  data() {
    return {
      current: ''
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'risk', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 表格第四列
Vue.component('check-radiosProductivity', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
    <a-radio-group class='radioWapper' v-model='current'>
    <a-radio
      class="radioItem"
      size="small"
      :value='1'
    > <div style="display:inline-block;width:20px;height:20px;background:#c02405;text-align:center">1</div></a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='2'
    >
     <div style="display:inline-block;width:20px;height:20px;background:#bf700a;text-align:center">2</div></a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='3'
    >
     <div style="display:inline-block;width:20px;height:20px;background:#c0b51a;text-align:center">3</div>
     </a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='4'
    >
    <div style="display:inline-block;width:20px;height:20px;background:#255bbe;text-align:center">4</div>
    </a-radio>
    <a-radio
      class="radioItem"
      size="small"
      :value='5'
    > <div style="display:inline-block;width:20px;height:20px;background:#255bbe;text-align:center">5</div>
    </a-radio>
    </a-radio-group>
   `,
  data() {
    return {
      current: ''
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'productivity', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 表格第五列
Vue.component('check-radiosSecurity', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
  <a-checkbox-group v-model="current" class='radioWapper'>
    <a-checkbox  name="type"  v-for='(item,index) in list'
      class='radioItem'
      size="small"
      :key='item.name'
      :value='item.name'>
          {{item.lable}}
        </a-checkbox>
      </a-checkbox-group>
  `,
  data() {
    return {
      list: [
        { lable: 'Anonymizer', name: 'vs_anonymizer' },
        { lable: 'Bandwidth', name: 'vs_bandwidth' },
        { lable: 'Dataleak', name: 'vs_dataleak' },
        { lable: 'Evasive', name: 'vs_evasive' },
        { lable: 'Filetransfer', name: 'vs_filetransfer' },
        { lable: 'Malware', name: 'vs_malware' },
        { lable: 'Tunnel', name: 'vs_tunnel' },
        { lable: 'Vulnerable', name: 'vs_vulnerable' }
      ],
      current: []
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'securityTag', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 表格第六列
Vue.component('check-radiosSdwan', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
  <a-checkbox-group v-model="current" class='radioWapper'>
    <a-checkbox  name="type"  v-for='(item,index) in list'
      class='radioItem'
      size="small"
      :key='item.name'
      :value='item.name'>
          {{item.name}}
        </a-checkbox>
      </a-checkbox-group>
  `,
  data() {
    return {
      list: [
        { lable: 'Audio_stream', name: 'v_audio_stream' },
        { lable: 'Av', name: 'v_av' },
        { lable: 'Business', name: 'v_business' },
        { lable: 'Cloud', name: 'v_cloud' },
        { lable: 'Data', name: 'v_data' },
        { lable: 'Ips', name: 'v_ips' },
        { lable: 'Non_business', name: 'v_non_business' },
        { lable: 'Video_stream', name: 'v_video_stream' }
      ],
      current: []
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'sdwanTag', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 表格第七列
Vue.component('check-radiosGeneral', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `
  <a-checkbox-group v-model="current" class='radioWapper'>
    <a-checkbox  name="type"  v-for='(item) in list'
      class='radioItem'
      size="small"
      :key='item.lable'
      :value='item.name'>
          {{item.lable}}
        </a-checkbox>
      </a-checkbox-group>
  `,
  data() {
    return {
      list: [
        { lable: 'Aaa', name: 'aaa' },
        { lable: 'Adult_content', name: 'adult_content' },
        { lable: 'Advertising', name: 'advertising' },
        { lable: 'Anonymizer', name: 'anonymizer' },
        { lable: 'Basic', name: 'basic' },
        { lable: 'Blog', name: 'blog' },
        { lable: 'Cdn', name: 'Cdn' },
        { lable: 'Chat', name: 'Chat' },
        { lable: 'Classified_ads', name: 'classified_ads' },
        { lable: 'Cloud_services', name: 'Cloud_services' },
        { lable: 'Db', name: 'db' },
        { lable: 'Dea_mail', name: 'dea_mail' },
        { lable: 'Ebook_reader', name: 'ebook_reader' },
        { lable: 'Email', name: 'email' },
        { lable: 'Enterprise', name: 'enterprise' },
        { lable: 'File_mngt', name: 'file_mngt' },
        { lable: 'File_transfer', name: 'file_transfer' },
        { lable: 'Forum', name: 'forum' },
        { lable: 'Gaming', name: 'gaming' },
        { lable: 'Im_mc', name: 'im_mc' },
        { lable: 'Iot', name: 'iot' },
        { lable: 'Mm_streaming', name: 'mm_streaming' },
        { lable: 'Mobile', name: 'mobile' },
        { lable: 'Networking', name: 'networking' },
        { lable: 'News_portal', name: 'news_portal' },
        { lable: 'Remote_access', name: 'remote_access' },
        { lable: 'Scada', name: 'Scada' },
        { lable: 'Social_network', name: 'social_network' },
        { lable: 'Standardized', name: 'standardized' },
        { lable: 'Transportation', name: 'transportation' },
        { lable: 'Update', name: 'tpdate' },
        { lable: 'Video_chat', name: 'video_chat' },
        { lable: 'Vpn_tun', name: 'vpn_tun' },
        { lable: 'Web', name: 'Web' },
        { lable: 'Web_ecom', name: 'Web_ecom' },
        { lable: 'Web_search', name: 'Web_search' },
        { lable: 'Web_sites', name: 'Web_sites' },
        { lable: 'Webmail', name: 'Webmail' }
      ],
      current: []
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'generalTag', val: this.current };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>
<style lang="scss">
$height: 150px;
.radioWapper {
  height: $height;
  overflow: auto;
  .radioItem {
    display: block;
  }
}
.ztable {
  height: ($height + 80px) !important;
  .v-table-rightview {
    height: fit-content !important;

    .v-table-body-class {
      height: fit-content !important;
      .v-table-row {
        // max-height: 100px;
        .v-table-body-cell {
          height: fit-content !important;
        }
      }
    }
  }
}

/deep/.v-table-title-cell .vertical-border .horizontal-border {
  display: none;
}
.ant-form-item-required {
  // &::before {
  //   display: none;
  // }
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
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}
/deep/.ant-form label {
  font-size: 12px;
}

// -----------------------
//表格字体
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
    height: 443px;
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
    width: 845px;
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
  /deep/.ant-checkbox-wrapper {
    color: #fff;
    margin-top: 20px;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 270px;
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
.ft-table {
  /deep/.ant-form-item {
    padding: 0;
    width: 186px;
    margin-bottom: 0;
    margin: auto;
    .ant-input {
      // width: 100%;
      height: 20px;
    }
  }
  .ant-tabs {
    color: #fff;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab:hover {
    color: unset;
  }
  /deep/.ant-tabs-nav .ant-tabs-tab-active {
    color: #fff;
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

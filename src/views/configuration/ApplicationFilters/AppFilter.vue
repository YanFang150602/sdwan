<template>
  <div>
    <a-modal
      v-model="visible"
      title="Create Custom Application Group"
      on-ok="handleOk"
      width="800px"
      v-drag
    >
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">Ok</a-button>
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model :rules="rules" :model="form.address" ref="ruleForm">
        <div class="title">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Name" prop="name">
                <a-input size="small" v-model="form.address.name"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="Description">
                <a-input size="small" v-model="form.address.description"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <v-table
                is-horizontal-resize
                class="ztable"
                :columns="columnsLeft"
                @on-custom-comp="getForm"
                :title-rows="titleRowsLeft"
                :table-data="tableDataLeft"
                style="width: 100%;marginTop:10px;"
                isFrozen="true"
                error-content="Temporarily no data"
              ></v-table>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { FilterAdd } from 'apis/applicationFilter';
import { mapState } from 'vuex';

import Vue from 'vue';
export default {
  components: {},
  data() {
    return {
      // loading: false,
      visible: false,
      form: {
        deviceName: '',
        userName: '',
        address: {
          objectName: '',
          objectType: '',
          name: '',
          description: '',
          family: [],
          subfamily: [],
          risk: [],
          productivity: [],
          securityTag: [],
          sdwanTag: [],
          generalTag: []
        }
      },
      AppData: [],
      AppList: [],
      rules: {
        name: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          }
        ]
      },
      // 选择框表格数据
      tableDataLeft: [{}],
      columnsLeft: [
        {
          field: 'name',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-checkbox'
        },
        {
          field: 'hostPattern',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-checkboxSub'
        },
        {
          field: 'destination',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-checkboxRisk'
        },
        {
          field: 'producitivity',
          width: 50,
          columnAlign: 'left',
          isResize: true,
          componentName: 'check-checkboxProductivity'
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
      ]
    };
  },
  computed: {
    ...mapState(['organization', 'objectType', 'deviceName'])
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
    async handleOk() {
      console.log('调用新增接口');
      this.form.address.orgName = this.organization;
      this.form.address.objectType = this.objectType;
      this.form.address.objectName = this.deviceName;
      const res = await FilterAdd(this.form.address);
      console.log(res);
      if (res.message === 'Success') {
        this.visible = false;
        this.$message.success('创建成功');
        this.$parent.tableForm();
      }
      console.log(this.form.address);
    },
    getForm(params) {
      console.log(params);
      if (params.val) {
        console.log(this.form, params.type);
        this.form.address[params.type] = params.val;
      }
    },
    handleCancel() {
      this.visible = false;
      // this.clear();
      // this.$refs.ruleForm.resetFields();
    },
    // 获取Applications数据
    ApplicationsData(data) {
      console.log(data);
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
// 新增里的表格
// 表格第一列
Vue.component('check-checkbox', {
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
    <a-checkbox-group class='radioWapper' v-model='current'>
    <a-checkbox
    v-for='(item,index) in list'
      class="radioItem"
      size="small"
     :key='item.name'
      :value='item.name'
    >{{ item.lable }}</a-checkbox>
    </a-checkbox-group>
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
      current: []
    };
  },
  watch: {
    current(newVal) {
      console.log(newVal);
      let params = { type: 'family', val: this.current };
      this.$emit('on-custom-comp', params);
    },

    'rowData.family': {
      immediate: true,
      handler(newVal) {
        if (newVal === this.current) return;
        this.current = newVal;
      }
    }
  }
});
// 表格第二列
Vue.component('check-checkboxSub', {
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
    <a-checkbox-group v-model='current' class='radioWapper'>
   <a-checkbox
      v-for='(item,index) in list'
      class='radioItem'
      size="small"
      :key='item.name'
      :value='item.name'
    >{{ item.lable }}</a-checkbox>

    </a-checkbox-group>
   `,
  data() {
    return {
      list: [
        { lable: 'Antivirus', name: 'antivirus' },
        { lable: 'Application-service', name: 'application-service' },
        { lable: 'Audio_video', name: 'audio_video' },
        { lable: 'Authentication', name: 'authentication' },
        { lable: 'Behavioral', name: 'behavioral' },
        { lable: 'Compression', name: 'compression' },
        { lable: 'Database', name: 'database' },
        { lable: 'Encrypted-tunnel', name: 'encrypted-tunnel' },
        { lable: 'Erp', name: 'erp' },
        { lable: 'File-server', name: 'file-server' },
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
      current: []
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
Vue.component('check-checkboxRisk', {
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
    <a-checkbox-group class='radioWapper' v-model='current'>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='1'
    > 
    <div style="display:inline-block;width:25px;height:20px;background:#0eba65;text-align:center">260</div></a-radio>
    </a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='2'
    >
     <div style="display:inline-block;width:25px;height:20px;background:#255bbe;text-align:center">990</div></a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='3'
    >
     <div style="display:inline-block;width:32px;height:20px;background:#c0b51a;text-align:center">1890</div>
     </a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='4'
    >
    <div style="display:inline-block;width:25px;height:20px;background:#bf700a;text-align:center">143</div>
    </a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='5'
    > <div style="display:inline-block;width:25px;height:20px;background:#c02405;text-align:center">167</div>
    </a-checkbox>
    </a-checkbox-group>
   `,
  data() {
    return {
      current: []
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
Vue.component('check-checkboxProductivity', {
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
    <a-checkbox-group class='radioWapper' v-model='current'>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='1'
    > 
    <div style="display:inline-block;width:25px;height:20px;background:#c02405;text-align:center">251</div></a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='2'
    >
     <div style="display:inline-block;width:25px;height:20px;background:#bf700a;text-align:center">796</div></a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='3'
    >
     <div style="display:inline-block;width:32px;height:20px;background:#c0b51a;text-align:center">2223</div>
     </a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='4'
    >
    <div style="display:inline-block;width:25px;height:20px;background:#255bbe;text-align:center">142</div>
    </a-checkbox>
    <a-checkbox
      class="radioItem"
      size="small"
      :value='5'
    > <div style="display:inline-block;width:25px;height:20px;background:#255bbe;text-align:center">38</div>
    </a-checkbox>
    </a-checkbox-group>
   `,
  data() {
    return {
      current: []
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
        { lable: 'Misused', name: 'vs_misused' },
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
        { lable: 'Analytics', name: 'analytics' },
        { lable: 'Anonymizer', name: 'anonymizer' },
        { lable: 'Basic', name: 'basic' },
        { lable: 'Blog', name: 'blog' },
        { lable: 'Cdn', name: 'cdn' },
        { lable: 'Chat', name: 'chat' },
        { lable: 'Classified_ads', name: 'classified_ads' },
        { lable: 'Cloud_services', name: 'cloud_services' },
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
        { lable: 'P2p', name: 'p2p' },
        { lable: 'Remote_access', name: 'remote_access' },
        { lable: 'Scada', name: 'scada' },
        { lable: 'Social_network', name: 'social_network' },
        { lable: 'Standardized', name: 'standardized' },
        { lable: 'Transportation', name: 'transportation' },
        { lable: 'Update', name: 'update' },
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
<style lang='scss'>
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
</style>

<style lang="scss" scoped>
/deep/.ant-form label {
  font-size: 12px;
}
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
    height: 417px;
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
  }
}
// 多选框的样式
/deep/.ant-checkbox-group-item span {
  color: #fff;
}
/deep/.ant-checkbox-wrapper {
  margin-left: 0px;
}
$height: 150px;
.radioWapper {
  height: $height;
  overflow: auto;
  .radioItem {
    display: block;
  }
}
</style>

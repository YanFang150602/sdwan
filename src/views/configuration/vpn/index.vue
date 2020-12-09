<template>
  <div class="vpn-cfg-file">
    <!-- 搜索框 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showAddWinModal"
      @delete-item="showDelWinModal"
      @search="search"
      @cancelSearch="cancelSearch"
    />
    <!-- 列表 -->
    <!-- 表单主体内容 -->
    <div class="tablescroll">
      <v-table
        is-horizontal-resize
        column-width-drag
        :columns="columns"
        :table-data="tableDataList"
        :select-all="selectALL"
        :select-change="selectChange"
        style="width:100%;"
        @on-custom-comp="customTableFunc"
        error-content="Temporarily no data"
      ></v-table>
    </div>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="delWinVisible"
        title="Confirm Decommission"
        width="430px"
        class="delete"
      >
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="delLoading"
            @click="delOK"
            >OK</a-button
          >
          <a-button key="back" type="danger" @click="delCancel"
            >Cancel</a-button
          >
        </template>
        <p>Are you sure you want to delete the selected record(s)?</p>
      </a-modal>
      <a-modal
        v-model="addOrEditWinVisible"
        :title="title"
        :destroyOnClose="true"
        width="940px"
      >
        <VPNProfileAddOrEdit
          ref="vpnProfileAddOrEditRef"
          :vpnProfile="curEditVPNProfile"
          @passChildContent="passChildContent"
        ></VPNProfileAddOrEdit>
        <template slot="footer">
          <a-button
            key="submit"
            type="primary"
            :loading="addOrEditLoading"
            @click="addOrEditOK"
            >OK</a-button
          >
          <a-button key="back" @click="addOrEditCancel">Cancel</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Pagination from 'components/Pagination';
import VPNProfileAddOrEdit from './VPNProfileAddOrEdit';
import {
  VPNProfileQuery,
  VPNProfileCreate,
  VPNProfileModify,
  VPNProfileDelete
} from 'apis/Configuration';
export default {
  name: 'VPNProfile',
  components: {
    VPNProfileAddOrEdit,
    Pagination
  },
  data() {
    return {
      keywords: '',
      columns: [
        {
          field: 'custome',
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'VPN Profile',
          width: 120,
          columnAlign: 'left',
          isResize: true,
          componentName: 'vpncfgfile-opration'
        },
        {
          field: 'vpnType',
          title: 'VPN Type',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'local-aih',
          title: 'Local IP/Interface/Hostname',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peer-ifh',
          title: 'Peer IP/FQDN/Hostname',
          width: 160,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'localAuthInfo-authType',
          title: 'Local Auth Info - Auth Type',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'localAuthInfo-authInfo',
          title: 'Local Auth Info - Auth Info',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peerAuthInfo-authType',
          title: 'Peer Auth Info - Auth Type',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'peerAuthInfo-authInfo',
          title: 'Peer Auth Info - Auth Info',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'pskAuthClients',
          title: 'Peer Auth Info - Psk Auth Clients',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'rules',
          title: 'Rules',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'routing-instance',
          title: 'Routing Instance',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'tunnel-interface',
          title: 'Tunnel Interface',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'tunnel-initiate',
          title: 'Tunnel Initiate',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-fragmentation',
          title: 'IPSec Fragmentation',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-forceNatT',
          title: 'IP Sec - Force NAT-T Configuration',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-algorithm',
          title: 'IP Sec - Encryption and Hashing Algorithm',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-mode',
          title: 'IPSec Mode',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-pfsGroup',
          title: 'IP Sec - Forward Secrecy Mode',
          width: 220,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ipsec-antiReplay',
          title: 'IP Sec - Anti Replay',
          width: 100,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ike-version',
          title: 'IKE - IKE Version',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ike-mode',
          title: 'IKE - DH Mode',
          width: 80,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'ike-algorithm',
          title: 'IKE - Encryption and Hashing Algorithm',
          width: 220,
          columnAlign: 'left',
          isResize: true
        }
      ],
      titleRows: [
        [
          {
            fields: ['custome'],
            titleAlign: 'center',
            type: 'selection',
            rowspan: 2
          },
          {
            field: 'name',
            title: 'VPN Profile',
            componentName: 'vpncfgfile-opration',
            rowspan: 2
          },
          {
            field: 'vpnType',
            title: 'VPN Type',
            isResize: true,
            rowspan: 2
          },
          {
            field: 'local-ip-interface-host',
            title: 'Local IP/Interface/Hostname',
            isResize: true,
            rowspan: 2
          },
          {
            field: 'peer-ip-fqdn-host',
            title: 'Peer IP/FQDN/Hostname',
            isResize: true,
            rowspan: 2
          },
          {
            fields: ['local-auth-type', 'local-auth-info'],
            title: 'Local Auth Info',
            titleAlign: 'center',
            colspan: 2
          },
          {
            fields: ['peer-auth-type', 'peer-auth-type', 'peer-psk-auth'],
            title: 'Peer Auth Info',
            titleAlign: 'center',
            colspan: 3
          },
          {
            fields: [
              'ipsec-frag',
              'ipsec-nat',
              'ipsec-algorithm',
              'ipsec-mode',
              'ipsec-forward',
              'ipsec-replay'
            ],
            title: 'IPSec',
            titleAlign: 'center',
            colspan: 6
          },
          {
            fields: ['ike-version', 'ike-mode', 'ike-algorithm'],
            title: 'IKE',
            titleAlign: 'center',
            colspan: 3
          }
        ],
        [
          {
            field: 'local-auth-type',
            title: 'Auth Type'
          },
          {
            field: 'local-auth-info',
            title: 'Auth Info'
          },
          {
            field: 'peer-auth-type',
            title: 'Auth Type'
          },
          {
            field: 'peer-auth-type',
            title: 'Auth Info'
          },
          {
            field: 'peer-psk-auth',
            title: 'Psk Auth Clients'
          },
          {
            field: 'ipsec-frag',
            title: 'IP Sec Fragmentation'
          },
          {
            field: 'ipsec-nat',
            title: 'Force NAT-T Configuration'
          },
          {
            field: 'ipsec-algorithm',
            title: 'Encryption and Hashing Algorithm'
          },
          {
            field: 'ipsec-mode',
            title: 'Mode'
          },
          {
            field: 'ipsec-forward',
            title: 'Forward Secrecy Mode'
          },
          {
            field: 'ipsec-replay',
            title: 'Anti Replay'
          },
          {
            field: 'ike-version',
            title: 'IKE Version'
          },
          {
            field: 'ike-mode',
            title: 'DH Mode'
          },
          {
            field: 'ike-algorithm',
            title: 'Encryption and Hashing Algorithm'
          }
        ]
      ],
      tableDataList: [],
      totalCount: 0,
      pageIndex: 1,
      pageSize: 20,
      title: '',
      addOrEditWinVisible: false,
      addOrEditLoading: false,
      delWinVisible: false,
      delLoading: false,
      curEditVPNProfile: {},
      curAddVPNProfile: {},
      delVPNProfileList: {
        deviceName: '',
        orgName: '',
        profileNames: []
      },
      vpnProfile: {}
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  mounted() {
    this.queryTableDataList();
  },
  methods: {
    // 表格操作Table start
    search(data) {
      const keyword = data.trim().toLowerCase();
      const list = this.tableDataList.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.tableDataList = list;
    },
    cancelSearch() {
      this.queryTableDataList();
    },
    customTableFunc(params) {
      for (let i = 0; i < this.allVPNProfileList.length; i++) {
        if (this.allVPNProfileList[i].name === params.rowData.name) {
          this.curEditVPNProfile = this.allVPNProfileList[i];
          break;
        }
      }
      this.removeNullProperty(this.curEditVPNProfile);
      this.operType = 'edit';
      this.curEditVPNProfile.tempDisabledName = true;
      this.title = 'Edit IPsec VPN';
      this.addOrEditWinVisible = true;
    },
    selectALL(selection) {
      this.delVPNProfileList.profileNames = [];
      for (let row of selection) {
        this.delVPNProfileList.profileNames.push(row.name);
      }
    },
    selectChange(selection) {
      this.delVPNProfileList.profileNames = [];
      for (let row of selection) {
        this.delVPNProfileList.profileNames.push(row.name);
      }
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async queryTableDataList() {
      const res = await VPNProfileQuery({
        orgName: this.organization,
        deviceName: this.deviceName,
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      if (res.message === 'Success') {
        this.allVPNProfileList = res.result.vpnProfile;
        this.tableDataList = [];
        this.allVPNProfileList.forEach(item => {
          let vpnProFile = {};
          this.forVPNProfileProperties(item, vpnProFile);
          this.forVPNProfileProperties(item.local, vpnProFile, 'local');
          this.forVPNProfileProperties(item.peer, vpnProFile, 'peer');
          this.forVPNProfileProperties(item.ike, vpnProFile, 'ike');
          this.forVPNProfileProperties(item.ipsec, vpnProFile, 'ipsec');
          this.forVPNProfileProperties(
            item.localAuthInfo,
            vpnProFile,
            'localAuthInfo'
          );
          this.forVPNProfileProperties(
            item.peerAuthInfo,
            vpnProFile,
            'peerAuthInfo'
          );
          this.tableDataList.push(vpnProFile);
        });
        this.totalCount = Number(res.result.totalCount);
      } else {
        this.tableDataList = [];
        this.totalCount = 0;
      }
    },
    forVPNProfileProperties(item, vpnProFile, curKey) {
      let fieldValues = [];
      let field = '';
      for (let key in item) {
        if (Object.prototype.toString.call(item[key]) != '[object Object]') {
          if (curKey === 'ike') {
            vpnProFile[curKey + '-' + key] = item[key];
          } else if (curKey === 'ipsec') {
            vpnProFile[curKey + '-' + key] = item[key];
          } else if (curKey === 'local') {
            field = 'local-aih';
            item[key] ? fieldValues.push(key + '=' + item[key]) : '';
          } else if (curKey === 'peer') {
            field = 'peer-ifh';
            item[key] ? fieldValues.push(key + '=' + item[key]) : '';
          } else if (curKey === 'localAuthInfo') {
            if (key === 'authType') {
              vpnProFile[curKey + '-' + key] = item[key];
            } else {
              field = 'localAuthInfo-authInfo';
              item[key] ? fieldValues.push(key + '=' + item[key]) : '';
            }
          } else if (curKey === 'peerAuthInfo') {
            if (key === 'authType') {
              vpnProFile[curKey + '-' + key] = item[key];
            } else {
              field = 'peerAuthInfo-authInfo';
              item[key] ? fieldValues.push(key + '=' + item[key]) : '';
            }
          } else {
            vpnProFile[key] = item[key];
          }
        }
      }
      field ? (vpnProFile[field] = fieldValues.join('\n')) : '';
    },
    // 表格操作Table end
    // 分页操作Page start
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.queryTableDataList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.queryTableDataList();
    },
    // 分页操作Page end
    // VPN Config file Add start
    showAddWinModal() {
      this.operType = 'add';
      this.curEditVPNProfile = {};
      this.title = 'Add IPsec VPN';
      this.addOrEditWinVisible = true;
    },
    async addOrEditOK() {
      let isOK = this.satisfyValidation();
      if (isOK) {
        this.$refs.vpnProfileAddOrEditRef.getData();
        console.log('ending....', this.curAddVPNProfile);
        this.addOrEditLoading = true;
        let params = { vpnProfile: this.vpnProfile };
        let curVPNProfile = {};
        for (let key in this.curAddVPNProfile) {
          if (!(key.indexOf('temp') == 0)) {
            curVPNProfile[key] = this.curAddVPNProfile[key];
          }
        }
        curVPNProfile.orgName = this.organization;
        curVPNProfile.deviceName = this.deviceName;
        Object.assign(this.vpnProfile, curVPNProfile);
        this.removeNullProperty(this.vpnProfile);

        let res = {};
        if (this.operType === 'add') {
          res = await VPNProfileCreate(params);
        } else {
          res = await VPNProfileModify(params);
        }
        this.addOrEditLoading = false;
        if (res.message === 'Success') {
          this.addOrEditWinVisible = false;
          this.queryTableDataList();
        } else {
          this.$message.error(res.message);
        }
      }
    },
    removeNullProperty(obj) {
      for (let key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          this.removeNullProperty(obj[key]);
        } else {
          if (
            obj[key] === '' ||
            (obj[key] && obj[key].length === 0) ||
            obj[key] == null
          ) {
            delete obj[key];
          }
        }
      }
    },
    addOrEditCancel() {
      this.addOrEditLoading = false;
      this.addOrEditWinVisible = false;
      this.curAddVPNProfile = {};
      this.curEditVPNProfile = {};
      this.queryTableDataList();
    },
    passChildContent(vpnProfile) {
      this.curAddVPNProfile = vpnProfile;
      console.log('passChildContent : ', this.curAddVPNProfile);
    },
    satisfyValidation() {
      let isOK = true;
      this.$refs.vpnProfileAddOrEditRef.$refs && this.$refs.vpnProfileAddOrEditRef.$refs.normalRef.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      this.$refs.vpnProfileAddOrEditRef.$refs.ikeRef && this.$refs.vpnProfileAddOrEditRef.$refs.ikeRef.$refs.localAuthRef.validate(
        valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        }
      );
      this.$refs.vpnProfileAddOrEditRef.$refs.ikeRef && this.$refs.vpnProfileAddOrEditRef.$refs.ikeRef.$refs.peerAuthRef.validate(
        valid => {
          if (!valid) {
            isOK = false;
            return false;
          }
        }
      );
      return isOK;
    },
    // VPN Config file Add end
    // VPN Config file Delete start
    showDelWinModal() {
      this.delWinVisible = true;
    },
    async delOK() {
      // coding
      this.delVPNProfileList.orgName = this.organization;
      this.delVPNProfileList.deviceName = this.deviceName;
      const res = await VPNProfileDelete(this.delVPNProfileList);
      if (res.message === 'Success') {
        this.delWinVisible = false;
        this.pageIndex = 1;
        this.queryTableDataList();
        this.$message.success('删除成功');
      } else {
        this.$message.error(res.message);
      }
    },
    delCancel() {
      this.delWinVisible = false;
    }
    // VPN Config file Delete end
  }
};
Vue.component('vpncfgfile-opration', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.name }}</a>
    </span>`,
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
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>
<style lang="scss" scoped>
.vpn-cfg-file {
  height: 100%;
  overflow: hidden;
  min-height: 503px;
  .list-action {
    line-height: 18px;
    color: #0f2c3e;
    font-size: 12px;
    margin-bottom: 10px;
    .table-header {
      margin-bottom: 10px;
      height: 22px;
    }
  }
  /deep/.search-bar {
    .ant-input {
      width: 700px;
      color: #6a6f75;
      border: 1px solid #b0c7d5;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 18px;
      &:focus {
        box-shadow: none;
        border-color: #b0c7d5;
      }
    }
  }
}
/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
  }
}
.tablescroll {
  /deep/.v-table-rightview .v-table-body,
  .v-table-rightview .v-table-footer {
    overflow-x: auto !important;
    overflow-y: auto;
  }
}
.delete {
  /deep/.ant-modal-content {
    max-height: 325px;
    .ant-modal-header {
      height: 36px;
      background-color: #e9f4fc;
      .ant-modal-title {
        line-height: 8px;
      }
    }
    .ant-modal-body {
      padding: 3px;
      background-color: #ffffff;
      height: 100px;
      p {
        margin-left: 20px;
        margin-top: 20px;
      }
    }
    .ant-modal-footer {
      background-color: #e9f4fc;
      height: 50px;
    }
  }
  /deep/.ant-modal-title {
    font-size: 12px;
    margin-left: -12px;
  }
  /deep/.ant-modal-close-x {
    line-height: 36px;
    width: 40px;
  }

  // 按钮
  /deep/.ant-btn-primary {
    width: 70px;
    height: 30px;
    background-color: #a7d054;
    border: none;
  }
  /deep/.ant-btn-danger {
    width: 70px;
    height: 30px;
    background-color: #3f4a5b;
    border: none;
    color: #ffffff;
  }
}
</style>

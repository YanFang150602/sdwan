<template>
  <div class="spokeGroups main-con">
    <!-- 搜索框 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="showModal"
      @delete-item="groupDel"
      @search="search"
      @cancelSearch="cancelSearch"
    />
    <!-- 列表 -->
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="TunnelColumns"
      :table-data="tableData"
      :select-change="delItem"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 修改 -->
    <a-modal
      v-drag
      v-model="visible"
      :title="modalTitle"
      @ok="handleOk()"
      :width="865"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :confirm-loading="Loading"
      :afterClose="cleanData"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :layout="layout"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        @validate="validate"
      >
        <div>
          <a-form-model-item
            class="mandatory"
            prop="slot"
            ref="slot"
            label="Name"
          >
            <a-input
              size="small"
              style="width:50px; color: #0f2c3e"
              :disabled="nameDisabled"
              defaultValue="tvi"
            />
            <span style="color: #fff;margin: 0px 5px;">-</span>
            <a-input
              :disabled="otherDisabled"
              size="small"
              style="width:50px;"
              @mouseenter="enter('slot')"
              @mouseleave="leave"
              @mousemove="updateXY"
              @blur="
                () => {
                  $refs.slot.onFieldBlur();
                }
              "
              @change="
                () => {
                  $refs.slot.onFieldChange();
                }
              "
              v-model="form.slot"
            />
            <span style="color: #fff;marginLeft:5px;">/</span>
          </a-form-model-item>
          <a-form-model-item prop="port" ref="port">
            <a-input
              :disabled="otherDisabled"
              class="port"
              size="small"
              @mouseenter="enter('port')"
              @mouseleave="leave"
              @mousemove="updateXY"
              @blur="
                () => {
                  $refs.port.onFieldBlur();
                }
              "
              @change="
                () => {
                  $refs.port.onFieldChange();
                }
              "
              v-model="form.port"
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="name" label="Description">
            <a-input
              size="small"
              style="width:845px; color: #0f2c3e"
              v-model="form.description"
            />
          </a-form-model-item>
          <div class="right">
            <a-checkbox
              style="color: #fff; marginTop: 12px"
              v-model="form.enable"
              >Enable</a-checkbox
            >
          </div>
          <div class="mtu">
            <a-form-model-item label="MTU">
              <a-input
                size="small"
                style="width:245px; color: #0f2c3e"
                v-model="form.mtu"
              />
            </a-form-model-item>
            <a-form-model-item label="Mode">
              <a-select style="width:245px" v-model="form.mode">
                <a-select-option value="ipsec">Ipsec</a-select-option>
                <a-select-option value="redundaycy">Redundaycy</a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="tunneltype">
            <a-form-model-item ref="name" label="Tunnel Type">
              <a-select
                style="width:245px"
                v-model="form.type"
                @change="tunneltypeChange"
              >
                <a-select-option value="p2mp-gre"
                  >Point-to-multi-point GRE tunnel</a-select-option
                >
                <a-select-option value="p2mp-esp"
                  >Point-to-multi-point IPsec tunnel</a-select-option
                >
                <a-select-option value="p2mp-vxlan"
                  >Point-to-multi-point VXLAN tunnel</a-select-option
                >
                <a-select-option value="p2mp-secure"
                  >Point-to-multi-point secure SDWAN tunnel</a-select-option
                >
                <a-select-option value="p2mp-cleartext"
                  >Point-to-multi-point clear-text SDWAN tunnel</a-select-option
                >
                <a-select-option value="ipsec"
                  >Point-to-point IPsec tunnel</a-select-option
                >
                <a-select-option value="gre"
                  >Point-to-point GRE tunnel</a-select-option
                >
                <a-select-option value="eogre"
                  >Ethernet Over GRE</a-select-option
                >
                <a-select-option value="v6gre"
                  >Point-to-point V6 GRE tunnel</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item v-if="transportFlag" label="Transport Type">
              <a-select style="width:245px" v-model="form.transportType">
                <a-select-option value="esp">ESP Tunnel</a-select-option>
                <a-select-option value="vxlan">VXLAN Tunnel</a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="source" v-if="sourceFlag">
            <a-form-model-item class="mandatory" prop="source" label="Source">
              <a-input
                size="small"
                style="width:245px; color: #0f2c3e"
                @mouseenter="enter('source')"
                @mouseleave="leave"
                @mousemove="updateXY"
                v-model="form.source"
              />
            </a-form-model-item>
            <a-form-model-item
              class="mandatory"
              prop="destination"
              label="Destination"
            >
              <a-input
                size="small"
                style="width:245px; color: #0f2c3e"
                @mouseenter="enter('destination')"
                @mouseleave="leave"
                @mousemove="updateXY"
                v-model="form.destination"
              />
            </a-form-model-item>
          </div>
          <a-form-model-item
            class="mandatory"
            prop="routingInstance"
            v-if="sourceFlag"
            label="Routing Instance"
          >
            <a-select
              style="width:245px"
              @mouseenter="enter('routingInstance')"
              @mouseleave="leave"
              @mousemove="updateXY"
              v-model="form.routingInstance"
            >
              <a-select-option
                v-for="(item, index) in routingData"
                :key="index"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <div class="addtable">
            <div class="addtitle">Sub-interfaces</div>
            <v-table
              is-horizontal-resize
              is-vertical-resize
              column-width-drag
              :columns="TunnelAddColumns"
              :table-data="addtableData"
              :select-change="delItem"
              style="width:100%;marginTop:20px"
              isFrozen="true"
              @on-custom-comp="addModifyItem"
            ></v-table>
          </div>
        </div>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="ipVisible"
      title="Edit Sub-interface"
      @ok="changeipOk"
      :width="526"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
    >
      <a-form-model
        ref="addruleForm"
        :model="Subinterfaces"
        :layout="layout"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="Unit">
          <a-input
            size="small"
            style="width:245px; color: #0f2c3e"
            v-model="Subinterfaces.unit"
          />
        </a-form-model-item>
        <div class="vlan">
          <a-form-model-item label="VLAN ID">
            <a-input
              size="small"
              :disabled="nameDisabled"
              style="width:245px; color: #0f2c3e"
              v-model="Subinterfaces.vlan"
            />
          </a-form-model-item>
          <a-checkbox
            style="color: #fff; marginTop: 12px"
            @change="SubinterfacesChange"
            >Enable</a-checkbox
          >
        </div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="IPv4">
            <AddModle
              title="IP Address/Mask"
              style="width:250px;"
              @subdata="getipfourData"
              :listdate="ipfourList"
              :list="Subinterfaces.ipfour"
              :inputType="ipv"
              :input="true"
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="IPv6" force-render>
            <AddModle
              title="IPv6 Address/Mask"
              style="width:250px;"
              @subdata="getipsixData"
              :listdate="ipsixList"
              :inputType="ipvSix"
              :input="true"
            />
          </a-tab-pane>
        </a-tabs>
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
import Pagination from 'components/Pagination';
import {
  tunnelList,
  TunnelData,
  changeTunnel,
  addTunnel,
  deleteTunnel,
  routingData
} from 'apis/interfaces';
import { mapState } from 'vuex';
import AddModle from 'components/PeerFqdnAdd';
import common from '@/mixins/common';
import { TunnelColumns, TunnelAddColumns } from './table';

export default {
  components: {
    Pagination,
    AddModle
  },
  mixins: [common],
  data() {
    return {
      pageSize: 20,
      pageIndex: 1,
      totalCount: 100,
      Loading: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      tableData: [],
      seleteName: '', // 选择中的名字
      addtableData: [], // 新增模态框表格数据
      TunnelColumns,
      TunnelAddColumns,
      routingData: [], // 新增routing的数据
      visible: false,
      ipVisible: false, // 新增时ipv4和ipv6弹出框
      changeFlag: false,
      addVisible: false,
      ModifyData: {}, // 点击新增模态框表格的第一条数据
      ipfourList: [], // ipv4的数据
      ipsixList: [], // ipv6的数据
      modalTitle: '',
      ipv: 'ipv4',
      ipvSix: 'ipv6',
      layout: 'vertical',
      nameDisabled: false,
      sourceFlag: false, // 控制source是否隐藏
      transportFlag: false, // 控制transport是否隐藏
      form: {
        name: '',
        slot: '',
        port: '',
        description: '',
        mtu: '1400',
        mode: 'ipsec',
        type: 'ipsec',
        source: '',
        destination: '',
        routingInstance: '',
        transportType: '',
        enable: false,
        unitList: []
      },
      // 修改Subinterfaces的数据
      Subinterfaces: {
        unit: '',
        vlan: '',
        enable: false,
        ipfour: [],
        ipsix: []
      },
      ipRule: false,
      rules: {
        slot: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          },
          {
            pattern: '^([0-9]|(1[0-5]))$',
            message: 'Value must be between 0 to 15',
            trigger: 'blur'
          }
        ],
        port: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          },
          {
            pattern: /^1[0-9]{0,4}$|^0$|^[1-9]\d{0,3}$/,
            message: 'Value must be between 0 to 19999',
            trigger: 'blur'
          }
        ],
        source: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          },
          {
            pattern:
              '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4}){1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$',
            message: 'Invalid Ip address',
            trigger: 'blur'
          }
        ],
        destination: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          },
          {
            pattern:
              '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4}){1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$',
            message: 'Invalid Ip address',
            trigger: 'blur'
          }
        ],
        routingInstance: [
          {
            required: true,
            message: 'Field required',
            trigger: 'blur'
          }
        ]
      },
      otherDisabled: false
    };
  },
  computed: {
    ...mapState(['deviceName'])
  },
  created() {
    console.log(123);
    this.getList();
  },
  methods: {
    // 查询列表
    async getList() {
      const offset = 0;
      const limit = 20;
      console.log(this.deviceName);
      const res = await tunnelList(this.deviceName, offset, limit);
      console.log(res);
      if (res.message === 'Success') {
        this.tableData = res.result.data;
        this.tableData.forEach(item => {
          item.ipadress = item.unitList[0].inet4[0];
        });
        this.totalCount = res.result.totalCount;
      } else {
        this.$message.error(res.message);
      }
    },
    // 搜索框
    search(data) {
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.tableData = list;
      console.log(this.tableData);
    },
    // 分页
    async pageChange(pageIndex) {
      console.log('分页');
      const offset = (pageIndex - 1) * this.pageSize;
      const limit = this.pageSize;
      this.pageIndex = pageIndex;
      // console.log(this.deviceName);
      const res = await tunnelList(this.deviceName, offset, limit);
      this.tableData = res.result.data;
    },
    async pageSizeChange(pageSize) {
      this.pageIndex = 1;
      const offset = (this.pageIndex - 1) * pageSize;
      const limit = pageSize;
      this.pageSize = pageSize;
      console.log(pageSize);
      // this.pageSize = pageSize;
      const res = await tunnelList(this.deviceName, offset, limit);
      this.tableData = res.result.data;
    },
    // tunnelType发生改变
    tunneltypeChange(value) {
      console.log(value);
      if (value === 'p2mp-secure' || value === 'p2mp-cleartext') {
        this.transportFlag = true;
        this.sourceFlag = false;
      } else if (value === 'gre' || value === 'eogre' || value === 'v6gre') {
        this.transportFlag = false;
        this.sourceFlag = true;
      } else {
        this.transportFlag = false;
        this.sourceFlag = false;
      }
    },
    // 新增弹框
    showModal() {
      console.log('新增', this.addtableData);
      this.modalTitle = 'Add Tunnel Interface';
      this.routingInstance();
      this.form.mtu = '1400';
      this.form.mode = 'ipsec';
      this.form.type = 'ipsec';
      this.form.transportType = 'esp';
      if (this.addtableData.length === 0) {
        this.addtableData.push({ name: 0, inet4: [], inet6: [] });
      }
      this.visible = true;
      this.otherDisabled = false;
      this.nameDisabled = true;
    },
    // 查询新增Routing Instance的数据
    async routingInstance() {
      const res = await routingData(this.deviceName);
      console.log(res, '999');
      if (res.message === 'Success') {
        this.routingData = res.result;
      } else {
        this.$message.error(res.message);
      }
    },
    // 点击新增表格的第一列数据
    addModifyItem({ rowData }) {
      console.log('inet4', rowData);
      this.Subinterfaces.unit = rowData.name;
      this.Subinterfaces.ipfour = rowData.inet4;
      this.Subinterfaces.ipsix = rowData.inet6;
      this.ModifyData = rowData;
      this.ipVisible = true;
    },
    // 获取ipv4的数据
    getipfourData(data) {
      console.log(data, 'ipv4数据4');
      this.Subinterfaces.ipfour = data[0].subData;
      this.ipRule = data[0].rule;
    },
    // 获取ipv6的数据
    getipsixData(data) {
      console.log(data, 'ipv6数据6');
      this.Subinterfaces.ipsix = data[0].subData;
      this.ipRule = data[0].rule;
    },
    // 修改ip确认
    changeipOk() {
      // 修改ipv4的数据时 可能会重复 可以先将原先的清空 再赋值
      this.addtableData.forEach(item => {
        console.log(this.Subinterfaces, 978);
        if (item.name === this.Subinterfaces.unit) {
          item.inet4 = [];
          item.inet6 = [];
          item.enable = this.Subinterfaces.enable;
          if (this.Subinterfaces.ipfour) {
            this.Subinterfaces.ipfour.forEach(ip => {
              item.inet4.push(ip);
            });
          }
          if (this.Subinterfaces.ipsix) {
            this.Subinterfaces.ipsix.forEach(six => {
              item.inet6.push(six);
            });
          }
          // item.inet4 = this.Subinterfaces.ipfour;
          // item.inet6 = this.Subinterfaces.ipsix;
        }
      });
      console.log(this.addtableData, '表格数据');
      if (!this.ipRule) {
        this.ipVisible = false;
      }
    },
    // 删除弹框
    async groupDel() {
      console.log(this.seleteName, '删除');
      if (this.seleteName) {
        const res = deleteTunnel(this.deviceName, { name: this.seleteName });
        console.log(res);
        if (res.message === 'Success') {
          this.getList();
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.message);
        }
      } else {
        this.$message.warning('至少选择一条数据');
      }
    },
    cancelSearch() {},
    // 获取删除表单的name
    delItem(selection, rowData) {
      console.log(selection, rowData);
      console.log(rowData.name);
      this.seleteName = rowData.name;
      // 添加单选
      const data = [];
      this.tableData.map(item => {
        item.name != rowData.name
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
    },
    // onChange(e) {
    //   console.log(e);
    //   this.form.enable = e.target.checked;
    // },
    SubinterfacesChange(e) {
      this.Subinterfaces.enable = e.target.checked;
    },
    // 点击表格第一条数据弹出修改模态框
    async modifyItem({ rowData }) {
      this.routingInstance();
      console.log(rowData);
      this.modalTitle = 'Edit Tunnel Interface' + '-' + rowData.name;
      const res = await TunnelData(this.deviceName, rowData.name);
      console.log(res);
      if (res.message === 'Success') {
        this.form = res.result;
        this.form.slot = this.form.slot.toString();
        this.form.port = this.form.port.toString();
        this.tunneltypeChange(res.result.type);
        this.addtableData = this.form.unitList;
        this.form.name = res.result.name.split('ptvi')[1];
        this.changeFlag = true;
        this.visible = true;
      } else {
        this.$message.error(res.message);
      }
      console.log(this.form);
      this.nameDisabled = true;
      this.otherDisabled = true;
    },
    // 修改和新增确认
    handleOk() {
      let rule = ['slot', 'port'];
      if (
        this.form.type === 'gre' ||
        this.form.type === 'eogre' ||
        this.form.type === 'v6gre'
      ) {
        rule.push('source', 'destination', 'routingInstance');
      }
      const formBool = [];
      this.$refs.ruleForm.validateField(rule, value => {
        if (value) {
          // 代表有错
          formBool.push(0);
        }
      });

      if (formBool.length === 0) {
        this.createdTunnel();
      }
    },
    // 可以新增或修改数据
    async createdTunnel() {
      this.form.name = 'tvi' + '-' + this.form.slot + '/' + this.form.port;
      this.form.unitList = this.addtableData;
      this.Loading = true;
      if (this.changeFlag) {
        // 修改
        const res = await changeTunnel(this.deviceName, this.form);
        console.log(res);
        this.Loading = false;
        if (res.message === 'Success') {
          this.$message.success('修改成功');
          this.getList();
          this.visible = false;
        } else {
          this.$message.error(res.message);
        }
      } else {
        // 新增
        console.log(this.addtableData);
        const res = await addTunnel(this.deviceName, this.form);
        console.log(res);
        if (res.message === 'Success') {
          this.$message.success('新增成功');
          this.getList();
          this.visible = false;
        } else {
          this.$message.error(res.message);
        }
      }
    },
    //关闭修改
    cleanData() {
      this.form = {};
      this.Loading = false;
      // this.form.slot = '';
      this.$refs.ruleForm.resetFields();
      // this.port = '';
      this.addtableData = [];
      this.changeFlag = false;
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
  }
};
</script>

<style lang="scss" scoped>
.right {
  width: 270px;
  position: absolute;
  top: 46px;
  left: 292px;
}
.mtu {
  display: flex;
  justify-content: flex-start;
}
.tunneltype {
  display: flex;
  justify-content: flex-start;
}
.source {
  display: flex;
  justify-content: flex-start;
}
.addtable {
  width: 845px;
  border: 1px solid #456880;
  margin-top: 10px;
  padding: 3px 10px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  .addtitle {
    width: 90px;
    height: 21px;
    background: #507691;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    padding: 2px 5px;
    position: absolute;
    top: -11px;
    left: 10px;
  }
}
.vlan {
  display: flex;
  justify-content: flex-start;
}
.port {
  width: 50px;
  color: #0f2c3e;
  position: absolute;
  top: -30px;
  left: 130px;
}
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.mandatory.ant-form-item {
  .ant-form-item-label {
    label {
      &::after {
        color: #ee6978 !important;
        display: block !important;
      }
    }
  }
}
</style>

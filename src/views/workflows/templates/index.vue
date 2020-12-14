<template>
  <div class="main-con">
    <!-- 头部信息 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="createItem"
      @delete-item="deleteItem"
      @search="search"
      @cancel-search="cancelSearch"
    />
    <!-- 表单主体内容 -->
    <v-table
      :style="{ height: 'calc(100% - 15px)' }"
      is-vertical-resize
      is-horizontal-resize
      column-width-drag
      :columns="columns"
      :table-data="tableData"
      :select-all="delItem"
      :select-change="delItem"
      style="width: 100%;"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-model="visible"
      :title="modalTitle"
      :width="1250"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :maskClosable="false"
      :afterClose="cleanData"
    >
      <a-tabs
        @tabClick="tabClick"
        class="tabs-wrap"
        type="card"
        :activeKey="actKey"
      >
        <!-- Base -->
        <a-tab-pane key="1" tab="Basic">
          <Basic
            v-if="visible"
            ref="basic"
            :adm-name-list="admNameList"
            :basic-data="basicData"
            :modal-type="modalType"
            @basic-param="basicParam"
          />
        </a-tab-pane>
        <!-- Interfaces -->
        <a-tab-pane key="2" tab="Interfaces">
          <Interfaces
            v-if="visible"
            ref="interfaces"
            :interfaces-data="interfacesData"
            @interfaces-param="interfacesParam"
            @wifi-port="wifiPort"
          />
        </a-tab-pane>
        <!-- Routing -->
        <a-tab-pane key="3" tab="Routing">
          <Routing
            v-if="visible"
            ref="routing"
            :key="actKey + 'routing'"
            :routing-data="routingData"
            @routing-param="routingParam"
          />
        </a-tab-pane>
        <!-- Tunnels -->
        <a-tab-pane key="4" tab="Tunnels">
          <Tunnels
            v-if="visible"
            ref="tunnels"
            :key="actKey + 'tunnels'"
            :tunnels-data="tunnelsData"
            @tunnels-param="tunnelsParam"
          />
        </a-tab-pane>
        <!-- Inbound NAT -->
        <a-tab-pane key="5" tab="Inbound NAT">
          <Inbound
            v-if="visible"
            ref="inbound"
            :key="actKey + 'inbound'"
            :inbound-data="inboundData"
            @inbound-param="inboundParam"
          />
        </a-tab-pane>
        <!-- Services -->
        <a-tab-pane key="6" tab="Services">
          <Services
            v-if="visible"
            ref="services"
            :key="actKey + 'services'"
            :services-data="servicesData"
            @services-param="servicesParam"
          />
        </a-tab-pane>
        <!-- Management Servers -->
        <!-- <a-tab-pane key="7" tab="Management Servers"><Management /></a-tab-pane> -->
        <!-- wifi configuration -->
        <a-tab-pane v-if="wifiShow" key="7" tab="WiFi Configutation"
          ><Wifi
            v-if="visible"
            ref="wifi"
            :key="actKey + ' wifi'"
            :wifi-data="wifiData"
            @wifi-param="wifiParam"
        /></a-tab-pane>
      </a-tabs>
      <template slot="footer">
        <a-button
          style="float: left;"
          v-show="!(actKey === '1')"
          key="Back"
          @click="tabPrev"
        >
          Back
        </a-button>
        <a-button key="Cancel" @click="visible = false">
          Cancel
        </a-button>
        <a-button
          type="primary"
          key="Save"
          v-show="workflowStatus !== 'Deployed'"
          @click="handleOk"
          :style="{ background: '#0095da' }"
        >
          Save
        </a-button>
        <a-button
          v-show="
            (wifiShow === false && actKey !== '6') ||
              (wifiShow === true && actKey !== '7')
          "
          type="primary"
          key="Continue"
          @click="tabNext"
        >
          Continue
        </a-button>
        <a-button
          v-show="
            (wifiShow === false && actKey === '6') ||
              (wifiShow === true && actKey === '7')
          "
          key="Recreate"
          @click="createTem"
          :style="{ background: '#0095da' }"
        >
          deploy
        </a-button>
      </template>
    </a-modal>

    <!-- task 提示信息 -->
    <TaskNotice :taskinfo="taskinfo" @task-complete="taskComplete" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { columns } from './table';

import common from '@/mixins/common';
import { removeNull } from '@/utils/assits';

import Basic from './Basic';
import Interfaces from './Interfaces';
import Routing from './Routing';
import Tunnels from './Tunnels';
import Inbound from './Inbound';
import Services from './Services';
//import Management from './Management';
import Wifi from './Wifi';

import TaskNotice from 'components/TaskNotice';

import {
  templateList,
  templateAdd,
  templateDel,
  templateSearch,
  templateEdt,
  templateCrt
} from 'apis/administration';
export default {
  mixins: [common],
  data() {
    return {
      columns,
      actKey: '1', //tab当前页
      factorNum: 0,
      workflowStatus: '', //查询所在row的状态 隐藏显示save
      //任务进度查询
      taskinfo: {
        taskId: '',
        type: ''
      },
      //模板表单内容
      formParam: {
        template: {
          // base参数
          templateName: '',
          templateType: 'sdwan-post-staging',
          providerOrg: {
            name: '',
            // services参数
            statefulFW: false,
            nextGenFW: false
          },
          deviceType: 'full-mesh',
          spokeGroup: '',
          isStaging: false,
          controllers: [],
          isPrimary: true,
          isAnalyticsEnabled: true,
          serviceBandwidth: [],
          bandwidth: 0,
          // interfacest参数
          deviceFirmfactor: '',
          wanInterfaces: [],
          lanInterfaces: [],
          // routing参数
          routingInstances: [],
          // tunnels参数
          splitTunnels: [],
          siteToSiteTunnels: [],
          // inboundc nat参数
          inBoundNats: [],
          // wifi 参数
          wifiSettings: {
            wifi2d4GhzInfo: {
              enable: false,
              protocol: '',
              channel: '',
              countryName: '',
              channelWidth: ''
            },
            wifi5GhzInfo: {
              enable: false,
              protocol: '',
              channel: '',
              countryName: ''
            },
            ssid: []
          },
          // management参数
          ntpServers: [],
          syslogServers: [],
          tacacsPlusServers: [],
          radiusServers: [],
          snmpServers: [],
          ldapServers: [],

          redundantPair: {
            enable: false
          },
          solutionTier: 'Advanced-Pro-SDWAN',
          customParams: [],
          diaConfig: {
            loadBalance: false
          }
        }
      },
      listParam: {
        orgname: '',
        offset: 0,
        limit: 20
      },
      templDel: {
        ids: []
      },

      wifiShow: false
    };
  },
  computed: {
    ...mapState(['admNameList', 'organization']),
    // basic数据传递
    basicData() {
      return {
        templateName: this.formParam.template.templateName,
        templateType: this.formParam.template.templateType,
        orgName: this.formParam.template.providerOrg,
        deviceType: this.formParam.template.deviceType,
        spokeGroup: this.formParam.template.spokeGroup,
        controllers: this.formParam.template.controllers,
        bandwidth: this.formParam.template.bandwidth,
        isStaging: this.formParam.template.isStaging,
        isPrimary: this.formParam.template.isPrimary,
        isAnalyticsEnabled: this.formParam.template.isAnalyticsEnabled,
        serviceBandwidth: this.formParam.template.serviceBandwidth,
        solutionTier: this.formParam.template.solutionTier
      };
    },
    // interface数据传递
    interfacesData() {
      return {
        orguuid: this.formParam.template.providerOrg.name,
        deviceFirmfactor: this.formParam.template.deviceFirmfactor,
        wanInterfaces: this.formParam.template.wanInterfaces,
        lanInterfaces: this.formParam.template.lanInterfaces
      };
    },
    // routing数据传递
    routingData() {
      const networkWallData = [];
      const networkLanData = [];
      const vrfData = [];
      const bgpData = [];
      const ospfData = [];
      const riData = [];
      if (this.formParam.template.wanInterfaces.length > 0) {
        this.formParam.template.wanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            if (i.routing) {
              if (i.routing.bgp) {
                i.routing.bgp.networkName = i.networkName;
                i.routing.bgp.neighbors.forEach(k => {
                  k.id = this.guid() + 'bgp';
                });
                bgpData.push(i.routing.bgp);
              }

              if (i.routing.ospf) {
                i.routing.ospf.networkName = i.networkName;
                i.routing.ospf.id = this.guid() + 'ospf';
                ospfData.push(i.routing.ospf);
              }
            }

            networkWallData.push(i.networkName);
          });
        });
      }

      if (this.formParam.template.lanInterfaces.length > 0) {
        this.formParam.template.lanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            if (i.routing) {
              if (i.routing.bgp) {
                i.routing.bgp.networkName = i.networkName;
                i.routing.bgp.neighbors.forEach(k => {
                  k.id = this.guid() + 'bgp';
                });
                bgpData.push(i.routing.bgp);
              }

              if (i.routing.ospf) {
                i.routing.ospf.networkName = i.networkName;
                i.routing.ospf.id = this.guid() + 'ospf';
                ospfData.push(i.routing.ospf);
              }
            }

            networkLanData.push(i.networkName);
            vrfData.push(i.vrfName);
          });
        });
      }

      if (this.formParam.template.routingInstances.length > 0) {
        this.formParam.template.routingInstances.forEach(item => {
          item.prefixes.forEach(i => {
            i.id = this.guid() + 'ri';
          });
          riData.push(item);
        });
      }

      return {
        bgpData,
        ospfData,
        riData,
        networkNameWall: [...new Set(networkWallData)],
        networkNameLan: [...new Set(networkLanData)],
        networkName: [...new Set(networkWallData), ...new Set(networkLanData)],
        vrfName: [...new Set(vrfData)]
      };
    },
    // tunnels数据传递
    tunnelsData() {
      const spldata = [];
      const sitedata = [];

      if (this.formParam.template.splitTunnels.length > 0) {
        this.formParam.template.splitTunnels.forEach(item => {
          item.id = this.guid() + 'spl';
          spldata.push(item);
        });
      }
      if (this.formParam.template.siteToSiteTunnels.length > 0) {
        this.formParam.template.siteToSiteTunnels.forEach(item => {
          item.id = this.guid() + 'site';
          sitedata.push(item);
        });
      }
      return {
        spldata: this.formParam.template.splitTunnels,
        sitedata: this.formParam.template.siteToSiteTunnels,
        networkNameWall: this.routingData.networkNameWall,
        networkNameLan: this.routingData.networkNameLan,
        networkName: this.routingData.networkName,
        vrfName: this.routingData.vrfName
      };
    },
    // inbound 数据传递
    inboundData() {
      const inbdata = [];
      if (this.formParam.template.inBoundNats.length > 0) {
        this.formParam.template.inBoundNats.forEach(item => {
          item.id = this.guid() + 'inb';
          inbdata.push(item);
        });
      }
      return {
        inbdata,
        networkNameWall: this.routingData.networkNameWall,
        vrfName: this.routingData.vrfName
      };
    },
    // services 数据传递
    servicesData() {
      const serData = [];
      const relData = [];
      let networkNameLan = this.tunnelsData.networkNameLan;
      let temValue = 1;
      if (this.formParam.template.lanInterfaces.length > 0) {
        this.formParam.template.lanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            if (i.ipv4DhcpServer) {
              serData.push({
                id: this.guid() + 'ser',
                name: i.networkName,
                profile: i.dhcpv4Profile
              });
              networkNameLan = networkNameLan.filter(k => {
                return k !== i.networkName;
              });
            }
            if (i.dhcpV4Relay) {
              relData.push({
                id: this.guid() + 'ser',
                name: i.networkName,
                address: i.dhcpV4RelayAddress
              });
              networkNameLan = networkNameLan.filter(k => {
                return k !== i.networkName;
              });
            }
          });
        });
      }
      if (this.formParam.template.providerOrg.statefulFW) {
        temValue = 3;
      }
      if (this.formParam.template.providerOrg.nextGenFW) {
        temValue = 2;
      }
      return {
        serData,
        relData,
        temValue,
        networkNameLan,
        orguuid: this.formParam.template.providerOrg.name
      };
    },
    // wifi 数据传递
    wifiData() {
      return {
        wifi2d4GhzInfo: this.formParam.template.wifiSettings.wifi2d4GhzInfo,
        wifi5GhzInfo: this.formParam.template.wifiSettings.wifi5GhzInfo,
        ssid: this.formParam.template.wifiSettings.ssid
      };
    }
  },
  created() {
    //获取组织对应模板
    this.getNameList();
  },

  methods: {
    ...mapActions(['getNameList']),

    // Basic param 数据传回
    basicParam(param) {
      this.formParam.template = Object.assign(this.formParam.template, param);
      console.log('this.formParam.template', this.formParam.template);
    },
    // interfacesParam 数据传回
    interfacesParam(param) {
      this.formParam.template = Object.assign(this.formParam.template, param);

      const ssidNetworkName = [];
      if (this.formParam.template.wifiSettings) {
        if (this.formParam.template.wifiSettings.ssid.length > 0) {
          this.formParam.template.wifiSettings.ssid.forEach(item => {
            ssidNetworkName.push(item.networkName);
          });
        }
      }

      // 添加 wifiSettings ssid

      if (this.formParam.template.lanInterfaces.length > 0) {
        this.formParam.template.lanInterfaces.forEach(item => {
          if (item.interfaceName.substring(6) > 199) {
            if (ssidNetworkName.length > 0) {
              if (!ssidNetworkName.includes(item.unitInfo[0].networkName)) {
                this.formParam.template.wifiSettings.ssid.push({
                  networkName: item.unitInfo[0].networkName,
                  ssidName: '',
                  broadcastSsid: false,
                  frequency: '',
                  securityMode: '',
                  encryptionType: '',
                  password: ''
                });
              }
            } else {
              this.formParam.template.wifiSettings.ssid.push({
                networkName: item.unitInfo[0].networkName,
                ssidName: '',
                broadcastSsid: false,
                frequency: '',
                securityMode: '',
                encryptionType: '',
                password: ''
              });
            }
          }
        });
        // routing instance 相关的配置
        if (this.formParam.template.routingInstances.length > 0) {
          this.formParam.template.routingInstances = this.formParam.template.routingInstances.filter(
            item => {
              return this.routingData.vrfName.includes(item.routingInstance);
            }
          );
        }

        if (this.formParam.template.splitTunnels.length > 0) {
          this.formParam.template.splitTunnels = this.formParam.template.splitTunnels.filter(
            item => {
              return this.routingData.vrfName.includes(item.vrfName);
            }
          );
        }

        if (this.formParam.template.siteToSiteTunnels.length > 0) {
          this.formParam.template.siteToSiteTunnels = this.formParam.template.siteToSiteTunnels.filter(
            item => {
              return this.routingData.vrfName.includes(item.lanVrf);
            }
          );
        }

        if (this.formParam.template.inBoundNats.length > 0) {
          this.formParam.template.inBoundNats = this.formParam.template.inBoundNats.filter(
            item => {
              return this.routingData.vrfName.includes(item.lanRoutingInstance);
            }
          );
        }
      } else {
        // routing instance 没有清空相关的配置
        this.formParam.template.routingInstances = [];
        this.formParam.template.wifiSettings.ssid = [];
        this.formParam.template.splitTunnels = [];
        this.formParam.template.siteToSiteTunnels = [];
        this.formParam.template.inBoundNats = [];
      }
    },
    // wifi端口数量传回
    wifiPort(val) {
      val === 8 ? (this.wifiShow = false) : (this.wifiShow = true);
    },
    // Routing 数据传回
    routingParam(bgpParam, ospParam, riParam) {
      this.formParam.template.wanInterfaces.forEach(item => {
        item.unitInfo.forEach(i => {
          i.routing = {
            bgp: null,
            ospf: null
          };
          if (bgpParam.length > 0) {
            bgpParam.forEach(v => {
              if (v.networkName === i.networkName) {
                i.routing.bgp = v;
              }
            });
          }
          if (ospParam.length > 0) {
            ospParam.forEach(v => {
              if (v.networkName === i.networkName) {
                i.routing.ospf = v;
              }
            });
          }
        });
      });

      this.formParam.template.lanInterfaces.forEach(item => {
        item.unitInfo.forEach(i => {
          i.routing = {
            bgp: null,
            ospf: null
          };
          if (bgpParam.length > 0) {
            bgpParam.forEach(v => {
              if (v.networkName === i.networkName) {
                i.routing.bgp = v;
              }
            });
          }
          if (ospParam.length > 0) {
            ospParam.forEach(v => {
              if (v.networkName === i.networkName) {
                i.routing.ospf = v;
              }
            });
          }
        });
      });

      this.formParam.template.routingInstances = riParam;
      console.log(this.formParam);
    },
    // tunnels 数据传回
    tunnelsParam(splParam, siteParam) {
      this.formParam.template.splitTunnels = splParam;
      this.formParam.template.siteToSiteTunnels = siteParam;
    },
    // inbound传回参数
    inboundParam(inbParam) {
      this.formParam.template.inBoundNats = inbParam;
    },
    // services数据传回
    servicesParam(servicesParam, temParam) {
      this.formParam.template.lanInterfaces.forEach(item => {
        item.unitInfo.forEach(i => {
          i.dhcpV4Relay = null;
          i.dhcpV4RelayAddress = null;
          i.ipv4DhcpServer = null;
          i.dhcpv4Profile = null;
          servicesParam.forEach(k => {
            if (k.name === i.networkName) {
              if (k.profile) {
                i.ipv4DhcpServer = true;
                i.dhcpv4Profile = k.profile;
                i.dhcpV4Relay = null;
                i.dhcpV4RelayAddress = null;
              }
              if (k.address) {
                i.ipv4DhcpServer = null;
                i.dhcpv4Profile = null;
                i.dhcpV4Relay = true;
                i.dhcpV4RelayAddress = k.address;
              }
            }
          });
        });
      });
      this.formParam.template.providerOrg = Object.assign(
        this.formParam.template.providerOrg,
        temParam
      );
    },
    // wifi传回参数
    wifiParam(wifiParam) {
      this.formParam.template.wifiSettings = wifiParam;
    },

    // tab 切换
    tabClick(key) {
      this.$refs.basic.$refs.form.validate(valid => {
        this.subParam();
        if (valid) {
          this.actKey = key;
        }
      });
    },
    // tab 返回上一步
    tabPrev() {
      this.subParam();
      if (this.actKey !== '1') {
        this.actKey = String(Number(this.actKey) - 1);
      }
    },
    // tab 去下一页
    tabNext() {
      this.$refs.basic.$refs.form.validate(valid => {
        if (valid) {
          this.subParam();
          this.actKey = String(Number(this.actKey) + 1);
        }
      });
    },
    subParam() {
      switch (true) {
        case this.actKey === '1':
          this.$refs.basic.$refs.form.validate(valid => {
            if (valid) {
              this.$refs.basic.param();
            }
          });
          break;
        case this.actKey === '2':
          this.$refs.interfaces.param();
          break;
        case this.actKey === '3':
          this.$refs.routing.param();
          break;
        case this.actKey === '4':
          this.$refs.tunnels.param();
          break;
        case this.actKey === '5':
          this.$refs.inbound.param();
          break;
        case this.actKey === '6':
          this.$refs.services.param();
          break;
        case this.actKey === '7':
          this.$refs.wifi.param();
          break;
      }
    },
    // 模板列表
    async lists() {
      if (this.organization) {
        this.listParam = {
          orgname: this.organization,
          offset: this.offset,
          limit: this.pageSize
        };
      } else {
        this.listParam = {
          offset: this.offset,
          limit: this.pageSize
        };
      }
      const { result } = await templateList(this.listParam);
      this.totalCount = result.totalCount;
      this.tableData = result['versanms.sdwan-template-list'];
    },
    //创建模板
    async createItem() {
      this.modalTitle = 'Create Template';
      this.modalType = 'add';
      this.visible = true;
    },
    //编辑模板
    async modifyItem(params) {
      this.modalTitle = 'Edit Template - ' + params.rowData.templateName;
      this.modalType = 'edt';
      const { result } = await templateSearch(params.rowData.templateName);
      this.formParam.template = Object.assign(
        this.formParam.template,
        removeNull(result.template)
      );
      this.workflowStatus = params.rowData.workflowStatus;

      // 查看 判断WiFi 切换是否显示
      if (this.formParam.template.lanInterfaces.length > 0) {
        this.wifiShow = this.formParam.template.lanInterfaces.some(item => {
          if (item.interfaceName.substring(6) > 199) {
            return true;
          }
        });
      }
      this.visible = true;
    },
    //获取选中模板名称
    delItem(selection) {
      this.templDel.ids = [];
      selection.forEach(item => {
        this.templDel.ids.push(item.templateName);
      });
      const newArr = Array.from(new Set(this.templDel.ids));
      this.templDel.ids = newArr;
      console.log(this.templDel);
    },
    //删除模板操作
    async deleteItem() {
      const res = await templateDel(this.templDel);
      this.templDel = {
        ids: []
      };
      if (res.status !== '0000') return this.$message.error(res.message);
      this.taskinfo = {
        taskId: res.result.TaskResponse['task-id'],
        type: 'del'
      };
      // 更新表格列表
      this.lists();
    },
    // 新增修改提交
    async handleOk() {
      if (this.modalType === 'add') {
        this.$refs.basic.$refs.form.validate(async valid => {
          if (valid) {
            if (this.formParam.template.wanInterfaces.length < 1) {
              this.subParam();
              this.actKey = '2';
              return this.$message.error('must add a waninterface');
            }
            this.subParam();
            const res = await templateAdd(this.formParam);
            if (res.status !== '0000') return this.$message.error(res.message);
            this.$message.success('模板创建成功！');
            this.visible = false;
            // 刷新表格数据
            this.lists();
            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              visible: true
            };
          }
        });
      }
      if (this.modalType === 'edt') {
        this.$refs.basic.$refs.form.validate(async valid => {
          if (valid) {
            if (this.formParam.template.wanInterfaces.length < 1) {
              this.actKey = '2';
              return this.$message.error('must add a waninterface');
            }
            this.subParam();
            const res = await templateEdt(
              this.formParam.template.templateName,
              this.formParam
            );
            if (res.status !== '0000') return this.$message.error(res.message);
            this.$message.success('模板更新成功！');
            this.visible = false;
            // 刷新表格数据
            this.lists();
            // 任务进度
            this.taskinfo = {
              taskId: res.result.TaskResponse['task-id'],
              visible: true
            };
          }
        });
      }
    },
    // 模板部署
    async deploy(name) {
      const resCrt = await templateCrt({
        id: name,
        verifyDiff: true
      });

      if (resCrt.status !== '0000') return this.$message.error(resCrt.message);
      this.$message.success('模板部署成功！');
      // 刷新表格数据
      this.lists();
    },
    async createTem() {
      if (this.modalType === 'add') {
        // 模板新建
        this.$refs.basic.$refs.form.validate(async valid => {
          if (valid) {
            if (this.formParam.template.wanInterfaces.length < 1) {
              this.actKey = '2';
              return this.$message.error('must add a waninterface');
            }

            this.subParam();
            const res = await templateAdd(this.formParam);
            if (res.status !== '0000') return this.$message.error(res.message);
            this.visible = false;
            this.deploy(this.formParam.template.templateName);
          }
        });
      }

      if (this.modalType === 'edt') {
        this.$refs.basic.$refs.form.validate(async valid => {
          if (valid) {
            if (this.formParam.template.wanInterfaces.length < 1) {
              this.actKey = '2';
              return this.$message.error('must add a waninterface');
            }

            this.subParam();
            const res = await templateEdt(
              this.formParam.template.templateName,
              this.formParam
            );
            if (res.status !== '0000') return this.$message.error(res.message);
            this.visible = false;
            this.deploy(this.formParam.template.templateName);
          }
        });
      }
    },
    // tasknotice 关闭
    taskComplete() {
      // 刷新表格数据
      this.lists();
    },
    // 关闭清楚数据
    cleanData() {
      this.actKey = '1';
      this.wifiShow = false;
      this.workflowStatus = '';
      this.formParam = {
        template: {
          // base参数
          templateName: '',
          templateType: 'sdwan-post-staging',
          providerOrg: {
            name: '',
            // services参数
            statefulFW: false,
            nextGenFW: false
          },
          deviceType: 'spoke',
          spokeGroup: '',
          isStaging: false,
          controllers: [],
          isPrimary: true,
          isAnalyticsEnabled: true,
          serviceBandwidth: [],
          bandwidth: 0,
          // interfacest参数
          deviceFirmfactor: '',
          wanInterfaces: [],
          lanInterfaces: [],
          // routing参数
          routingInstances: [],
          // tunnels参数
          splitTunnels: [],
          siteToSiteTunnels: [],
          // inboundc nat参数
          inBoundNats: [],
          // wifi 参数
          wifiSettings: {
            wifi2d4GhzInfo: {
              enable: false,
              protocol: '',
              channel: '',
              countryName: '',
              channelWidth: ''
            },
            wifi5GhzInfo: {
              enable: false,
              protocol: '',
              channel: '',
              countryName: ''
            },
            ssid: []
          },
          // management参数
          ntpServers: [],
          syslogServers: [],
          tacacsPlusServers: [],
          radiusServers: [],
          snmpServers: [],
          ldapServers: [],

          redundantPair: {
            enable: false
          },
          solutionTier: 'Advanced-Pro-SDWAN',
          customParams: [],
          diaConfig: {
            loadBalance: false
          }
        }
      };
    }
  },
  components: {
    TaskNotice,
    Basic,
    Interfaces,
    Routing,
    Tunnels,
    Inbound,
    Services,
    //Management,
    Wifi
  },
  watch: {
    organization: {
      handler: 'lists',
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.v-table-title-class tr td:nth-of-type(1) .table-title .v-checkbox {
  display: block;
}
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

<template>
  <div class="firm-factor">
    <div class="factor-title">Device Port Configuration</div>
    <a-row
      class="factor-con"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <a-col class="factor-select">
        <div class="select-title">Number of Ports</div>
        <a-select
          v-model="formParam.deviceFirmfactor"
          size="small"
          style="width: 85px"
          @change="changePort"
          :style="{ fontSize: '12px' }"
        >
          <a-select-option :style="{ fontSize: '12px' }" value="">
            --Select--
          </a-select-option>
          <a-select-option value="4">
            4
          </a-select-option>
          <a-select-option value="6">
            6
          </a-select-option>
          <a-select-option value="8">
            8
          </a-select-option>
          <a-select-option value="10">
            10
          </a-select-option>
          <a-select-option value="12">
            12
          </a-select-option>
          <a-select-option value="14">
            14
          </a-select-option>
          <a-select-option value="16">
            16
          </a-select-option>
        </a-select>
      </a-col>
      <a-col
        class="factor-list"
        :style="{
          width: '296px',
          overflowX: itemsWidth > 296 ? 'scroll' : 'hidden'
        }"
      >
        <a-row
          type="flex"
          justify="space-between"
          align="top"
          :style="{ width: itemsWidth + 'px' }"
        >
          <a-col class="list-item">
            <div class="port-value">0</div>
            <div class="port-icon">
              <img width="100%" src="@/assets/images/template/wf5.jpg" alt="" />
            </div>
            <div class="port-title">Mgmt</div>
          </a-col>
          <a-col
            v-for="(item, index) in portType"
            :key="index"
            class="list-item"
          >
            <div class="port-value">{{ index + 1 }}</div>
            <div class="port-icon" @click="addRow($event, item, index)">
              <img width="100%" :src="item.src" alt="" />
            </div>
            <div class="port-title">{{ item | portTitle(item) }}</div>
          </a-col>
        </a-row>
      </a-col>
      <a-col class="factor-add">
        <a-row type="flex" justify="start" align="middle">
          <a-col class="list-item">
            <div class="port-icon" @click="factorAdd('wan')">
              <span>{{ 4 - wanPort.length }}</span>
              <img width="100%" src="@/assets/images/template/wf7.png" alt="" />
            </div>
            <div class="port-title">LTE</div>
          </a-col>
          <a-col class="list-item">
            <div class="port-icon" @click="factorAdd('lan')">
              <span>{{ 8 - lanPort.length }}</span>
              <img width="100%" src="@/assets/images/template/wf8.png" alt="" />
            </div>
            <div class="port-title">WIFI</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- WAN Interfaces -->
    <div class="factor-table">
      <div class="mandatory" v-show="errorMsg">
        {{ errorMsg }}
      </div>
      <div class="wan-title">
        WAN Interfaces
      </div>
      <table class="table-bordered">
        <thead>
          <tr>
            <th rowspan="2" style="width:58px;">
              Port #
            </th>
            <th rowspan="2" style="width:108px">
              Interface
            </th>
            <th rowspan="2" style="width:114px">
              VLAN ID
            </th>
            <th rowspan="2" style="width:226px">
              Network Name
            </th>
            <th rowspan="2" style="width:114px">
              Priority
            </th>
            <th colspan="2" style="text-align:center;width:128px">
              IPv4
            </th>
            <th colspan="2" style="text-align:center;width:128px">
              IPv6
            </th>
            <th rowspan="2" style="text-align:center;width:70px">
              Allow SSH To CPE
            </th>
            <th colspan="2" style="text-align:center;width:210px">
              Link Monitor
            </th>
            <th rowspan="2" style="text-align:center;width:95px">
              Sub Interfaces
            </th>
          </tr>
          <tr>
            <th>
              Static
            </th>
            <th>
              DHCP
            </th>
            <th>
              Static
            </th>
            <th>
              DHCP
            </th>
            <th style="width:105px">
              Nexthop
            </th>
            <th style="width:105px">
              Remote IP
            </th>
          </tr>
        </thead>
        <tbody>
          <template template v-for="item in formParam.wanInterfaces">
            <tr v-for="(i, index) in item.unitInfo" :key="i.id">
              <td>
                <a-form-model-item style="width:45px" v-show="index === 0">
                  <a-input
                    :class="{ inputBg1: true, inputBg2: item.pppoe }"
                    size="small"
                    disabled
                    :value="item.interfaceName.substring(6)"
                  />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:60px" v-show="index === 0">
                  <a-input
                    :class="{ inputBg1: true, inputBg2: item.pppoe }"
                    disabled
                    size="small"
                    v-model="item.interfaceName"
                  />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item v-show="!item.pppoe" style="width:60px">
                  <a-input
                    v-if="item.interfaceName.substring(6) > 99"
                    disabled
                    size="small"
                  />
                  <a-input v-else size="small" v-model="i.vlanId" />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:200px">
                  <a-select
                    size="small"
                    @change="TraDomain(i.id, i.networkName)"
                    v-model="i.networkName"
                  >
                    <a-select-option value="">--Select--</a-select-option>
                    <a-select-option
                      @click="addNetwork(i.id)"
                      value="+ Create WAN Network"
                      >+ Create WAN Network</a-select-option
                    >
                    <a-select-option
                      v-for="item in netTransport.keys()"
                      :key="item"
                      :value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:100px">
                  <a-input size="small" v-model="i.linkPriority" />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:60px">
                  <a-checkbox
                    size="small"
                    @change="checkIp(i.id, 'ipv4Static', 'wan')"
                    v-model="i.ipv4Static"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:60px">
                  <a-checkbox
                    size="small"
                    @change="checkIp(i.id, 'ipv4Dhcp', 'wan')"
                    v-model="i.ipv4Dhcp"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:60px">
                  <a-checkbox
                    size="small"
                    @change="checkIp(i.id, 'ip6Static', 'wan')"
                    v-model="i.ip6Static"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:60px">
                  <a-checkbox
                    @change="checkIp(i.id, 'ipv6Dhcp', 'wan')"
                    size="small"
                    v-model="i.ipv6Dhcp"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:60px">
                  <a-checkbox size="small" v-model="i.allowSSH" />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:60px">
                  <a-checkbox v-model="i.monitor.monitorNexthop" />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:100px">
                  <a-input
                    :disabled="i.monitor.monitorNexthop"
                    size="small"
                    v-model="i.monitor.monitorIPv4Address"
                  />
                </a-form-model-item>
              </td>
              <td
                v-if="item.interfaceName.substring(6) < 100 && index === 0"
                class="addBtn"
              >
                <button
                  @click="addInface(item.interfaceName.substring(6), 'wan')"
                >
                  +
                </button>
              </td>
              <td v-else class="delBtn">
                <a
                  href="javascript:;"
                  @click="
                    delInface(item.interfaceName.substring(6), i.id, 'wan')
                  "
                  ><img src="@/assets/images/organize/del.png" alt
                /></a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- LAN Interfaces -->
    <div class="factor-table">
      <div class="wan-title">
        LAN Interfaces
      </div>
      <table class="table-bordered">
        <thead>
          <tr>
            <th rowspan="2" style="width:56px;">
              Port #
            </th>
            <th rowspan="2" style="width:85px">
              Interface
            </th>
            <th rowspan="2" style="width:85px">
              VLAN ID
            </th>
            <th rowspan="2" style="width:165px">
              Network Name
            </th>
            <th rowspan="2" style="width:165px">
              Organization
            </th>
            <th rowspan="2" style="width:165px">
              Zones
            </th>
            <th rowspan="2" style="width:165px">
              Routing Instance
            </th>

            <th colspan="2" style="text-align:center;width:128px">
              IPv4
            </th>
            <th colspan="2" style="text-align:center;width:128px">
              IPv6
            </th>
            <th rowspan="2" style="text-align:center;width:95px">
              Sub Interfaces
            </th>
          </tr>
          <tr>
            <th>
              Static
            </th>
            <th>
              DHCP
            </th>
            <th>
              Static
            </th>
            <th>
              DHCP
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in formParam.lanInterfaces">
            <tr v-for="(i, index) in item.unitInfo" :key="i.id">
              <td>
                <a-form-model-item style="width:45px" v-show="index === 0">
                  <a-input
                    class="inputBg3"
                    size="small"
                    disabled
                    :value="item.interfaceName.substring(6)"
                  />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:60px" v-show="index === 0">
                  <a-input
                    class="inputBg3"
                    disabled
                    size="small"
                    v-model="item.interfaceName"
                  />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:60px">
                  <a-input
                    v-if="item.interfaceName.substring(6) > 199"
                    disabled
                    size="small"
                  />
                  <a-input v-else size="small" v-model="i.vlanId" />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:172px">
                  <a-input size="small" v-model="i.networkName" />
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:165px">
                  <a-select size="small" v-model="i.subOrganization">
                    <a-select-option value="">
                      --Select--
                    </a-select-option>
                    <a-select-option :value="formParam.orguuid">
                      {{ formParam.orguuid }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
              <td>
                <a-form-model-item style="width:165px">
                  <a-select size="small" v-model="i.zoneName">
                    <a-select-option value="">
                      --Select--
                    </a-select-option>
                    <a-select-option
                      v-for="item in zonesNames"
                      :key="item"
                      :value="item"
                      >{{ item }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:165px">
                  <a-select size="small" v-model="i.vrfName">
                    <a-select-option value="">
                      --Select--
                    </a-select-option>
                    <a-select-option :value="vrfName">
                      {{ vrfName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:52px">
                  <a-checkbox
                    @change="checkIp(i.id, 'ipv4Static', 'Lan')"
                    v-model="i.ipv4Static"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:52px">
                  <a-checkbox
                    @change="checkIp(i.id, 'ipv4Dhcp', 'Lan')"
                    v-model="i.ipv4Dhcp"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item style="width:52px">
                  <a-checkbox
                    @change="checkIp(i.id, 'ip6Static', 'Lan')"
                    v-model="i.ip6Static"
                  />
                </a-form-model-item>
              </td>
              <td align="center">
                <a-form-model-item>
                  <a-checkbox
                    @change="checkIp(i.id, 'ipv6Dhcp', 'Lan')"
                    style="width:52px"
                    v-model="i.ipv6Dhcp"
                  />
                </a-form-model-item>
              </td>
              <td
                v-if="item.interfaceName.substring(6) < 200 && index === 0"
                class="addBtn"
              >
                <button
                  @click="addInface(item.interfaceName.substring(6), 'lan')"
                >
                  +
                </button>
              </td>
              <td v-else class="delBtn">
                <a
                  href="javascript:;"
                  @click="
                    delInface(item.interfaceName.substring(6), i.id, 'lan')
                  "
                  ><img src="@/assets/images/organize/del.png" alt
                /></a>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <!-- 切换port弹窗 -->
    <selectItem
      v-show="selectVisble"
      :fixed="fixed"
      :cur-item="curItem"
      :cur-index="curIndex"
      @select-port="selectPort"
      @mouseleave.native="selectLeave"
    />
    <!-- 新建network -->
    <networkCreate
      :visible="networkVisible"
      :orguuid="formParam.orguuid"
      @new-netwrok="newNetwrok"
    />
  </div>
</template>

<script>
import common from '@/mixins/tip';
import selectItem from './selectItem';
import networkCreate from './networkName';

import { networkName, adminSearch } from 'apis/administration';
import { zonePPName } from 'apis/zoneQos';
export default {
  mixins: [common],
  props: {
    interfacesData: {
      type: Object
    }
  },
  data() {
    return {
      selectVisble: false, // 切换port弹出显示隐藏
      fixed: { lf: 0, tp: 0 }, // 切换port弹窗位置
      portType: [], //port关联数组
      curItem: {}, //当前port
      curIndex: 0, //当前port对应portType得下标

      networkId: '',

      netTransport: new Map(),
      zonesNames: [],
      networkVisible: false, //network显示隐藏

      formParam: this.interfacesData,

      vrfName: '',

      wanPort: [100, 101, 102, 103],
      lanPort: [200, 201, 202, 203, 204, 205, 206, 207],
      errorMsg: ''
    };
  },
  computed: {
    itemsWidth() {
      return (this.portType.length + 1) * 32;
    }
  },
  created() {
    this.getNetTransport();
    this.getZonesName();
    this.lanRouting();

    // 查看Port端口展示
    this.changePort(this.interfacesData.deviceFirmfactor);
    // 查看数据处理 添加id
    if (this.formParam.wanInterfaces.length > 0) {
      this.formParam.wanInterfaces.forEach(item => {
        const key = Number(item.interfaceName.substring(6));

        if (key < 100) {
          if (item.pppoe) {
            this.portType[key] = {
              id: '2',
              src: require('@/assets/images/template/wf2.jpg'),
              title: 'PPPoE'
            };
          } else {
            this.portType[key] = {
              id: '0',
              src: require('@/assets/images/template/wf1.jpg'),
              title: 'wan'
            };
          }
        } else {
          this.wanPort = this.wanPort.filter(p => {
            return p !== key;
          });
        }

        item.unitInfo.forEach(i => {
          i.id = this.guid() + 'waninterface';
        });
      });
    }
    if (this.formParam.lanInterfaces.length > 0) {
      this.formParam.lanInterfaces.forEach(item => {
        const key = Number(item.interfaceName.substring(6));

        if (key < 200) {
          this.portType[key] = {
            id: '1',
            src: require('@/assets/images/template/wf6.jpg'),
            title: 'LAN'
          };
        } else {
          this.lanPort = this.lanPort.filter(p => {
            return p !== key;
          });
        }
        item.unitInfo.forEach(i => {
          i.id = this.guid() + 'laninterface';
        });
      });
    }
  },

  methods: {
    // 切换port
    addRow(e, item, index) {
      this.fixed.lf = e.target.getBoundingClientRect().left + 8;
      this.fixed.tp = e.target.getBoundingClientRect().top - 75;
      this.selectVisble = true;
      this.curItem = item;
      this.curIndex = index;
    },
    // 鼠标移出隐藏切换port框
    selectLeave() {
      this.selectVisble = false;
    },
    // 控制port显示数量
    changePort(value) {
      const val = Number(value);
      const length = this.portType.length;
      switch (true) {
        case length == 0:
          for (let i = 1; i < val; i++) {
            this.portType.push({
              id: '4',
              src: require('@/assets/images/template/wf4.jpg'),
              title: ''
            });
          }
          break;
        case val > length:
          for (let i = 1; i < val - length; i++) {
            this.portType.push({
              id: '4',
              src: require('@/assets/images/template/wf4.jpg'),
              title: ''
            });
          }
          break;
        case val < length:
          for (let i = 0; i <= length - val; i++) {
            this.portType.pop();
          }
          break;
      }
    },
    // 切换port后修改portType对应item
    selectPort(item, index) {
      const wanParam = {
        interfaceName: 'vni-0/' + index,
        pppoe: item.id === '2' ? true : false,
        unitInfo: [
          {
            id: this.guid() + 'waninterface',
            subUnit: 0,
            vlanId: 0,
            networkName: '',
            ipv4Static: false,
            ipv4Dhcp: true,
            ip6Static: false,
            ipv6Dhcp: false,
            allowSSH: false,
            monitor: {
              monitorNexthop: false,
              monitorIPv4Address: null
            },
            linkPriority: null,
            transportDomains: [],
            routing: {}
          }
        ]
      };
      const lanParam = {
        interfaceName: 'vni-0/' + index,
        unitInfo: [
          {
            id: this.guid() + 'laninterface',
            subUnit: 0,
            vlanId: 0,
            networkName: '',
            subOrganization: this.formParam.orguuid,
            vrfName: this.vrfName,
            zoneName: '',
            ipv4Static: true,
            ipv4Dhcp: false,
            ipv4DhcpServer: false,
            ip6Static: false,
            ipv6Dhcp: false,
            dhcpv4Profile: null,
            routing: {}
          }
        ]
      };
      this.curItem = item;
      this.portType[index] = item;

      this.formParam.wanInterfaces = this.formParam.wanInterfaces.filter(
        item => {
          return item.interfaceName.substring(6) !== String(index);
        }
      );
      this.formParam.lanInterfaces = this.formParam.lanInterfaces.filter(
        item => {
          return item.interfaceName.substring(6) !== String(index);
        }
      );
      if (item.id === '0' || item.id === '2') {
        this.formParam.wanInterfaces.push(wanParam);
      } else if (item.id === '1') {
        this.formParam.lanInterfaces.push(lanParam);
      } else if (item.id === '3') {
        this.formParam.wanInterfaces.push(wanParam);
        this.formParam.lanInterfaces.push(lanParam);
      } else {
        return;
      }
    },
    // 表格ip栏 checkbox 单选效果
    checkIp(id, ip, type) {
      console.log(id, ip, type);
      if (type === 'wan') {
        this.formParam.wanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            if (i.id === id) {
              switch (true) {
                case ip === 'ipv4Static':
                  if (i.ipv4Static) i.ipv4Dhcp = !i.ipv4Static;
                  break;
                case ip === 'ipv4Dhcp':
                  if (i.ipv4Dhcp) i.ipv4Static = !i.ipv4Dhcp;
                  break;
                case ip === 'ip6Static':
                  if (i.ip6Static) i.ipv6Dhcp = !i.ip6Static;
                  break;
                case ip === 'ipv6Dhcp':
                  if (i.ipv6Dhcp) i.ip6Static = !i.ipv6Dhcp;
                  break;
              }
            }
          });
        });
      }
      if (type === 'Lan') {
        this.formParam.lanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            if (i.id === id) {
              switch (true) {
                case ip === 'ipv4Static':
                  if (i.ipv4Static) i.ipv4Dhcp = !i.ipv4Static;
                  break;
                case ip === 'ipv4Dhcp':
                  if (i.ipv4Dhcp) i.ipv4Static = !i.ipv4Dhcp;
                  break;
                case ip === 'ip6Static':
                  if (i.ip6Static) i.ipv6Dhcp = !i.ip6Static;
                  break;
                case ip === 'ipv6Dhcp':
                  if (i.ipv6Dhcp) i.ip6Static = !i.ipv6Dhcp;
                  break;
              }
            }
          });
        });
      }
    },
    // factor add
    factorAdd(type) {
      if (type === 'wan') {
        if (this.wanPort.length === 0) {
          this.errorMsg =
            "Maximum number of LTE interface selection can't exceed 4";
        } else {
          this.formParam.wanInterfaces.push({
            interfaceName: 'vni-0/' + Math.min(...this.wanPort),
            pppoe: false,
            unitInfo: [
              {
                id: this.guid() + 'waninterface',
                subUnit: 0,
                vlanId: 0,
                networkName: '',
                ipv4Static: false,
                ipv4Dhcp: true,
                ip6Static: false,
                ipv6Dhcp: false,
                allowSSH: false,
                monitor: {
                  monitorNexthop: false,
                  monitorIPv4Address: null
                },
                linkPriority: null,
                transportDomains: [],
                routing: {}
              }
            ]
          });
          this.wanPort = this.wanPort.filter(item => {
            return item != Math.min(...this.wanPort);
          });
          console.log(this.wanPort);
        }
      }
      if (type === 'lan') {
        if (this.lanPort.length === 0) {
          this.errorMsg =
            "Maximum number of WIFI interface selection can't exceed 8";
          return;
        } else {
          this.formParam.lanInterfaces.push({
            interfaceName: 'vni-0/' + Math.min(...this.lanPort),
            unitInfo: [
              {
                id: this.guid() + 'laninterface',
                subUnit: 0,
                vlanId: 0,
                networkName: '',
                subOrganization: this.formParam.orguuid,
                vrfName: this.vrfName,
                zoneName: '',
                ipv4Static: true,
                ipv4Dhcp: false,
                ipv4DhcpServer: false,
                ip6Static: false,
                ipv6Dhcp: false,
                dhcpv4Profile: null,
                routing: {}
              }
            ]
          });
          this.lanPort = this.lanPort.filter(item => {
            return item != Math.min(...this.lanPort);
          });
          console.log(this.lanPort);
        }
      }
    },

    // interface子接口添加
    addInface(port, type) {
      const wanUnitInfo = {
        id: this.guid() + 'waninterface',
        subUnit: 0,
        vlanId: 0,
        networkName: '',
        ipv4Static: false,
        ipv4Dhcp: false,
        ip6Static: false,
        ipv6Dhcp: false,
        allowSSH: false,
        monitor: {
          monitorNexthop: false,
          monitorIPv4Address: null
        },
        linkPriority: null,
        transportDomains: [],
        routing: {}
      };

      const lanUnitInfo = {
        id: this.guid() + 'laninterface',
        subUnit: 0,
        vlanId: 0,
        networkName: '',
        subOrganization: this.formParam.orguuid,
        vrfName: this.vrfName,
        zoneName: '',
        ipv4Static: false,
        ipv4Dhcp: false,
        ipv4DhcpServer: false,
        ip6Static: false,
        ipv6Dhcp: false,
        dhcpv4Profile: null,
        routing: {}
      };

      if (type === 'wan') {
        this.formParam.wanInterfaces.forEach(item => {
          if (item.interfaceName.substring(6) === port) {
            item.unitInfo.push(wanUnitInfo);
          }
        });
      }
      if (type === 'lan') {
        this.formParam.lanInterfaces.forEach(item => {
          if (item.interfaceName.substring(6) === port) {
            item.unitInfo.push(lanUnitInfo);
          }
        });
      }
    },
    // interface删除
    delInface(port, id, type) {
      console.log(this.formParam[`${type}Interfaces`]);
      this.formParam[`${type}Interfaces`].forEach(item => {
        if (item.unitInfo.length === 1) {
          this.formParam[`${type}Interfaces`] = this.formParam[
            `${type}Interfaces`
          ].filter(k => {
            return k.unitInfo[0].id !== id;
          });
        } else {
          item.unitInfo = item.unitInfo.filter(k => {
            return k.id !== id;
          });
        }
      });
      if (port < 100) {
        return;
      } else {
        this[`${type}AddTotal`]--;
        if (port > 199) {
          this.lanPort.push(Number(port));
          console.log(this.lanPort);
        } else {
          this.wanPort.push(Number(port));
          console.log(this.wanPort);
        }
      }
    },
    param() {
      const ifEmit = this.formParam.lanInterfaces.every(item => {
        return item.unitInfo.every(i => {
          return i.networkName !== '';
        });
      });
      if (ifEmit) {
        this.formParam.wanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            i.subUnit = i.vlanId;
          });
        });
        this.formParam.lanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            i.subUnit = i.vlanId;
          });
        });
        this.$emit('interfaces-param', this.formParam);
      } else {
        return false;
      }
    },

    // network下拉内容
    async getNetTransport() {
      const netRes = await networkName({
        id: this.formParam.orguuid
      });

      netRes.result[0].wanNetworkGroups.forEach(item => {
        this.netTransport.set(item.name, item['transport-domains']);
      });
    },
    // 创建wan口根据根据networkname  提交transport-domains
    TraDomain(id, value) {
      if (value && value !== '+ Create WAN Network') {
        this.formParam.wanInterfaces.forEach(item => {
          item.unitInfo.forEach(i => {
            if (i.id === id) {
              i.transportDomains = this.netTransport.get(value);
            } else {
              i.transportDomains = [];
            }
          });
        });
      }
    },
    // zones下拉内容
    async getZonesName() {
      const { result } = await zonePPName({
        orgName: this.formParam.orguuid,
        objectType: 'template',
        objectName: this.formParam.orguuid + '-DataStore'
      });
      this.zonesNames = result;
    },
    // lan routing 获取
    async lanRouting() {
      const { result } = await adminSearch(this.formParam.orguuid);
      this.vrfName = result.vrfs[0].name;
    },
    // 添加network
    async addNetwork(id) {
      this.networkVisible = true;
      this.networkId = id;
    },
    // 获取新添加network值
    newNetwrok(name) {
      this.formParam.wanInterfaces.forEach(item => {
        item.unitInfo.forEach(i => {
          if (i.id === this.networkId && name) {
            i.networkName = name;
            this.getNetTransport();
          }
        });
      });
      this.networkVisible = false;
    }
  },
  filters: {
    portTitle(item) {
      if (item.id === '4') {
        return ' ';
      } else if (item.id === '3') {
        return 'W+L';
      } else {
        return item.title;
      }
    }
  },
  components: {
    selectItem,
    networkCreate
  },
  watch: {
    'lanPort.length': {
      handler(val) {
        this.$emit('wifi-port', val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.firm-factor {
  padding-top: 12px;
  .factor-title {
    color: #f9f9f9;
    font-size: 12px;
    line-height: 18px;
  }
  .factor-con {
    border: 1px solid #bbb;
    margin-top: 0px;
    padding: 0px 20px;
    padding-top: 1px;
    background-color: #fff;
    width: 600px;
    .factor-select {
      width: 85px;
      .select-title {
        font-size: 12px;
        color: #000;
        line-height: 18px;
      }
    }
    .factor-list {
      padding: 0 12px 15px;
      width: 320px;
      overflow: hidden;
      .list-item {
        width: 32px;
        text-align: center;
        float: left;
        .port-value {
          font-size: 12px;
          text-align: center;
          line-height: 18px;
          color: #000;
        }
        .port-icon {
          padding: 0 2px;
          cursor: pointer;
        }
        .port-title {
          font-size: 10px;
          color: #000;
          line-height: 18px;
        }
      }
    }
    .factor-add {
      width: 132px;
      .list-item {
        width: 40px;
        text-align: center;
        float: left;
        .port-value {
          font-size: 12px;
          text-align: center;
          line-height: 18px;
          color: #000;
        }
        .port-icon {
          padding: 0 2px;
          cursor: pointer;
          position: relative;
          span {
            position: absolute;
            font-size: 12px;
            color: #fff;
            left: 11px;
            bottom: 3px;
          }
        }
        .port-title {
          font-size: 10px;
          color: #000;
          line-height: 18px;
          text-align: left;
        }
      }
    }
  }
  .factor-table {
    margin-top: 10px;
    .mandatory {
      color: #ee6978;
      font-size: 12px;
      padding-left: 1px;
      vertical-align: top;
    }
    .wan-title {
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 0px;
      color: #fff;
    }
    .table-bordered {
      margin-bottom: 0px;
      border-radius: 4px;
      border-collapse: collapse;
      border: 1px solid #ddd;
      thead {
        tr th {
          background: #aac0d5;
          color: #0f2c3e;
          text-align: left;
          font-weight: normal;
          border: 1px solid #ddd;
          vertical-align: middle;
          padding: 0 5px;
          font-size: 12px;
        }
      }
      tbody {
        tr {
          height: 24px;
          text-align: center;
          line-height: 24px;
          font-size: 12px;
          background-color: #f5f5f5;
          td {
            padding: 0 5px;
            border: 1px solid #ddd;
            input {
              padding: 0px 3px;
              height: 20px;
              width: 95%;
              border-radius: 4px;
              color: #0f2c3e;
              font-size: 12px;
              line-height: 18px;
              border: 1px solid #b0c7d5;
              border-left: 1px solid #dee3e8;
            }
            .ant-select {
              font-size: 12px;
              width: 95%;
            }
            .inputBg1 {
              background: #0095da;
            }
            .inputBg2 {
              background: #5ec4f0;
            }
            .inputBg3 {
              background: #a7d054;
            }
            button {
              min-width: 24px;
              background: none;
              padding: 0;
              background-color: #a7d054;
              font-size: 20px !important;
              line-height: 20px;
              color: #fff;
              text-align: center;
              cursor: pointer;
              border-radius: 4px;
              border: none;
              display: inline-block;
              padding-bottom: 3px;
            }
          }
        }
      }
    }
  }
}
</style>

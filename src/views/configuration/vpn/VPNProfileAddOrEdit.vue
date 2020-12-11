<template>
  <div>
    <div class="switchover">
      <div
        v-for="tab in tabs"
        :key="tab.refObj"
        :ref="tab.refObj"
        :style="tab.style"
        class="tab-common-cls"
        @click="tabClick(tab.refObj)"
      >
        {{ tab.title }}
      </div>
      <div v-show="showTabObj.firstTabRef" class="tabpan-common-cls">
        <a-form-model
          layout="vertical"
          :model="cVPNProfile"
          :rules="rules"
          ref="normalRef"
        >
          <a-form-model-item
            :label="$t('VPNConfigFileName')"
            class="mandatory"
            prop="name"
          >
            <a-input
              size="small"
              v-model="cVPNProfile.name"
              prop="name"
              style="width:250px;"
              :disabled="cVPNProfile.tempDisabledName"
            />
          </a-form-model-item>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" :tab="$t('VPNGeneral')">
              <a-row type="flex" justify="start" align="top">
                <a-col>
                  <a-form-model-item
                    :label="$t('VPNType')"
                    class="mandatory"
                    prop="vpnType"
                  >
                    <a-select
                      v-model="cVPNProfile.vpnType"
                      style="width:250px;"
                      size="small"
                      placeholder="--Select--"
                      :default-value="cVPNProfile.vpnType"
                      @change="changeVPNType"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in vpnTypeOptions"
                        :key="index"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item :label="$t('VPNTunnelStart')">
                    <a-select
                      v-model="cVPNProfile.tunnelInitiate"
                      style="width:250px;"
                      size="small"
                      :disabled="disableTunnerStart"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in tunnelOptions"
                        :key="index"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item v-show="showRemoteServer">
                    <a-input
                      v-model="cVPNProfile.tunnelInitiate"
                      style="width:250px;"
                      size="small"
                    />
                  </a-form-model-item>
                  <a-form-model-item v-show="showRemoteServer">
                    <a-checkbox @change="changeCheckBox"></a-checkbox>
                  </a-form-model-item>
                </a-col>
                <a-col>
                  <!-- alarm -->
                  <div class="box-cls" style="width:250px;height: 190px;">
                    <div class="box-icon">Alarms</div>
                    <a-row type="flex" justify="start" align="top">
                      <a-checkbox-group
                        v-model="cVPNProfile.tempAlarms"
                        :options="alarmOptions"
                        @change="changeAlarms"
                      />
                    </a-row>
                  </div>
                </a-col>
                <a-col>
                  <a-form-model-item :label="$t('VPNHardwareAccelerator')">
                    <a-select
                      v-model="cVPNProfile.hardwareAccelerator"
                      style="width:250px;"
                      size="small"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in hardwareOptions"
                        :key="index"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    :label="$t('VPNRouteInstance')"
                    class="mandatory"
                    prop="routingInstance"
                  >
                    <a-select
                      v-model="cVPNProfile.routingInstance"
                      style="width:250px;"
                      size="small"
                      @change="changeRouteIns"
                    >
                      <a-select-option
                        v-for="(item, index) in routeOptions"
                        :value="item.value"
                        :key="index"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item :label="$t('VPNBranchSDWANCF')">
                    <a-select
                      v-model="cVPNProfile.branchSdwanProfile"
                      style="width:250px;"
                      size="small"
                      :disabled="disableBRSDWAN"
                    >
                      <a-select-option
                        :value="item.value"
                        v-for="(item, index) in brSDWCfgFileOptions"
                        :key="index"
                        >{{ item.label }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="box-cls">
                <div class="box-icon">Peer</div>
                <a-row type="flex" justify="space-between" align="top">
                  <a-col style="width:250px">
                    <a-form-model-item>
                      <a-radio-group
                        v-model="peerFQDNChecked"
                        :disabled="disablePeerFQDNRadio"
                        :options="peerOptions[0]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <div class="add-modle-item">
                        <ListCrt
                          v-if="visible"
                          ref="peerFQDNRef"
                          :list-data="FQDNList"
                          :item-data="FQDNData"
                          :title="PeerFQDN"
                          @subdata="customFQDNFunc"
                        />
                        <div
                          v-show="disablePeerFQDN"
                          class="disabled-component"
                        ></div>
                      </div>
                    </a-form-model-item>
                  </a-col>
                  <a-col style="width:250px">
                    <a-form-model-item>
                      <a-radio-group
                        v-model="peerIPChecked"
                        :disabled="disablePeerIPRadio"
                        :options="peerOptions[1]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <div class="add-modle-item">
                        <ListCrt
                          v-if="visible"
                          ref="peerIPRef"
                          crt-type="input"
                          :item-data="IPData"
                          :title="PeerIP"
                          @subdata="customIPFunc"
                        />
                        <div
                          v-show="disablePeerIP"
                          class="disabled-component"
                        ></div>
                      </div>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="peerHostChecked"
                        :disabled="disablePeerHostsRadio"
                        :options="peerOptions[2]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.peer.hostname"
                        style="width:250px;"
                        :disabled="disablePeerHost"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <br />
              <div class="box-cls">
                <div class="box-icon">Local</div>
                <a-row type="flex" justify="start" align="top">
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="localIP"
                        :options="localOptions[0]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item prop="local.address">
                      <a-input
                        size="small"
                        v-model="cVPNProfile.local.address"
                        style="width:250px;"
                        :disabled="disableLocalIP"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="localInterface"
                        :options="localOptions[1]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-select
                        size="small"
                        v-model="cVPNProfile.local.interfaceName"
                        style="width:250px;"
                        :disabled="disableLocalInterface"
                      >
                        <a-select-option
                          v-for="(item, index) in localInterfaceOptions"
                          :value="item.value"
                          :key="index"
                          >{{ item.label }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <a-radio-group
                        v-model="localHost"
                        :options="localOptions[2]"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.local.hostname"
                        style="width:250px;"
                        :disabled="disableLocalHost"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <div style="padding-top:10px;">
                <a-row type="flex" justify="start" align="top">
                  <a-col :span="8">
                    <a-form-model-item>
                      <a-radio-group
                        v-model="baseOptionVal"
                        :options="baseOptions"
                        @change="changeRadio"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row
                  type="flex"
                  justify="start"
                  align="top"
                  v-show="showBaseRoute"
                >
                  <a-col>
                    <a-form-model-item :label="$t('VPNTunnelRoutingInstance')">
                      <a-select
                        v-model="cVPNProfile.tunnelRoutingInstance"
                        style="width:250px;"
                        size="small"
                        @change="changeTunnelRouteIns"
                      >
                        <a-select-option
                          v-for="(item, index) in tunnelRouteInsOptions"
                          :value="item.value"
                          :key="index"
                          >{{ item.label }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item
                      :label="$t('VPNTunnelInterface')"
                      prop="tunnelInterface"
                      class="mandatory"
                    >
                      <a-select
                        v-model="cVPNProfile.tunnelInterface"
                        style="width:250px;"
                        size="small"
                      >
                        <a-select-option
                          v-for="(item, index) in tunnelInterfaceOptions"
                          :value="item"
                          :key="index"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row
                  type="flex"
                  justify="start"
                  align="top"
                  v-show="showBaseStrategy"
                >
                  <a-col v-show="showP2PStrategy">
                    <a-form-model-item :label="$t('VPNTunnelRoutingInstance')">
                      <a-select
                        v-model="cVPNProfile.tunnelRoutingInstance"
                        style="width:250px;"
                        size="small"
                      >
                        <a-select-option
                          :value="item.value"
                          v-for="(item, index) in tunnelRouteInsOptions"
                          :key="index"
                          >{{ item.label }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item
                      :label="$t('VPNBasePriority')"
                      prop="precedence"
                    >
                      <a-input
                        size="small"
                        placeholder="Input a number"
                        style="width:250px;"
                        v-model="cVPNProfile.precedence"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row
                  type="flex"
                  justify="start"
                  align="middle"
                  v-show="showBaseStrategy"
                >
                  <a-col :span="24">
                    <a-form-model-item :label="$t('VPNBaseStrategyCfg')">
                      <a-row type="flex" justify="end" align="middle">
                        <!--表格功能按钮-->
                        <a-col>
                          <!-- <a-row
                            :style="{ width: '425px' }"
                            type="flex"
                            justify="end"
                            align="middle"
                          >
                            <a-col
                              :style="{
                                fontSize: '18px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                color: '#fff'
                              }"
                              class="nav-item"
                            >
                              <img
                                @click="showAddWinModal"
                                width="100%"
                                src="@/assets/images/icon/add.png"
                                alt
                              />
                            </a-col>
                            <a-col
                              :style="{
                                fontSize: '18px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                color: '#fff'
                              }"
                              class="nav-item"
                            >
                              <img
                                width="100%"
                                @click="showDelWinModal"
                                src="@/assets/images/icon/delete.png"
                                alt
                              />
                            </a-col>
                          </a-row> -->
                          <Pagination
                            :total="totalCount"
                            :page-size="pageSize"
                            :search-flag="false"
                            @page-change="pageChange"
                            @page-size-change="pageSizeChange"
                            @create-item="showAddWinModal"
                            @delete-item="showDelWinModal"
                            @search="search"
                            @cancelSearch="cancelSearch"
                          />
                        </a-col>
                      </a-row>
                      <v-table
                        is-horizontal-resize
                        column-width-drag
                        :columns="strategyColumns"
                        :table-data="tableDatas"
                        :select-all="selectALLStrategy"
                        :select-change="selectChangeStrategy"
                        :height="250"
                        style="width:100%;"
                        isFrozen="true"
                        @on-custom-comp="customStrategyFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane
              key="2"
              :tab="$t('VPNAddressPool')"
              :disabled="disableAddressPool"
            >
              <a-row type="flex" justify="start" align="top">
                <a-col>
                  <a-form-model-item
                    :label="$t('VPNAddressFrom')"
                    class="mandatory"
                    prop="addressFrom"
                  >
                    <a-input
                      size="small"
                      v-model="cVPNProfile.addressFrom"
                      style="width:250px;"
                    />
                  </a-form-model-item>
                  <a-form-model-item
                    :label="$t('VPNAddressTo')"
                    class="mandatory"
                    prop="addressTo"
                  >
                    <a-input
                      size="small"
                      v-model="cVPNProfile.addressTo"
                      style="width:250px;"
                    />
                  </a-form-model-item>
                  <a-form-model-item :label="$t('VPNMask')">
                    <a-input
                      size="small"
                      v-model="cVPNProfile.mask"
                      style="width:250px;"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col>
                  <a-form-model-item>
                    <div class="add-modle-item">
                      <ListCrt
                        v-if="visible"
                        :list-data="networkList"
                        :item-data="networkData"
                        :title="$t('VPNAvailbaleNetwork')"
                        @subdata="customNetworkFunc"
                      />
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="box-cls">
                <div class="box-icon"></div>
                <a-row type="flex" justify="start" align="top">
                  <a-col>
                    <a-form-model-item>
                      <a-input
                        size="small"
                        v-model="cVPNProfile.localIP"
                        style="width:250px;"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <v-table
                        is-horizontal-resize
                        :columns="serverColumns"
                        :table-data="serverList"
                        :select-all="selectAllServer"
                        :select-change="selectChangeServer"
                        :height="150"
                        style="width:275px;"
                        isFrozen="true"
                        :title-click="serverTitleClick"
                        :cell-merge="serverCellMerge"
                        @on-custom-comp="customServerFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                  <a-col>
                    <a-form-model-item>
                      <v-table
                        is-horizontal-resize
                        :columns="domainColumns"
                        :table-data="domainList"
                        :select-all="selectAllDomain"
                        :select-change="selectChangeDomain"
                        :height="150"
                        style="width:275px;"
                        isFrozen="true"
                        :title-click="domainTitleClick"
                        :cell-merge="domainCellMerge"
                        @on-custom-comp="customDomainFunc"
                      ></v-table>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form-model>
      </div>
      <div v-show="showTabObj.secondTabRef" class="tabpan-common-cls">
        <IKE
          ref="ikeRef"
          :vpnProfile="cVPNProfile"
          :conSDWAN="conSDWAN"
          @passChildContent="ikePassContent"
          :key="ikeKey"
        ></IKE>
      </div>
      <div v-show="showTabObj.thirdTabRef" class="tabpan-common-cls">
        <IPsec
          ref="ipsecRef"
          :vpnProfile="cVPNProfile"
          @passChildContent="ipsecPassContent"
          :key="ipsecKey"
        ></IPsec>
      </div>
    </div>
    <!-- 组群弹框 -->
    <div>
      <a-modal
        v-model="delWinVisible"
        title="Confirm Decommission"
        width="430px"
        class="dele"
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
        :title="strategyTitle"
        :destroyOnClose="true"
        width="940px"
      >
        <StrategyAddOrEdit
          ref="strategyAddOrEditRef"
          :strategy="curEditStrategy"
          :name-list="strategyNameList"
          @passChildContent="passChildContent"
        ></StrategyAddOrEdit>
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
import IKE from './IKE';
import IPsec from './IPsec';
import { name, required, number } from '@/validate/common';
import ListCrt from 'components/ListCrt';
import StrategyAddOrEdit from './StrategyAddOrEdit';
import { mapState, mapMutations } from 'vuex';
import common from '@/mixins/common';
import {
  RouteInstanceQuery,
  TunnelRouteInsQuery,
  TunnelRouteInsQueryByName,
  PeerFQDNQuery,
  LocalInterfaceQuery
} from 'apis/Configuration';
export default {
  mixins: [common],
  props: ['vpnProfile'],
  components: {
    IKE,
    IPsec,
    StrategyAddOrEdit,
    ListCrt
  },
  data() {
    return {
      disablePeerIP: false,
      disablePeerFQDN: true,
      tabs: [
        {
          title: 'General',
          refObj: 'firstTabRef',
          style: {
            backgroundColor: '#aac0d5'
          }
        },
        {
          title: 'IKE',
          refObj: 'secondTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          }
        },
        {
          title: 'IPsec',
          refObj: 'thirdTabRef',
          style: {
            backgroundColor: '#8d9fb3'
          }
        }
      ],
      showTabObj: {
        firstTabRef: true,
        secondTabRef: false,
        thirdTabRef: false
      },
      PeerFQDN: 'Peer FQDN',
      PeerIP: 'Peer IP',
      cVPNProfile: {
        name: '',
        vpnType: 'branch-sdwan',
        tunnelInitiate: 'automatic',
        hardwareAccelerator: 'any',
        routingInstance: '',
        branchSdwanProfile: '',
        tunnelRoutingInstance: '',
        tunnelInterface: '',
        alarms: {
          ipsecStateChange: 'enable',
          ikeStateChange: 'enable',
          ikeAuthFailure: 'enable'
        },
        tempAlarms: ['ikeAuthFailure', 'ikeStateChange', 'ipsecStateChange'],
        local: {
          address: '',
          inet: '',
          interfaceName: '',
          hostname: ''
        },
        peer: {
          address: [],
          inet: '',
          hostname: '',
          peerFqdnList: []
        }
      },
      disableAddressPool: true,
      disableBRSDWAN: false,
      disablePeerHost: true,
      vpnTypeOptions: [
        {
          label: this.$t('VPNTypeBRSDW'),
          value: 'branch-sdwan'
        },
        {
          label: this.$t('VPNTypeBRStagingSDW'),
          value: 'branch-staging-sdwan'
        },
        {
          label: 'Branch Prestaging SDWAN',
          value: 'branch-prestaging-sdwan'
        },
        {
          label: this.$t('VPNTypeRemoteVisitClient'),
          value: 'remote-access-client'
        },
        {
          label: this.$t('VPNTypeP2P'),
          value: 'site-to-site'
        }
        /*,
        {
          label: this.$t('VPNTypeConSDW'),
          value: 'controller-sdwan'
        },
        {
          label: this.$t('VPNTypeConBSDW'),
          value: 'controller-staging-sdwan'
        },
        {
          label: this.$t('VPNTypeRemoteVisitServer'),
          value: 'remote-access-server'
        } */
      ],
      tunnelOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: this.$t('VPNTunnelAuto'),
          value: 'automatic'
        },
        {
          label: this.$t('VPNTunnelFlow'),
          value: 'traffic'
        }
      ],
      alarmOptions: [
        {
          label: 'IKE Auth Failure',
          value: 'ikeAuthFailure'
        },
        {
          label: 'IKE State Change',
          value: 'ikeStateChange'
        },
        {
          label: 'IPSec State Change',
          value: 'ipsecStateChange'
        }
      ],
      hardwareOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: this.$t('VPNAnything'),
          value: 'any'
        },
        {
          label: this.$t('VPNNothing'),
          value: 'none'
        },
        {
          label: 'Nitrox',
          value: 'nitrox'
        },
        {
          label: 'QAT',
          value: 'qat'
        }
      ],
      routeOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      brSDWCfgFileOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        },
        {
          label: 'b2b-sdwan',
          value: 'b2b-sdwan'
        }
      ],
      disableTunnerStart: false,
      disablePeerFQDNRadio: false,
      disablePeerIPRadio: false,
      disablePeerHostsRadio: false,
      peer: '2',
      peerFQDNChecked: '',
      peerIPChecked: '2',
      peerHostChecked: '',
      peerOptions: [
        [
          {
            label: this.$t('VPNPeerFQDN'),
            value: '1'
          }
        ],
        [
          {
            label: this.$t('VPNPeerIP'),
            value: '2'
          }
        ],
        [
          {
            label: this.$t('VPNPeerHost'),
            value: '3'
          }
        ]
      ],
      local: '4',
      localIP: '4',
      localInterface: '',
      localHost: '',
      localOptions: [
        [
          {
            label: this.$t('VPNLocalIP'),
            value: '4'
          }
        ],
        [
          {
            label: this.$t('VPNLocalInterface'),
            value: '5'
          }
        ],
        [
          {
            label: this.$t('VPNLocalHost'),
            value: '6'
          }
        ]
      ],
      disableLocalIP: false,
      disableLocalInterface: true,
      disableLocalHost: true,
      baseOptionVal: '7',
      base: '7',
      baseOptions: [
        {
          label: this.$t('VPNBaseRoute'),
          value: '7',
          disabled: false
        },
        {
          label: this.$t('VPNBaseStrategy'),
          value: '8',
          disabled: false
        }
      ],
      tunnelRouteInsOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      tunnelInterfaceOptions: [],
      showP2PStrategy: false,
      rules: {
        name: [{ validator: name }],
        vpnType: [{ validator: required }],
        routingInstance: [{ validator: required }],
        local: {
          address: [
            {
              pattern:
                '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^::([\\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:):([\\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){2}:([\\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){3}:([\\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$|^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$|^:((:[\\da-fA-F]{1,4}){1,6}|:)$|^[\\da-fA-F]{1,4}:((:[\\da-fA-F]{1,4}){1,5}|:)$|^([\\da-fA-F]{1,4}:){2}((:[\\da-fA-F]{1,4}){1,4}|:)$|^([\\da-fA-F]{1,4}:){3}((:[\\da-fA-F]{1,4}){1,3}|:)$|^([\\da-fA-F]{1,4}:){4}((:[\\da-fA-F]{1,4}){1,2}|:)$|^([\\da-fA-F]{1,4}:){5}:([\\da-fA-F]{1,4})?$|^([\\da-fA-F]{1,4}:){6}:$',
              message: 'Invalid Ipv4 Or Ipv6 address',
              trigger: 'blur'
            }
          ]
        },
        tunnelInterface: [{ validator: this.validateTunnelInterface }],
        precedence: [{ validator: number }],
        addressFrom: [{ validator: required }],
        addressTo: [{ validator: required }]
      },
      disablePeerInfo: false,
      selection: {
        field: 'custom',
        width: 30,
        columnAlign: 'center',
        titleAlign: 'center',
        type: 'selection'
      },
      plus: {
        field: 'plus',
        title: `<span><button class="plus" style="width:30px">+</button></span>`,
        width: 37,
        columnAlign: 'left',
        isResize: true
      },
      minus: {
        field: 'minus',
        title: `<span><button class="minus" style="width:28px">-</button></span>`,
        width: 40,
        columnAlign: 'left',
        isResize: true
      },
      FQDNList: [],
      FQDNData: [],
      IPData: [],
      showBaseRoute: true,
      showBaseStrategy: false,
      totalCount: 0,
      pageIndex: 1,
      pageSize: 20,
      delLoading: false,
      addOrEditLoading: false,
      addOrEditWinVisible: false,
      delWinVisible: false,
      strategyTitle: '',
      strategyColumns: [
        {
          field: 'custom',
          width: 30,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: this.$t('VPNStrategyName'),
          width: 120,
          columnAlign: 'left',
          isResize: true,
          componentName: 'strategy-opration'
        },
        {
          field: 'protocol',
          title: this.$t('VPNStrategyAgreement'),
          width: 120,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'src',
          title: this.$t('VPNStrategySource'),
          width: 120,
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'dst',
          title: this.$t('VPNStrategyDest'),
          width: 120,
          columnAlign: 'left',
          isResize: true
        }
      ],
      strategyNameList: [],
      strategyList: [{}],
      tableDatas: [{}],
      delStrategyList: [],
      curEditStrategy: {},
      curAddStrategy: {},
      networkList: [],
      networkData: [],
      delNetworkList: [],
      serverList: [{}],
      delServerList: [],
      domainList: [{}],
      delDomainList: [],
      conSDWAN: false,
      showRemoteServer: false,
      localInterfaceOptions: [
        {
          label: this.$t('SelectNull'),
          value: ''
        }
      ],
      tunnelInfcIsRequired: true,
      visible: true,
      ikeKey: 'firstIke',
      ipsecKey: 'firstIpsec'
    };
  },
  computed: {
    serverColumns() {
      let column = {
        field: 'server',
        title: this.$t('VPNServer'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'server-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    domainColumns() {
      let column = {
        field: 'domain',
        title: this.$t('VPNDomain'),
        width: 120,
        columnAlign: 'left',
        isResize: true,
        componentName: 'domain-opration'
      };
      return [this.selection, column, this.plus, this.minus];
    },
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  created() {
    if (this.vpnProfile.name) {
      this.cVPNProfile = { ...this.vpnProfile };
      this.cVPNProfile.peer.peerFqdnList &&
        this.cVPNProfile.peer.peerFqdnList.forEach(peerFqdn => {
          this.FQDNData.push(peerFqdn);
        });
      this.cVPNProfile.peer.address &&
        this.cVPNProfile.peer.address.forEach(peerIp => {
          this.IPData.push(peerIp);
        });
      this.cVPNProfile.tempAlarms = [];
      if (this.cVPNProfile.alarms) {
        for (let key in this.cVPNProfile.alarms) {
          this.cVPNProfile.alarms[key] === 'enable'
            ? this.cVPNProfile.tempAlarms.push(key)
            : '';
        }
      }
      let targetValue = this.vpnProfile.local.address
        ? '4'
        : this.vpnProfile.local.interfaceName
        ? '5'
        : '6';
      this.changeRadio({ target: { value: targetValue } });
      targetValue = this.vpnProfile.tunnelRoutingInstance ? '7' : '8';
      this.changeRadio({ target: { value: targetValue } });
    }
    // 设置VPN Type
    this.changeVPNType(this.cVPNProfile.vpnType);
    this.queryRouteInsOptions();
    this.queryTunnelRouteInsOptions();
    this.queryPeerFQDN();
    this.queryLocalInterfaceOptions();
    this.queryTunnelInterfaceOptions();
  },
  methods: {
    ...mapMutations(['vpnTableSelectsMinus', 'vpnTableSelectsAll']),
    getData() {
      this.$refs.ikeRef.getData();
      console.log('ike: ', this.cVPNProfile);
      this.$refs.ipsecRef.getData();
      console.log('ipsec: ', this.cVPNProfile);
      let data = { ...this.cVPNProfile };
      switch (this.peer) {
        case '1':
          delete data.peer.address;
          delete data.peer.hostname;
          break;
        case '2':
          delete data.peer.peerFqdnList;
          delete data.peer.hostname;
          break;
        default:
          delete data.peer.peerFqdnList;
          delete data.peer.address;
      }
      switch (this.local) {
        case '4':
          delete data.local.interfaceName;
          delete data.local.hostname;
          break;
        case '5':
          delete data.local.address;
          delete data.local.hostname;
          break;
        default:
          delete data.local.address;
          delete data.local.interfaceName;
      }
      switch (this.base) {
        case '7':
          delete data.precedence;
          delete data.rule;
          break;
        default:
          !this.showP2PStrategy ? delete data.tunnelRoutingInstance : null;
      }
      console.log('getdata:', data);
      this.$emit('passChildContent', data);
    },
    validateTunnelInterface(rule, value, callback) {
      if (this.tunnelInfcIsRequired && !value) {
        return callback(new Error('Tunnel Interface is required'));
      }
    },
    async queryRouteInsOptions() {
      const res = await RouteInstanceQuery({ deviceName: this.deviceName });
      if (res.message === 'Success') {
        console.log('routing-instance = ', res.result['routing-instance']);
        this.existInterfaceRoute = new Map();
        this.nExistInterfaceRoute = new Map();
        res.result['routing-instance'].forEach(item => {
          if (item.name) {
            let option = {
              label: item.name,
              value: item.name
            };
            this.routeOptions.push(option);
            if (item.interfaces) {
              let interfaces = item.interfaces.map(item => {
                return {
                  label: item,
                  value: item
                };
              });
              this.existInterfaceRoute.set(item.name, interfaces);
            } else {
              this.nExistInterfaceRoute.set(item.name, item.networks);
            }
          }
        });
      }
    },
    async queryPeerFQDN() {
      const res = await PeerFQDNQuery({
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization,
        offset: 0,
        limit: 10000
      });
      if (res.message === 'Success') {
        let addressList = res.result.data;
        addressList.forEach(item => {
          if (item.type === 'fqdn') {
            this.FQDNList.push(item.name);
          }
        });
      }
    },
    // 查询隧道路由实例接口
    async queryTunnelRouteInsOptions() {
      const res = await TunnelRouteInsQuery({
        orgName: this.organization,
        deviceName: this.deviceName
      });
      if (res.message === 'Success') {
        console.log('available-routing-instances = ', res.result);
        this.allTunnelRouteInsNames = res.result;
        this.allTunnelRouteInsNames.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name
          };
          this.tunnelRouteInsOptions.push(obj);
        });
      }
    },
    async queryLocalInterfaceOptions() {
      const res = await LocalInterfaceQuery({ deviceName: this.deviceName });
      if (res.message === 'Success') {
        console.log('networks = ', res.result['network']);
        this.allLocalInterfaceList = res.result['network'];
      }
    },
    async queryTunnelInterfaceOptions() {
      const res = await TunnelRouteInsQueryByName({
        deviceName: this.deviceName
      });
      if (res.message === 'Success') {
        console.log('interfaces = ', res.result['interfaces']);
        this.allTunnelInterfaceList = res.result['interfaces'];
      }
    },
    changeTunnelRouteIns(value) {
      this.cVPNProfile.tunnelInterface = '';
      if (value) {
        this.allTunnelRouteInsNames.forEach(item => {
          if (item.name === value) {
            console.log(item);
            this.tunnelInterfaceOptions = item.interfacce;
          }
        });
      } else {
        this.tunnelInterfaceOptions = [];
      }
    },
    changeRouteIns(value) {
      if (this.existInterfaceRoute.get(value)) {
        this.localInterfaceOptions = [...this.existInterfaceRoute.get(value)];
        this.localInterfaceOptions.unshift({
          label: this.$t('SelectNull'),
          value: ''
        });
      } else {
        let networks = this.nExistInterfaceRoute.get(value);
        this.localInterfaceOptions = [];
        networks &&
          networks.forEach(item => {
            for (let i = 0; i < this.allLocalInterfaceList.length; i++) {
              if (item === this.allLocalInterfaceList[i].name) {
                this.allLocalInterfaceList[i].interfaces.forEach(item2 => {
                  let option = {
                    label: item2,
                    value: item2
                  };
                  this.localInterfaceOptions.push(option);
                });
                break;
              }
            }
          });
        this.localInterfaceOptions.unshift({
          label: this.$t('SelectNull'),
          value: ''
        });
      }
      this.cVPNProfile.local.interfaceName = '';
    },
    changeAlarms(checkedValues) {
      for (let key in this.cVPNProfile.alarms) {
        this.cVPNProfile.alarms[key] = 'disable';
      }
      let _that = this;
      checkedValues.forEach(checked => {
        for (let key in _that.cVPNProfile.alarms) {
          if (key === checked) {
            _that.cVPNProfile.alarms[key] = 'enable';
            break;
          }
        }
      });
    },
    changeCheckBox(e) {
      console.log('changeCheckBox e.target.checked = ', e.target.checked);
    },
    tabClick(ref) {
      this.changeTab(ref);
    },
    changeTab(curRef) {
      for (let ref in this.showTabObj) {
        if (ref === curRef) {
          this.showTabObj[ref] = true;
          this.$refs[ref][0].style.backgroundColor = '#aac0d5';
          if (curRef === 'secondTabRef') {
            this.ikeKey = 'secondIke';
          } else if (curRef === 'thirdTabRef') {
            this.ipsecKey = 'secondIpsec';
          } else {
            this.ikeKey = 'firstIke';
            this.ipsecKey = 'firstIpsec';
          }
        } else {
          this.showTabObj[ref] = false;
          this.$refs[ref][0].style.backgroundColor = '#8d9fb3';
        }
      }
    },
    changeVPNType(value) {
      switch (value) {
        case 'branch-sdwan':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = false;
          this.baseOptions[1].disabled = true;
          this.showP2PStrategy = false;
          this.baseOptionVal = '7';
          this.showBaseRoute = true;
          this.showBaseStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'controller-sdwan':
          this.conSDWAN = true;
          this.peerInfoEnableOrDisable(true);
          this.disableTunnerStart = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'controller-staging-sdwan':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(true);
          this.disableTunnerStart = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'remote-access-client':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = false;
          break;
        case 'site-to-site':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = true;
          this.showRemoteServer = false;
          break;
        case 'remote-access-server':
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(true);
          this.disableTunnerStart = false;
          this.disableAddressPool = false;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = false;
          this.showP2PStrategy = false;
          this.showRemoteServer = true;
          break;
        default:
          this.conSDWAN = false;
          this.peerInfoEnableOrDisable(false);
          this.disableTunnerStart = false;
          this.disableAddressPool = true;
          this.disableBRSDWAN = true;
          this.baseOptions[1].disabled = true;
          this.showP2PStrategy = false;
          this.baseOptionVal = '7';
          this.showBaseRoute = true;
          this.showBaseStrategy = false;
          this.showRemoteServer = false;
          break;
      }
    },
    peerInfoEnableOrDisable(disabled) {
      this.disablePeerInfo = disabled;
      this.disablePeerFQDNRadio = disabled;
      this.disablePeerIPRadio = disabled;
      this.disablePeerHostsRadio = disabled;
      if (!disabled) {
        let checked = this.peerFQDNChecked
          ? this.peerFQDNChecked
          : this.peerIPChecked
          ? this.peerIPChecked
          : this.peerHostChecked;
        this.changeRadio({ target: { value: checked } });
      }
    },
    changeRadio(e) {
      switch (e.target.value) {
        // 对等FQDN
        case '1':
          this.peer = '1';
          this.peerFQDNChecked = '1';
          this.peerIPChecked = '';
          this.peerHostChecked = '';
          this.disablePeerFQDN = false;
          this.disablePeerIP = true;
          this.disablePeerHost = true;
          break;
        // 对等IP
        case '2':
          this.peer = '2';
          this.peerFQDNChecked = '';
          this.peerIPChecked = '2';
          this.peerHostChecked = '';
          this.disablePeerFQDN = true;
          this.disablePeerIP = false;
          this.disablePeerHost = true;
          break;
        // 对等Host
        case '3':
          this.peer = '3';
          this.peerFQDNChecked = '';
          this.peerIPChecked = '';
          this.peerHostChecked = '3';
          this.disablePeerFQDN = true;
          this.disablePeerIP = true;
          this.disablePeerHost = false;
          break;
        // 本地IP
        case '4':
          this.local = '4';
          this.localIP = '4';
          this.localInterface = '';
          this.localHost = '';
          this.disableLocalIP = false;
          this.disableLocalInterface = true;
          this.disableLocalHost = true;
          break;
        case '5':
          this.local = '5';
          this.localIP = '';
          this.localInterface = '5';
          this.localHost = '';
          this.disableLocalIP = true;
          this.disableLocalInterface = false;
          this.disableLocalHost = true;
          break;
        case '6':
          this.local = '6';
          this.localIP = '';
          this.localInterface = '';
          this.localHost = '6';
          this.disableLocalIP = true;
          this.disableLocalInterface = true;
          this.disableLocalHost = false;
          break;
        // 基于路由
        case '7':
          this.base = '7';
          this.baseOptionVal = '7';
          this.tunnelInfcIsRequired = true;
          this.showBaseRoute = true;
          this.showBaseStrategy = false;
          break;
        // 基于策略
        case '8':
          this.base = '8';
          this.baseOptionVal = '8';
          this.tunnelInfcIsRequired = false;
          this.showBaseRoute = false;
          this.showBaseStrategy = true;
          this.strategyList = this.cVPNProfile.rule
            ? this.cVPNProfile.rule
            : [];
          this.totalCount = this.strategyList.length;
          this.queryStrategyList();
          this.strategyList.length &&
            this.strategyList.forEach(strategy => {
              this.strategyNameList.push(strategy.name);
            });
          break;
        default:
          break;
      }
    },
    customIPFunc(params) {
      if (params.length > 1) {
        this.cVPNProfile.peer.address = params;
        this.cVPNProfile.peer.inet = params.pop();
      } else {
        this.cVPNProfile.peer.address = params;
      }
    },
    customFQDNFunc(params) {
      if (params) {
        this.cVPNProfile.peer.peerFqdnList = params;
      }
    },
    customNetworkFunc(params) {
      this.networkData = params;
    },
    selectAllServer(checkdList) {
      this.delServerList = [];
      checkdList.forEach(item => {
        this.delServerList.push(item['server']);
      });
    },
    selectChangeServer(checked) {
      this.delServerList = [];
      checked.forEach(item => {
        this.delServerList.push(item['server']);
      });
    },
    serverTitleClick() {},
    serverCellMerge() {},
    customServerFunc(params) {
      this.serverList[params.index]['server'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.serverList = [...this.serverList];
      // 隐藏store里下拉框已被使用的option
      this.vpnTableSelectsMinus({
        key: 'vpnServer',
        label: params.label
      });
    },
    selectAllDomain(checkdList) {
      this.delDomainList = [];
      checkdList.forEach(item => {
        this.delDomainList.push(item['server']);
      });
    },
    selectChangeDomain(checked) {
      this.delDomainList = [];
      checked.forEach(item => {
        this.delDomainList.push(item['server']);
      });
    },
    domainTitleClick() {},
    domainCellMerge() {},
    customDomainFunc(params) {
      this.domainList[params.index]['server'] = params.label;
      // 通过刷新表格数据，实现对子组件刷新
      this.domainList = [...this.domainList];
      // 隐藏store里下拉框已被使用的option
      this.vpnTableSelectsMinus({
        key: 'vpnDomain',
        label: params.label
      });
    },
    showAddWinModal() {
      this.operType = 'add';
      this.strategyTitle = 'Add Strategy';
      this.curEditStrategy = {};
      this.curAddStrategy = {};
      this.addOrEditWinVisible = true;
    },
    passChildContent(strategy) {
      this.curAddStrategy = strategy;
    },
    showDelWinModal() {
      this.delWinVisible = true;
    },
    async delOK() {
      this.delWinVisible = false;
      this.delStrategyList.forEach(item => {
        for (let i = 0; i < this.strategyList.length; i++) {
          if (item === this.strategyList[i].name) {
            this.strategyList.splice(i, 1);
          }
        }
        let nameIndex = this.strategyNameList.indexOf(item);
        nameIndex > -1 ? this.strategyNameList.splice(nameIndex, 1) : null;
      });
      this.cVPNProfile.rule = this.strategyList;
      this.pageIndex = 1;
      this.queryStrategyList();
    },
    delCancel() {
      this.delWinVisible = false;
    },
    async addOrEditOK() {
      let isOK = this.satisfyValidation();
      if (isOK) {
        this.addOrEditLoading = true;
        let params =
          this.operType === 'add' ? this.curAddStrategy : this.curEditStrategy;
        this.addOrEditLoading = false;
        this.addOrEditWinVisible = false;
        if (this.operType === 'edit') {
          this.strategyList.forEach(item => {
            if (item.name === params.name) {
              item = params;
            }
          });
        } else {
          this.strategyList.push(params);
        }
        
        this.strategyNameList.push(params.name);
        this.cVPNProfile.rule = this.strategyList;
        this.pageIndex = 1;
        this.queryStrategyList();
      }
    },
    satisfyValidation() {
      let isOK = true;
      this.$refs.strategyAddOrEditRef.$refs.strategyForm.validate(valid => {
        if (!valid) {
          isOK = false;
          return false;
        }
      });
      return isOK;
    },
    addOrEditCancel() {
      this.addOrEditWinVisible = false;
      this.curEditStrategy = {};
      this.curAddStrategy = {};
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.queryStrategyList();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.queryStrategyList();
    },
    queryStrategyList() {
      let tableDatas = [];
      if (
        this.strategyList.length &&
        this.strategyList.length > this.pageSize
      ) {
        let start = (this.pageIndex - 1) * this.pageSize;
        let end = start + this.pageSize;
        tableDatas = this.strategyList.slice(start, end);
      } else {
        tableDatas = this.strategyList;
      }

      this.tableDatas = [];
      if (tableDatas.length) {
        this.tableDatas = tableDatas.map(row => {
          let newRow = {};
          newRow.src = row.src.inet;
          newRow.dst = row.dst.inet;
          newRow.name = row.name;
          newRow.protocol = row.protocol;
          return newRow;
        });
      }
      this.totalCount = this.strategyList.length;
    },
    selectALLStrategy(checkdList) {
      this.delStrategyList = [];
      checkdList.forEach(item => {
        this.delStrategyList.push(item['name']);
      });
    },
    selectChangeStrategy(checked) {
      this.delStrategyList = [];
      checked.forEach(item => {
        this.delStrategyList.push(item['name']);
      });
    },
    customStrategyFunc(params) {
      this.operType = 'edit';
      let row = this.strategyList.find(rule => {
        return params.rowData.name === rule.name;
      });
      this.curEditStrategy = row;
      this.curEditStrategy.disabledName = true;
      this.strategyTitle = 'Edit Strategy';
      this.addOrEditWinVisible = true;
    },
    ikePassContent(ikeVPNProfile) {
      Object.assign(this.cVPNProfile, ikeVPNProfile);
    },
    ipsecPassContent(ipsecVPNProfile) {
      Object.assign(this.cVPNProfile, ipsecVPNProfile);
    }
  }
};
let props = {
  rowData: {
    type: Object
  },
  field: {
    type: String
  },
  index: {
    type: Number
  }
};
Vue.component('network-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['network']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnNetwork"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['network'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'network',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('server-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['server']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnServer"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['server'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'server',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('domain-opration', {
  template: `<span>
      <a-select
        v-if="!rowData['domain']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.vpnDomain"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <label>{{ rowData['domain'] }} </label>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects'])
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'domain',
        index: this.index,
        rowData: this.rowData,
        label
      };
      this.$emit('on-custom-comp', params);
    }
  }
});
Vue.component('strategy-opration', {
  template: `<span>
    <a href="" @click.stop.prevent="update(rowData,index)">{{ rowData.name }}</a>
    </span>`,
  props,
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
.nav-item {
  padding: 0 8px;
  width: 32px;
  // border-right: 1px solid #97acbe;
  img {
    // margin-bottom: 5px;
    // background-color: #fff;
    color: #fff;
    background: #fff;
  }
  // .disabled {
  //   opacity: 0.4;
  // }
}
.dele {
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
  // 按钮
  /deep/.ant-btn-primary {
    width: 70px;
    height: 30px;
    background-color: #a7d054;
    border: none;
    font-size: 12px;
  }
  /deep/.ant-btn-danger {
    width: 70px;
    height: 30px;
    background-color: #3f4a5b;
    border: none;
    color: #ffffff;
    font-size: 12px;
  }
  /deep/.ant-modal-title {
    font-size: 12px;
    margin-left: -12px;
  }
  /deep/.ant-modal-close-x {
    line-height: 36px;
    width: 40px;
  }
}
.no-border {
  border-right: 0;
}
.switchover {
  overflow: hidden;
  & > div {
    cursor: pointer;
  }
  .tab-common-cls {
    width: 50px;
    height: 22px;
    border-radius: 5px 3px 0px 0px;
    line-height: 22px;
    text-align: center;
    float: left;
  }
  .devcfg-tab-selected {
    background-color: #aac0d5;
  }
  .devcfg-tab-default {
    background-color: #8d9fb3;
  }
  .add-modle-item {
    width: 300px;
    height: 140px;
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
    background: #fff;
    .disabled-component {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #8fa7b7;
      cursor: not-allowed;
      opacity: 0.5;
      top: 0;
      left: 0;
    }
  }
}
.mandatory {
  color: #ee6978;
  font-size: 11px;
  padding-left: 1px;
  vertical-align: top;
}
.tabpan-common-cls {
  clear: both;
  border-top: 1px solid #8d9fb3;
  padding: 10px;
  .box-cls {
    min-height: 78px;
    border-radius: 5px;
    border: solid 3px #456880;
    position: relative;
    padding: 10px;
    .box-icon {
      width: 80px;
      height: 21px;
      background-color: #507691;
      border-radius: 5px;
      position: absolute;
      left: 29px;
      top: -12px;
      line-height: 21px;
      text-align: center;
      color: #fff;
    }
    // 多选框换行
    /deep/.ant-checkbox-wrapper {
      display: block;
      margin-bottom: 20px;
      color: #fff;
    }
    /deep/.ant-form-vertical .ant-form-item {
      padding: 0;
      margin: 0;
    }
  }
}
/deep/.ant-form-item-label > label {
  color: #fff;
}
/deep/.ant-form-vertical .ant-form-item {
  margin-bottom: 8px;
}
/deep/.ant-col {
  padding-right: 10px;
}
/deep/.ant-radio-wrapper {
  color: #fff;
}
/deep/.mandatory.ant-form-item {
  .ant-form-item-label {
    label {
      &::after {
        content: '*';
        color: #ee6978;
        position: absolute;
        right: -17px;
        font-size: 14px;
        padding-left: 1px;
        display: block !important;
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
</style>

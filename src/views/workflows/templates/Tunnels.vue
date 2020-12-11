<template>
  <div>
    <a-row
      class="tableSub"
      data-text="Split Tunnels"
      style="margin: 5px 0 20px;"
    >
      <a-col
        class="splitTable"
        :class="{ shadow: tunnelsData.vrfName.length < 1 }"
      >
        <a-form-model
          ref="formSpl"
          :rules="rulesSpl"
          :model="splCrt"
          @validate="validate"
          hideRequiredMark
        >
          <table>
            <thead>
              <tr>
                <th>
                  <span>VRF Names</span>
                </th>
                <th>
                  <span>WAN Interfaces</span>
                </th>
                <th style="width: 87px;">
                  <span>DIA</span>
                </th>
                <th style="width: 167px;">
                  <span>Gateway</span>
                </th>
                <th style="width: 112px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  @mouseenter="enter('vrfName')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="vrfName">
                    <a-select v-model="splCrt.vrfName">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in tunnelsData.vrfName"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td
                  @mouseenter="enter('wanNetworkName')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="wanNetworkName">
                    <a-select v-model="splCrt.wanNetworkName">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in tunnelsData.networkNameWall"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-checkbox v-model="splCrt.dia" />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-checkbox v-model="splCrt.gateway" />
                  </a-form-model-item>
                </td>
                <td class="addBtn">
                  <button @click="addParam('split')">+</button>
                </td>
              </tr>
              <tr v-for="item in splParam" :key="item.id">
                <td>{{ item.vrfName }}</td>
                <td>{{ item.wanNetworkName }}</td>
                <td>
                  <input
                    :checked="item.dia ? 'checked' : ''"
                    type="checkbox"
                    disabled
                  />
                </td>
                <td>
                  <input
                    :checked="item.gateway ? 'checked' : ''"
                    type="checkbox"
                    disabled
                  />
                </td>
                <td class="delBtn">
                  <a href="javascript:;" @click="delParam(item.id, 'spl')"
                    ><img src="@/assets/images/organize/del.png" alt
                  /></a>
                </td>
              </tr>
            </tbody>
          </table>
        </a-form-model>
      </a-col>
    </a-row>
    <a-row class="tableSub" data-text="Site to Site Tunnels">
      <a-col
        class="siteTable"
        :class="{ shadow: tunnelsData.vrfName.length < 1 }"
      >
        <a-form-model
          ref="formSite"
          :rules="rulesSite"
          :model="siteCrt"
          @validate="validate"
          hideRequiredMark
        >
          <table>
            <thead>
              <tr>
                <th>
                  <span>Name</span>
                </th>
                <th>
                  <span>Peer Type</span>
                </th>
                <th>
                  <span>WAN/LAN Network</span>
                </th>
                <th>
                  <span>LAN VRF</span>
                </th>
                <th>
                  <span>Vpn Profile</span>
                </th>
                <th>
                  <span>BGP Enabled</span>
                </th>
                <th style="width: 50px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a-form-model-item prop="name">
                    <a-input
                      @mouseenter="enter('name')"
                      @mouseleave="leave"
                      @mousemove="updateXY"
                      v-model="siteCrt.name"
                    />
                  </a-form-model-item>
                </td>
                <td
                  @mouseenter="enter('peerType')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="peerType">
                    <a-select @change="peerChange" v-model="siteCrt.peerType">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option value="AzurevWAN"
                        >AzurevWAN</a-select-option
                      >
                      >
                      <a-select-option value="Unmanaged"
                        >Unmanaged</a-select-option
                      >
                      >
                      <a-select-option value="ZscalerUnmanaged"
                        >ZscalerUnmanaged</a-select-option
                      >
                      >
                    </a-select>
                  </a-form-model-item>
                </td>

                <td
                  @mouseenter="enter('networkName')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="networkName">
                    <a-select v-model="siteCrt.networkName">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in networkNameWL"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>

                <td
                  @mouseenter="enter('lanVrf')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="lanVrf">
                    <a-select v-model="siteCrt.lanVrf">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in tunnelsData.vrfName"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-select
                      :disabled="vpnDisabled"
                      v-model="siteCrt.vpnProfileName"
                    >
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in vpnProfiles"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-checkbox v-model="siteCrt.bgpEnabled" />
                  </a-form-model-item>
                </td>
                <td class="addBtn">
                  <button @click="addParam('site')">+</button>
                </td>
              </tr>
              <tr v-for="item in siteParam" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.peerType }}</td>
                <td v-if="item.networkName">{{ item.networkName }}</td>
                <td v-else>{{ item.wanNetwork }}</td>
                <td>{{ item.lanVrf }}</td>
                <td>{{ item.vpnProfileName }}</td>
                <td>
                  <input
                    :checked="item.bgpEnabled ? 'checked' : ''"
                    type="checkbox"
                    disabled
                  />
                </td>
                <td class="delBtn">
                  <a href="javascript:;" @click="delParam(item.id, 'site')"
                    ><img src="@/assets/images/organize/del.png" alt
                  /></a>
                </td>
              </tr>
            </tbody>
          </table>
        </a-form-model>
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
  </div>
</template>

<script>
import tip from '@/mixins/tip';
export default {
  mixins: [tip],
  props: {
    tunnelsData: {
      type: Object
    }
  },
  data() {
    return {
      splCrt: {
        id: this.guid() + 'spl',
        vrfName: '',
        wanNetworkName: '',
        dia: false,
        gateway: false
      },
      splParam: this.tunnelsData.spldata,
      rulesSpl: {
        vrfName: [{ required: true, message: 'field required' }],
        wanNetworkName: [{ required: true, message: 'field required' }]
      },

      siteCrt: {
        id: this.guid() + 'site',
        name: '',
        peerType: '',
        networkName: '',
        wanNetwork: null,
        lanVrf: '',
        vpnProfileName: '',
        bgpEnabled: false
      },
      siteParam: this.tunnelsData.sitedata,
      rulesSite: {
        name: [{ required: true, message: 'field required' }],
        peerType: [{ required: true, message: 'field required' }],
        networkName: [{ required: true, message: 'field required' }],
        lanVrf: [{ required: true, message: 'field required' }]
      },
      networkNameWL: [],
      vpnProfiles: [],
      vpnDisabled: true
    };
  },
  methods: {
    addParam(type) {
      switch (true) {
        // split数据
        case type === 'split':
          this.$refs.formSpl.validate(valid => {
            if (valid) {
              if (this.splParam.length > 0) {
                const hasItem = this.splParam.some(item => {
                  return item.vrfName === this.splCrt.vrfName;
                });
                if (!hasItem) {
                  this.splParam.push({ ...this.splCrt });
                }
              } else {
                this.splParam.push({ ...this.splCrt });
              }
              this.splCrt = {
                id: this.guid() + 'spl',
                vrfName: '',
                wanNetworkName: '',
                dia: false,
                gateway: false
              };
            }
          });
          break;
        case type === 'site':
          this.$refs.formSite.validate(valid => {
            if (valid) {
              if (this.siteParam.length > 0) {
                const hasItem = this.siteParam.some(item => {
                  return item.name === this.siteCrt.name;
                });
                if (!hasItem) {
                  if (this.siteCrt.peerType === 'AzurevWAN') {
                    this.siteCrt.wanNetwork = this.siteCrt.networkName;
                    this.siteCrt.networkName = null;
                  }
                  this.siteParam.push({ ...this.siteCrt });
                }
              } else {
                if (this.siteCrt.peerType === 'AzurevWAN') {
                  this.siteCrt.wanNetwork = this.siteCrt.networkName;
                  this.siteCrt.networkName = null;
                }
                this.siteParam.push({ ...this.siteCrt });
              }
              this.siteCrt = {
                id: this.guid() + 'site',
                name: '',
                peerType: '',
                networkName: '',
                wanNetwork: null,
                lanVrf: '',
                vpnProfileName: '',
                bgpEnabled: false
              };
            }
          });
          break;
      }
    },
    delParam(id, type) {
      switch (true) {
        case type === 'spl':
          this.splParam = this.splParam.filter(item => {
            return item.id !== id;
          });
          break;
        case type === 'site':
          this.siteParam = this.siteParam.filter(item => {
            return item.id !== id;
          });
          break;
      }
    },
    peerChange(value) {
      if (value === '') {
        this.networkNameW = [];
      } else if (value === 'AzurevWAN') {
        this.networkNameWL = this.tunnelsData.networkNameWall;
        this.vpnDisabled = true;
        this.siteCrt.vpnProfileName = '';
      } else {
        this.networkNameWL = this.tunnelsData.networkName;
        this.siteCrt.wanNetwork = null;
        this.vpnDisabled = false;
      }
    },
    param() {
      this.$emit('tunnels-param', this.splParam, this.siteParam);
    }
  }
};
</script>

<style lang="scss" scoped>
.splitTable {
  height: 175px;
  background: #fff;
  th {
    width: 421px;
  }
}
.siteTable {
  height: 170px;
  background: #fff;
  th {
    width: 208px;
  }
}
</style>

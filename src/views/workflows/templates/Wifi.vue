<template>
  <div>
    <div
      class="errorMsg"
      v-show="
        wifiParam.wifi2d4GhzInfo.enable === false &&
          wifiParam.wifi5GhzInfo.enable === false
      "
    >
      Please enable at least one Frequency (2.4 GHz or 5 GHz).
    </div>
    <a-row :style="{ paddingTop: '16px' }" type="flex" justify="space-between">
      <a-col class="ghzitem">
        <div class="checkGhz">
          <a-checkbox
            size="small"
            v-model="wifiParam.wifi2d4GhzInfo.enable"
          />2.4Ghz
        </div>
        <a-row class="selectGhz" type="flex" justify="space-between">
          <a-col :style="{ width: '185px' }">
            <label>Country</label>
            <a-select
              :disabled="!wifiParam.wifi2d4GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi2d4GhzInfo.countryName"
            >
              <a-select-option value="" selected>--Select--</a-select-option>
              <a-select-option value="CN-China">CN-China</a-select-option>
            </a-select>
          </a-col>
          <a-col :style="{ width: '136px' }">
            <label>Wireless Protocol</label>
            <a-select
              :disabled="!wifiParam.wifi2d4GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi2d4GhzInfo.protocol"
            >
              <a-select-option value="" selected>--Select--</a-select-option>
              <a-select-option value="b-2.4GHz">b-2.4GHz</a-select-option>
              <a-select-option value="g-2.4GHz">g-2.4GHz</a-select-option>
              <a-select-option value="n-2.4GHz">n-2.4GHz</a-select-option>
            </a-select>
          </a-col>
          <a-col :style="{ width: '86px' }">
            <label>Channel</label>
            <a-select
              :disabled="!wifiParam.wifi2d4GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi2d4GhzInfo.channel"
            >
              <a-select-option value="" selected>--Select--</a-select-option>
              <a-select-option value="auto">auto</a-select-option>
              <a-select-option
                :value="index"
                v-for="index of 11"
                :key="index"
                >{{ index }}</a-select-option
              >
            </a-select>
          </a-col>
          <a-col :style="{ width: '136px' }">
            <label>Channel Width</label>
            <a-select
              :disabled="!wifiParam.wifi2d4GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi2d4GhzInfo.channelWidth"
            >
              <a-select-option value="" selected>--Select--</a-select-option>
              <a-select-option value="40MHz">40MHz</a-select-option>
              <a-select-option value="20MHz">20MHz</a-select-option>
              <a-select-option value="20/40MHz">20/40MHz</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-col>
      <a-col class="ghzitem">
        <div class="checkGhz">
          <a-checkbox
            size="small"
            v-model="wifiParam.wifi5GhzInfo.enable"
          />5Ghz
        </div>
        <a-row class="selectGhz" type="flex" justify="space-between">
          <a-col :style="{ width: '185px' }">
            <label>Country</label>
            <a-select
              :disabled="!wifiParam.wifi5GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi5GhzInfo.countryName"
            >
              <a-select-option value="" selected>--Select--</a-select-option>
              <a-select-option value="CN-China">CN-China</a-select-option>
            </a-select>
          </a-col>
          <a-col :style="{ width: '185px' }">
            <label>Wireless Protocol</label>
            <a-select
              :disabled="!wifiParam.wifi5GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi5GhzInfo.protocol"
            >
              <a-select-option value="n-5GHz">n-5GHz</a-select-option>
              <a-select-option value="ac-5GHz">ac-5GHz</a-select-option>
            </a-select>
          </a-col>
          <a-col :style="{ width: '185px' }">
            <label>Channel</label>
            <a-select
              :disabled="!wifiParam.wifi5GhzInfo.enable"
              size="small"
              v-model="wifiParam.wifi5GhzInfo.channel"
            >
              <a-select-option value="" selected>--Select--</a-select-option>
              <a-select-option value="auto">auto</a-select-option>
              <a-select-option value="149">149</a-select-option>
              <a-select-option value="153">153</a-select-option>
              <a-select-option value="157">157</a-select-option>
              <a-select-option value="161">161</a-select-option>
              <a-select-option value="165">165</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="tableSub" style="margin:5px 0 20px">
      <a-col class="wifiTable">
        <table>
          <thead>
            <tr>
              <th>
                <span>Network Name</span>
              </th>
              <th>
                <span>SSID Name</span>
              </th>
              <th>
                <span>Broadcast SSID</span>
              </th>
              <th>
                <span>Frequency</span>
              </th>
              <th>
                <span>Security Mode</span>
              </th>
              <th>
                <span>Encryption Type</span>
              </th>
              <th>
                <span>Password</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in wifiParam.ssid" :key="item.networkName">
              <td>{{ item.networkName }}</td>
              <td>
                <a-input size="small" v-model="item.ssidName" />
              </td>
              <td>
                <a-checkbox size="small" v-model="item.broadcastSsid" />
              </td>
              <td>
                <a-select size="small" v-model="item.frequency">
                  <a-select-option value="" selected
                    >--Select--</a-select-option
                  >
                  <a-select-option value="2.4-GHz">2.4-GHz</a-select-option>
                  <a-select-option
                    value="5-GHz"
                    v-if="wifiParam.wifi5GhzInfo.enable"
                    >5-GHz</a-select-option
                  >
                  <a-select-option
                    value="Dual Band"
                    v-if="wifiParam.wifi5GhzInfo.enable"
                    >Dual Band</a-select-option
                  >
                </a-select>
              </td>
              <td>
                <a-select size="small" v-model="item.securityMode">
                  <a-select-option value="" selected
                    >--Select--</a-select-option
                  >
                  <a-select-option :value="null">none</a-select-option>

                  <a-select-option value="wep-auto">wep-auto</a-select-option>

                  <a-select-option value="wep-open">wep-open</a-select-option>
                  <a-select-option value="wep-shared-key"
                    >wep-shared-key</a-select-option
                  >
                  <a-select-option value="wpa-enterprise"
                    >wpa-enterprise</a-select-option
                  >
                  <a-select-option value="wep-psk">wpa-psk</a-select-option>
                  <a-select-option value="wpa/wpa2-auto-enterprise"
                    >wpa/wpa2-auto-enterprise</a-select-option
                  >
                  <a-select-option value="wpa/wpa2-auto-psk"
                    >wpa/wpa2-auto-psk</a-select-option
                  >
                  <a-select-option value="wpa2-enterprise"
                    >wpa2-enterprise</a-select-option
                  >
                  <a-select-option value="wpa2-psk">wpa2-psk</a-select-option>
                </a-select>
              </td>
              <td>
                <a-select size="small" v-model="item.encryptionType">
                  <a-select-option value="" selected
                    >--Select--</a-select-option
                  >
                  <a-select-option value="ascii-64-bit-key"
                    >ascii-64-bit-key</a-select-option
                  >
                  <a-select-option value="ascii-128-key"
                    >ascii-128-key</a-select-option
                  >
                  <a-select-option value="hex-64-bit-key"
                    >hex-64-bit-key</a-select-option
                  >
                  <a-select-option value="hex-128-bit-key"
                    >hex-128-bit-key</a-select-option
                  >
                </a-select>
              </td>
              <td>
                <a-input size="small" v-model="item.password" />
              </td>
            </tr>
          </tbody>
        </table>
      </a-col>
    </a-row>
    <!-- 表单验证悬浮提示框 -->
    <!-- <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div> -->
  </div>
</template>

<script>
import common from '@/mixins/tip';
export default {
  mixins: [common],
  props: {
    wifiData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    wifiParam() {
      return this.wifiData;
    }
  },
  methods: {
    param() {
      this.$emit('wifi-param', this.wifiParam);
    }
  }
};
</script>

<style lang="scss" scoped>
.errorMsg {
  color: #ee6978;
  font-size: 12px;
  padding-left: 1px;
  vertical-align: top;
}
.ghzitem {
  width: 600px;
  border: 1px solid #456880;
  padding: 20px 10px 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  .checkGhz {
    background: #507691;
    border-radius: 4px;
    padding: 2px 5px;
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    position: absolute;
    left: 10px;
    top: 0;
    transform: translateY(-50%);
    .ant-checkbox-wrapper {
      margin-right: 3px;
    }
  }
  .selectGhz {
    label {
      display: block;
      color: #fff;
      font-size: 12px;
      line-height: 18px;
    }
    .ant-select {
      width: 100%;
    }
  }
}
.tableSub {
  padding: 0;
  margin: 15px 0 0 0 !important;
  &::before {
    display: none;
  }
  .wifiTable {
    background: #f5f5f5;
    thead {
      tr {
        th {
          border: 1px solid #ddd;
          width: 176px;
        }
      }
    }
    tbody {
      tr {
        td {
          text-align: center;
          border: 1px solid #ddd;
          .ant-select,
          .ant-input {
            width: 95%;
            margin: 0;
          }
        }
        td:nth-of-type(1) {
          padding-left: 4px;
          text-align: left;
        }
      }
      tr:nth-of-type(even) {
        background: #fff;
      }
    }
  }
}
</style>

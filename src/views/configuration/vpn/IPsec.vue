<template>
  <div>
    <a-form-model layout="vertical" :model="ipsec">
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecModel')">
            <a-select v-model="ipsec.mode" style="width:250px" size="small">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in modeList"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecBackReplay')">
            <a-select
              v-model="ipsec.antiReplay"
              placeholder="--Select--"
              style="width:250px"
              size="small"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in backReplayList"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecFragment')">
            <a-select
              v-model="ipsec.fragmentation"
              placeholder="--Select--"
              style="width:250px"
              size="small"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in fragmentList"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecNatCfg')">
            <a-select
              v-model="ipsec.forceNatT"
              placeholder="--Select--"
              style="width:250px"
              size="small"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in natCfgList"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecKeepActiveTimeout')">
            <a-input
              size="small"
              v-model="ipsec.keepaliveTimeout"
              :placeholder="placeholders.keepaliveTimeout"
              style="width:250px;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecRestartTime')">
            <a-select style="width:90px" size="small" default-value="seconds">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in restartTimeTypeOptions"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
            <a-input
              size="small"
              v-model="ipsec.life.duration"
              :placeholder="placeholders.duration"
              style="width:160px;"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecRestatVolumne')">
            <a-select style="width:90px" size="small" default-value="MB">
              <a-select-option
                :value="item.value"
                v-for="(item, index) in restartVolumneTypeOptions"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
            <a-input
              size="small"
              v-model="ipsec.life.volume"
              :placeholder="placeholders.volume"
              style="width:160px;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="change-cls">
        <div class="change-icon">{{ $t('VPNIKEChange') }}</div>
        <a-row type="flex" justify="start" align="top">
          <a-col>
            <a-radio-group
              v-model="cVPNProfile.tempIpsecNewOrOld"
              :options="newOrOldOptions"
            />
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="start"
          align="top"
          v-if="cVPNProfile.tempIpsecNewOrOld == 'New'"
        >
          <a-col>
            <div class="add-modle-item">
              <ListCrt
                v-if="visible"
                ref="hashRef"
                :list-data="hashOptions"
                :item-data="hashList"
                :title="HashAlgorithms"
                @subdata="hashCustomFunc"
              />
            </div>
          </a-col>
          <a-col>
            <div class="add-modle-item">
              <ListCrt
                v-if="visible"
                ref="encryListRef"
                :list-data="encryOptions"
                :item-data="encryList"
                :title="EncryptionAlgorithms"
                @subdata="encryCustomFunc"
              />
            </div>
          </a-col>
          <a-col>
            <div class="add-modle-item">
              <ListCrt
                v-if="visible"
                ref="dhGroupRef"
                :list-data="forwardModeOptions"
                :item-data="forwardModeList"
                :title="PerfectGroup"
                @subdata="pfsCustomFunc"
              />
            </div>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="start"
          align="middle"
          v-if="cVPNProfile.tempIpsecNewOrOld == 'Old'"
        >
          <a-col>
            <a-form-model-item :label="$t('VPNIKEChange')">
              <a-select
                v-model="ipsec.transform"
                style="width:320px"
                size="small"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in changeOptions"
                  :key="index"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNIPsecForwardSecretMode')">
              <a-select
                v-model="ipsec.pfsGroup"
                style="width:320px"
                size="small"
              >
                <a-select-option
                  :value="item.value"
                  v-for="(item, index) in forwardModeOptions"
                  :key="index"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import ListCrt from 'components/ListCrt';
export default {
  name: 'IPsec',
  props: ['vpnProfile'],
  components: {
    ListCrt
  },
  data() {
    return {
      visible: true,
      cVPNProfile: {
        tempIpsecNewOrOld: 'Old'
      },
      ipsec: {
        forceNatT: 'disable',
        fragmentation: 'pre-fragmentation',
        transform: 'esp-aes128-sha1',
        pfsGroup: 'mod-none',
        mode: 'tunnel',
        pfsGroups: [],
        hashAlgorithms: [],
        encryptionAlgorithms: [],
        antiReplay: 'enable',
        keepaliveTimeout: '10',
        life: {
          duration: '28800',
          volume: ''
        }
      },
      HashAlgorithms: 'Hash Algorithms',
      EncryptionAlgorithms: 'Encryption Algorithms',
      PerfectGroup: 'Perfect Forward Secrecy Group',
      placeholders: {
        keepaliveTimeout: '3-30',
        duration: '120-28800',
        volume: '512-4294967295'
      },
      modeList: [
        {
          label: this.$t('VPNIPsecTunnel'),
          value: 'tunnel'
        }
      ],
      backReplayList: [
        {
          label: 'enable',
          value: 'enable'
        },
        {
          label: 'disable',
          value: 'disable'
        }
      ],
      fragmentList: [
        {
          label: this.$t('VPNIPsecPreFrag'),
          value: 'pre-fragmentation'
        },
        {
          label: this.$t('VPNIPsecBackFrag'),
          value: 'back'
        }
      ],
      natCfgList: [
        {
          label: this.$t('VPNIPsecDisable'),
          value: 'disable'
        },
        {
          label: this.$t('VPNIPsecEnable'),
          value: 'enable'
        }
      ],
      restartTimeTypeOptions: [
        {
          label: 'Hours',
          value: 'hours'
        },
        {
          label: 'Minutes',
          value: 'minutes'
        },
        {
          label: 'Seconds',
          value: 'seconds'
        }
      ],
      restartVolumneTypeOptions: [
        {
          label: 'MB',
          value: 'MB'
        },
        {
          label: 'GB',
          value: 'GB'
        },
        {
          label: 'TB',
          value: 'TB'
        }
      ],
      newOrOldOptions: [
        {
          label: this.$t('VPNIKENew'),
          value: 'New'
        },
        {
          label: this.$t('VPNIKEOld'),
          value: 'Old'
        }
      ],
      hashList: [],
      encryList: [],
      forwardModeList: [],
      changeOptions: [
        {
          label: 'esp-aes128-sha1'
        },
        {
          label: 'esp-aes128-ctr-sha1'
        },
        {
          label: 'esp-aes128-ctr-xcbc'
        },
        {
          label: 'esp-aes128-gcm'
        },
        {
          label: 'esp-aes128-md5'
        },
        {
          label: 'esp-aes128-sha256'
        },
        {
          label: 'esp-aes128-sha384'
        },
        {
          label: 'esp-aes128-sha512'
        },
        {
          label: 'esp-3des-md5'
        },
        {
          label: 'esp-3des-sha1'
        },
        {
          label: 'esp-null-md5'
        }
      ],
      forwardModeOptions: [
        {
          label: 'No PFS',
          value: 'mod-none'
        },
        {
          label: 'Diffie-Hellman Group 1 - 768-bit modulus',
          value: 'mod1'
        },
        {
          label: 'Diffie-Hellman Group 2 – 1024-bit modulus',
          value: 'mod2'
        },
        {
          label: 'Diffie-Hellman Group 5 - 1536-bit modulus',
          value: 'mod5'
        },
        {
          label: 'Diffie-Hellman Group 14 – 2048 bit modulus',
          value: 'mod14'
        },
        {
          label: 'Diffie-Hellman Group 15 – 3072 bit modulus',
          value: 'mod15'
        },
        {
          label: 'Diffie-Hellman Group 16 – 4096 bit modulus',
          value: 'mod16'
        },
        {
          label: 'Diffie-Hellman Group 19 – 256 bit elliptic curve',
          value: 'mod19'
        },
        {
          label: 'Diffie-Hellman Group 20 – 384 bit ellipticcurve',
          value: 'mod20'
        },
        {
          label: 'Diffie-Hellman Group 21– 251 bit elliptic curve',
          value: 'mod21'
        },
        {
          label: 'Diffie-Hellman Group 25– 192 bit elliptic curve',
          value: 'mod25'
        },
        {
          label: 'Diffie-Hellman Group 26– 224 bit elliptic curve',
          value: 'mod26'
        }
      ],
      hashOptions: ['md5', 'sha256', 'sha384', 'sha512', 'sha1'],
      encryOptions: ['3des', 'aes128', 'aes256']
    };
  },
  mounted() {
    if (this.vpnProfile.ipsec) {
      this.ipsec = this.vpnProfile.ipsec;
      this.hashList = [];
      this.encryList = [];
      this.forwardModeList = [];
      this.ipsec.hashAlgorithms &&
        this.ipsec.hashAlgorithms.forEach(hash => {
          this.hashList.push(hash);
        });
      this.ipsec.encryptionAlgorithms &&
        this.ipsec.encryptionAlgorithms.forEach(encry => {
          this.encryList.push(encry);
        });
      this.ipsec.pfsGroups &&
        this.ipsec.pfsGroups.forEach(forward => {
          this.forwardModeList.push(forward);
        });
    }
    if (
      this.ipsec.encryptionAlgorithms ||
      this.ipsec.pfsGroups ||
      this.ipsec.hashAlgorithms
    ) {
      this.cVPNProfile.tempIpsecNewOrOld = 'New';
    } else {
      this.cVPNProfile.tempIpsecNewOrOld = 'Old';
    }
  },
  methods: {
    getData() {
      this.$refs.hashRef && this.$refs.hashRef.param();
      this.$refs.encryListRef && this.$refs.encryListRef.param();
      this.$refs.dhGroupRef && this.$refs.dhGroupRef.param();
      this.cVPNProfile.ipsec = this.ipsec;
      let data = { ...this.cVPNProfile };
      if (this.cVPNProfile.tempIpsecNewOrOld === 'New') {
        delete data.ipsec.transform;
        delete data.ipsec.group;
      } else {
        delete data.ipsec.hashAlgorithms;
        delete data.ipsec.encryptionAlgorithms;
        delete data.ipsec.pfsGroups;
      }
      this.$emit('passChildContent', this.cVPNProfile);
    },
    hashCustomFunc(data) {
      this.ipsec.hashAlgorithms = data;
      this.hashList = data;
    },
    encryCustomFunc(data) {
      this.ipsec.encryptionAlgorithms = data;
      this.encryList = data;
    },
    pfsCustomFunc(data) {
      this.ipsec.pfsGroups = data;
      this.forwardModeList = data;
    }
  }
};
</script>
<style lang="scss" scoped>
.change-cls {
  min-height: 78px;
  border-radius: 5px;
  border: solid 3px #456880;
  position: relative;
  padding: 10px;
  .change-icon {
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
}
.add-modle-item {
  width: 280px;
  height: 140px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  background: #fff;
}
</style>

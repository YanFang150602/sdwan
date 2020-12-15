<template>
  <div>
    <a-form-model layout="vertical" :model="ipsec" :rules="rules" ref="ipsecBaseRef">
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIPsecModel')">
            <a-select v-model="ipsec.mode" style="width: 250px" size="small">
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
              style="width: 250px"
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
              style="width: 250px"
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
              style="width: 250px"
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
              style="width: 250px"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-row type="flex" justify="start" align="top">
            <a-col>
              <a-form-model-item :label="$t('VPNIPsecRestartTime')">
                <a-select
                  style="width: 120px"
                  size="small"
                  v-model="ipsec.tempRekeyTime"
                  @change="changeRekeyTime"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in restartTimeTypeOptions"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                label=" "
                prop="tempLifetime"
              >
                <a-input
                  size="small"
                  v-model="ipsec.tempLifetime"
                  style="width: 200px;margin-top:21px"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-col>
        <a-col>
           <a-row type="flex" justify="start" align="top">
            <a-col>
              <a-form-model-item :label="$t('VPNIPsecRestatVolumne')">
                <a-select
                  style="width: 120px"
                  size="small"
                  v-model="ipsec.tempVolumeType"
                  @change="changeVolume"
                >
                  <a-select-option
                    :value="item"
                    v-for="(item, index) in restartVolumneTypeOptions"
                    :key="index"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                label=" "
                prop="tempVolume"
              >
                <a-input
                  size="small"
                  v-model="ipsec.tempVolume"
                  style="width: 200px;margin-top: 21px;"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div class="change-cls">
        <div class="change-icon">{{ $t('VPNIKEChange') }}</div>
        <a-row type="flex" justify="start" align="top">
          <a-col>
            <a-radio-group
              v-model="cVPNProfile.tempIpsecNewOrOld"
              :options="newOrOldOptions"
              @change="changeRadio"
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
                style="width: 320px"
                size="small"
              >
                <a-select-option
                  :value="item"
                  v-for="(item, index) in changeOptions"
                  :key="index"
                  >{{ item }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item :label="$t('VPNIPsecForwardSecretMode')">
              <a-select
                v-model="ipsec.pfsGroup"
                style="width: 320px"
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
        tempRekeyTime: 'Seconds',
        tempLifetime: '28800',
        tempVolumeType: 'MB',
        tempVolume: '',
        life: {
          duration: '28800',
          volume: ''
        }
      },
      HashAlgorithms: 'Hash Algorithms',
      EncryptionAlgorithms: 'Encryption Algorithms',
      PerfectGroup: 'Perfect Forward Secrecy Group',
      placeholders: {
        keepaliveTimeout: '3-30'
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
      restartTimeTypeOptions: ['Hours', 'Minutes', 'Seconds'],
      restartVolumneTypeOptions: ['MB', 'GB', 'TB'],
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
        'esp-aes128-sha1',
        'esp-aes128-ctr-sha1',
        'esp-aes128-ctr-xcbc',
        'esp-aes128-gcm',
        'esp-aes128-md5',
        'esp-aes128-sha256',
        'esp-aes128-sha384',
        'esp-aes128-sha512',
        'esp-3des-md5',
        'esp-3des-sha1',
        'esp-null-md5'
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
      encryOptions: ['3des', 'aes128', 'aes256'],
      rules: {
        tempLifetime: [{ validator: this.validDuration, trgger: 'blur'}],
        tempVolume: [{ validator: this.validVolume, trgger: 'blur'}],
      }
    };
  },
  mounted() {
    if (this.vpnProfile.ipsec) {
      Object.assign(this.ipsec, this.vpnProfile.ipsec);
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
      
      this.ipsec.tempLifetime = this.ipsec.life.duration ? this.ipsec.life.duration : '';
      this.ipsec.tempVolume = this.ipsec.life.volume ? this.ipsec.life.volume : '';
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
      let data = JSON.parse(JSON.stringify(this.cVPNProfile));
      if (this.cVPNProfile.tempIpsecNewOrOld === 'New') {
        delete data.ipsec.transform;
        delete data.ipsec.group;
      } else {
        delete data.ipsec.hashAlgorithms;
        delete data.ipsec.encryptionAlgorithms;
        delete data.ipsec.pfsGroups;
      }
      this.$emit('passChildContent', data);
    },
    changeRadio(e) {
      if (e.target.value === 'Old') {
        this.ipsec.transform = this.ipsec.transform ? this.ipsec.transform : 'esp-aes128-sha1';
        this.ipsec.pfsGroup = this.ipsec.pfsGroup ? this.ipsec.pfsGroup : 'mod-none';
      }
    },
    changeRekeyTime() {
      switch(this.ipsec.tempRekeyTime) {
        case 'Hours':
          this.ipsec.life.duration = Number(this.ipsec.tempLifetime) * 60 * 60;
          this.$refs.ipsecBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
        case 'Minutes':
          this.ipsec.life.duration = Number(this.ipsec.tempLifetime) * 60;
          this.$refs.ipsecBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
        default:
          this.ipsec.life.duration = Number(this.ipsec.tempLifetime);
          this.$refs.ipsecBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
      }
    },
    validDuration(rule, value, callback) {
      if (value && isNaN(Number(value))) {
        callback('Input number');
      } else if (!value) {
        callback();
      } else {
        value = Number(value);
        switch(this.ipsec.tempRekeyTime) {
          case 'Hours':
            if (value < 1 || value > 8) {
              callback('Allowed Range is 1-8');
            } else {
              this.ipsec.life.duration = Number(this.ipsec.tempLifetime) * 60 * 60;
              callback();
            }
            break;
          case 'Minutes':
            if (value < 2 || value > 480) {
              callback('Allowed Range is 2-480');
            } else {
              this.ipsec.life.duration = Number(this.ipsec.tempLifetime) * 60;
              callback();
            }
            break;
          default:
            if (value < 120 || value > 28800) {
              callback('Allowed Range is 120-28800');
            } else {
              this.ipsec.life.duration = Number(this.ipsec.tempLifetime);
              callback();
            }
            break;
        }
      }
    },
    changeVolume() {
      switch(this.ipsec.tempVolumeType) {
        case 'TB':
          this.ipsec.life.volume = Number(this.ipsec.tempVolume) * 1024 * 1024;
          this.$refs.ipsecBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
        case 'GB':
          this.ipsec.life.volume = Number(this.ipsec.tempVolume) * 1024;
          this.$refs.ipsecBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
        default:
          this.ipsec.life.volume = Number(this.ipsec.tempVolume);
          this.$refs.ipsecBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
      }
    },
    validVolume(rule, value, callback) {
      if (value && isNaN(Number(value))) {
        callback('Input number');
      } else if (!value) {
        callback();
      } else {
        value = Number(value);
        switch(this.ipsec.tempVolumeType) {
          case 'TB':
            if (value < 1 || value > 4095) {
              callback('Allowed Range 1-4095TB');
            } else {
              this.ipsec.life.volume = Number(this.ipsec.tempVolume) * 1024 * 1024;
              callback();
            }
            break;
          case 'GB':
            if (value < 1 || value > 4194303) {
              callback('Allowed Range 1-4194303GB');
            } else {
              this.ipsec.life.volume = Number(this.ipsec.tempVolume) * 1024;
              callback();
            }
            break;
          default:
            if (value < 512 || value > 4294967295) {
              callback('Allowed Range 512-4294967295MB');
            } else {
              this.ipsec.life.volume = Number(this.ipsec.tempVolume);
              callback();
            }
            break;
        }
      }
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

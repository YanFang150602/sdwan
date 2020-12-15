<template>
  <div>
    <a-form-model layout="vertical" :model="ike" :rules="rules" ref="ikeBaseRef">
      <a-row type="flex" justify="start" align="top">
        <a-col>
          <a-form-model-item :label="$t('VPNIKEVersion')">
            <a-select
              v-model="ike.version"
              size="small"
              style="width: 200px"
              @change="changeVersion"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in versionOptions"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('VPNIKETime')">
            <a-select
              size="small"
              style="width: 200px"
              default-value="seconds"
              v-model="ike.tempRekeyTime"
              @change="changeRekeyTime"
            >
              <a-select-option
                :value="item"
                v-for="(item, index) in rekeyTimeOptions"
                :key="index"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIKEAuth')">
            <a-input
              size="small"
              v-model="ike.authDimain"
              style="width: 200px"
            />
          </a-form-model-item>
          <a-form-model-item label=" " prop="tempLifetime">
            <a-input
              size="small"
              v-model="ike.tempLifetime"
              style="width: 200px;margin-top: 21px"
            />
          </a-form-model-item>
        </a-col>
        <a-col>
          <a-form-model-item :label="$t('VPNIKETimeout')">
            <a-input
              size="small"
              v-model="ike.dpdTimeout"
              style="width: 200px"
              :placeholder="placeholders.dpdTimeout"
              @blur="validIkeData"
            />
          </a-form-model-item>
          <!--  <a-form-model-item :label="$t('VPNIKEBackCheck')">
            <a-select
              v-model="ike.revocationCheck"
              size="small"
              style="width:200px;"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in backCheckOptions"
                :key="index"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>-->
        </a-col>
        <a-col v-show="showMode">
          <a-form-model-item :label="$t('VPNIKEModel')">
            <a-select
              v-model="ike.mode"
              placeholder="--Select--"
              size="small"
              style="width: 200px"
            >
              <a-select-option
                :value="item.value"
                v-for="(item, index) in modelOptions"
                :key="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- Transforms & DH Group -->
    <a-tabs default-active-key="1" @change="changeATabs">
      <a-tab-pane key="1" :tab="$t('VPNIKEChangeAndGroup')">
        <a-form-model layout="vertical" :model="ike">
          <a-row type="flex" justify="start" align="middle">
            <a-col>
              <a-radio-group
                v-model="cVPNProfile.tempIkeNewOrOld"
                :options="newOrOldOptions"
                @change="changeRadio"
              />
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            align="top"
            v-if="cVPNProfile.tempIkeNewOrOld == 'New'"
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
                  :list-data="dhOptions"
                  :item-data="dhList"
                  :title="DHGroup"
                  @subdata="dhCustomFunc"
                />
              </div>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="start"
            align="middle"
            v-if="cVPNProfile.tempIkeNewOrOld == 'Old'"
          >
            <a-col>
              <a-form-model-item :label="$t('VPNIKEChange')">
                <a-select
                  v-model="ike.transform"
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
              <a-form-model-item :label="$t('VPNIKEDHGroup')">
                <a-select v-model="ike.group" style="width: 320px" size="small">
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in dhOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('VPNIKELocalValid')" force-render>
        <a-form-model
          layout="vertical"
          :model="localAuthInfo"
          :rules="localRules"
          ref="localAuthRef"
        >
          <a-row type="flex" justify="start" align="top">
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEAuthType')"
                class="mandatory"
                prop="authType"
              >
                <a-select
                  v-model="localAuthInfo.authType"
                  style="width: 200px"
                  size="small"
                  @change="changeLocalAuthType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in authTypeOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECertName')"
                prop="certName"
                class="mandatory"
                v-show="showCert"
              >
                <a-select
                  v-model="localAuthInfo.certName"
                  placeholder="--Select--"
                  size="small"
                  style="width: 200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in certNameOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEPass')"
                prop="key"
                class="mandatory"
                v-show="showPsk"
              >
                <a-input
                  size="small"
                  v-model="localAuthInfo.key"
                  style="width: 200px"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECA')"
                prop="caChain"
                class="mandatory"
                v-show="showCert"
              >
                <a-select
                  v-model="localAuthInfo.caChain"
                  placeholder="--Select--"
                  size="small"
                  style="width: 200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in localCAOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEIdType')"
                prop="idType"
                class="mandatory"
                v-show="showPsk"
              >
                <a-select
                  v-model="localAuthInfo.idType"
                  size="small"
                  style="width: 200px"
                  @change="changeLocalIdType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in idTypeOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECertArea')"
                v-show="showCert"
              >
                <a-select
                  v-model="localAuthInfo.certDomain"
                  placeholder="--Select--"
                  size="small"
                  style="width: 200px"
                  @change="changeCertArea"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in certAreaOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEId')"
                prop="idString"
                class="mandatory"
                v-show="showPsk"
              >
                <a-input
                  size="small"
                  v-model="localAuthInfo.idString"
                  style="width: 200px"
                  :placeholder="placeholders.localIdString"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="start" align="top" v-show="showTenant">
            <a-col>
              <a-form-model-item :label="$t('VPNIKEProviderTenant')">
                <a-select
                  v-model="localAuthInfo.tenant"
                  placeholder="--Select--"
                  size="small"
                  style="width: 200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in tenantOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        :tab="$t('VPNIKEPeerIdValid')"
        force-render
        class="peerAuthInfo"
      >
        <a-form-model
          layout="vertical"
          :model="peerAuthInfo"
          :rules="peerRules"
          ref="peerAuthRef"
        >
          <a-row
            type="flex"
            justify="start"
            align="top"
            v-show="!showCertAuthTable"
          >
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEAuthType')"
                class="mandatory"
                prop="authType"
              >
                <a-select
                  v-model="peerAuthInfo.authType"
                  style="width: 200px"
                  size="small"
                  @change="changePeerAuthType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in authTypeOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKECA')"
                prop="caChain"
                class="mandatory"
                v-show="showPeerCert"
              >
                <a-select
                  v-model="peerAuthInfo.caChain"
                  placeholder="--Select--"
                  size="small"
                  style="width: 200px"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in peerCAOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('VPNIKEPass')"
                prop="key"
                class="mandatory"
                v-show="showPeerPsk"
              >
                <a-input
                  size="small"
                  v-model="peerAuthInfo.key"
                  style="width: 200px"
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEIdType')"
                prop="idType"
                class="mandatory"
                v-show="showPeerPsk"
              >
                <a-select
                  v-model="peerAuthInfo.idType"
                  size="small"
                  style="width: 200px"
                  @change="changePeerIdType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in idTypeOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEId')"
                prop="idString"
                class="mandatory"
                v-show="showPeerPsk"
              >
                <a-input
                  size="small"
                  v-model="peerAuthInfo.idString"
                  style="width: 200px"
                  :placeholder="placeholders.peerIdString"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            justify="start"
            align="top"
            v-show="showCertAuthTable"
          >
            <a-col>
              <a-form-model-item
                :label="$t('VPNIKEAuthType')"
                class="mandatory"
                prop="authType"
              >
                <a-select
                  v-model="peerAuthInfo.authType"
                  placeholder="--Select--"
                  style="width: 200px"
                  size="small"
                  @change="changeConPeerAuthType"
                >
                  <a-select-option
                    :value="item.value"
                    v-for="(item, index) in authTypeOptions"
                    :key="index"
                    >{{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-show="showCertAuthTable && showConCert">
            <a-col>
              <v-table
                is-horizontal-resize
                column-width-drag
                :columns="certAuthColumns"
                :table-data="certAuthList"
                :height="150"
                style="width: 800px"
                @on-custom-comp="customFunc"
              ></v-table>
            </a-col>
          </a-row>
          <!-- </div> -->
          <a-row v-show="showCertAuthTable && showConPsk">
            <a-col>
              <v-table
                is-horizontal-resize
                column-width-drag
                :columns="pskColumns"
                :table-data="pskList"
                :height="150"
                style="width: 800px"
                isFrozen="true"
                @on-custom-comp="customFunc"
                error-content="Temporarily no data"
              ></v-table>
            </a-col>
          </a-row>
        </a-form-model>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import ListCrt from 'components/ListCrt';
import { required } from '@/validate/common';
export default {
  name: 'IKE',
  props: ['vpnProfile', 'conSDWAN'],
  components: {
    ListCrt,
  },
  data() {
    return {
      visible: true,
      renderM: 'firstRender',
      cVPNProfile: {
        tempIkeNewOrOld: 'Old',
      },
      ike: {
        version: 'v2',
        mode: '',
        group: 'mod2',
        transform: 'aes128-sha1',
        authDimain: '',
        dpdTimeout: '30',
        tempRekeyTime: 'Seconds',
        tempLifetime: '28800',
        hashAlgorithms: [],
        encryptionAlgorithms: [],
        groups: [],
      },
      HashAlgorithms: 'Hash Algorithms',
      EncryptionAlgorithms: 'Encryption Algorithms',
      DHGroup: 'DH Group',
      placeholders: {
        dpdTimeout: '10-180',
        localIdString: '',
        peerIdString: '',
      },
      localAuthInfo: {
        authType: 'psk',
        idType: 'fqdn',
        key: '',
        idString: '',
        caChain: '',
        certDomain: '',
        certName: '',
      },
      peerAuthInfo: {
        authType: 'psk',
        idType: 'email',
        idString: '',
        key: '',
        caChain: '',
      },
      versionOptions: [
        {
          label: this.$t('SelectNull'),
          value: '',
        },
        {
          label: 'v1',
          value: 'v1',
        },
        {
          label: 'v2',
          value: 'v2',
        },
        {
          label: 'v2-or-v1',
          value: 'v2-or-v1',
        },
      ],
      showMode: false,
      rekeyTimeOptions: [
        'Hours',
        'Minutes',
        'Seconds',
      ],
      backCheckOptions: [
        {
          label: this.$t('SelectNull'),
          value: '',
        },
        {
          label: this.$t('VPNIKEBackCheckNull'),
          value: 'none',
        },
        {
          label: 'OCSP',
          value: 'ocsp',
        },
      ],
      modelOptions: [
        {
          label: this.$t('SelectNull'),
          value: '',
        },
        {
          label: 'Aggressive',
          value: 'aggressive',
        },
        {
          label: 'Main',
          value: 'main',
        },
      ],
      newOrOldOptions: [
        {
          label: this.$t('VPNIKENew'),
          value: 'New',
        },
        {
          label: this.$t('VPNIKEOld'),
          value: 'Old',
        },
      ],
      hashList: [],
      encryList: [],
      dhList: [],
      changeOptions: [
        '3des-md5',
        '3des-sha1',
        'aes128-sha1',
        'aes128-md5',
        'aes256-sha1',
        'aes256-md5',
        'aes128-sha256',
        'aes256-sha256',
        'aes128-sha384',
        'aes256-sha384',
        'aes128-sha512',
        'aes256-sha512'
      ],
      hashOptions: ['md5', 'sha256', 'sha384', 'sha512', 'sha1'],
      encryOptions: ['3des', 'aes128', 'aes256'],
      dhOptions: [
        {
          label: 'No PFS',
          value: 'mod-none',
        },
        {
          label: 'Diffie-Hellman Group 1 - 768-bit modulus',
          value: 'mod1',
        },
        {
          label: 'Diffie-Hellman Group 2 – 1024-bit modulus',
          value: 'mod2',
        },
        {
          label: 'Diffie-Hellman Group 5 - 1536-bit modulus',
          value: 'mod5',
        },
        {
          label: 'Diffie-Hellman Group 14 – 2048 bit modulus',
          value: 'mod14',
        },
        {
          label: 'Diffie-Hellman Group 15 – 3072 bit modulus',
          value: 'mod15',
        },
        {
          label: 'Diffie-Hellman Group 16 – 4096 bit modulus',
          value: 'mod16',
        },
        {
          label: 'Diffie-Hellman Group 19 – 256 bit elliptic curve',
          value: 'mod19',
        },
        {
          label: 'Diffie-Hellman Group 20 – 384 bit elliptic curve',
          value: 'mod20',
        },
        {
          label: 'Diffie-Hellman Group 21– 251 bit elliptic curve',
          value: 'mod21',
        },
        {
          label: 'Diffie-Hellman Group 25– 192 bit elliptic curve',
          value: 'mod25',
        },
        {
          label: 'Diffie-Hellman Group 26– 224 bit elliptic curve',
          value: 'mod26',
        },
      ],
      authTypeOptions: [
        /* {
          label: this.$t('VPNIKECert'),
          value: 'certificate'
        }, */
        {
          label: 'psk',
          value: 'psk',
        },
      ],
      certNameOptions: [{ label: '', value: '' }],
      localCAOptions: [{ label: '', value: '' }],
      peerCAOptions: [{ label: '', value: '' }],
      showCert: false,
      showPsk: true,
      certAreaOptions: [
        {
          label: this.$t('SelectNull'),
          value: '',
        },
        {
          label: this.$t('VPNIKESystem'),
          value: 'system',
        },
        {
          label: this.$t('VPNIKETenant'),
          value: 'tenant',
        },
      ],
      showTenant: false,
      idTypeOptions: [
        {
          label: this.$t('VPNIKEEmail'),
          value: 'email',
        },
        {
          label: 'FQDN',
          value: 'fqdn',
        },
        {
          label: 'IP',
          value: 'ip',
        },
      ],
      showPeerCert: false,
      showPeerPsk: true,
      tenantOptions: [
        {
          label: '',
          value: '',
        },
      ],
      certAuthColumns: [
        {
          field: 'idTypeSelect',
          title: `<span>${this.$t(
            'VPNIKEIdType'
          )}<label style="color:red">*</label></span>`,
          width: 350,
          columnAlign: 'left',
          isResize: true,
          componentName: 'idtype-opration',
        },
        {
          field: 'idStringInput',
          title: `<span>${this.$t(
            'VPNIKEId'
          )}<label style="color:red">*</label></span>`,
          width: 350,
          columnAlign: 'left',
          isResize: true,
          componentName: 'id-opration',
        },
        {
          field: 'operation',
          title: '',
          width: 100,
          columnAlign: 'left',
          isResize: true,
          componentName: 'certoper-opration',
        },
      ],
      certAuthList: [{ type: 'certificate' }],
      pskColumns: [
        {
          field: 'idTypeSelect',
          title: `<span>${this.$t(
            'VPNIKEIdType'
          )}<label style="color:red">*</label></span>`,
          width: 250,
          columnAlign: 'left',
          isResize: true,
          componentName: 'idtype-opration',
        },
        {
          field: 'idStringInput',
          title: `<span>${this.$t(
            'VPNIKEId'
          )}<label style="color:red">*</label></span>`,
          width: 200,
          columnAlign: 'left',
          isResize: true,
          componentName: 'id-opration',
        },
        {
          field: 'keyInput',
          title: `<span>Key<label style="color:red">*</label></span>`,
          width: 250,
          columnAlign: 'left',
          isResize: true,
          componentName: 'key-opration',
        },
        {
          field: 'operation',
          title: '',
          width: 100,
          columnAlign: 'left',
          isResize: true,
          componentName: 'pskoper-opration',
        },
      ],
      pskList: [{ type: 'psk' }],
      rules: {
        tempLifetime: [{ validator: this.validLifetime, trigger: 'blur' }]
      },
      localRules: {
        authType: [{ validator: required }],
        /* certName: [
          {
            required: true,
            message: `${this.$t('VPNIKECertName')} is required`,
            trigger: 'blur'
          }
        ],
        caChain: [
          {
            required: true,
            message: `${this.$t('VPNIKECA')} is required`,
            trigger: 'blur'
          }
        ], */
        key: [{ validator: required }],
        idType: [{ validator: required }],
        idString: [{ validator: required }],
      },
      peerRules: {
        authType: [{ validator: required }],
        /*
        ca: [{ validator: required }],
        caChain: [{ validator: required }],
        */
        key: [{ validator: required }],
        idType: [{ validator: required }],
        idString: [{ validator: required }],
      },
      showConPsk: false,
      showConCert: false,
    };
  },
  computed: {
    ...mapState(['vpnTableSelects']),
    showCertAuthTable() {
      return this.conSDWAN;
    },
  },
  mounted() {
    Object.assign(this.localAuthInfo, this.vpnProfile.localAuthInfo);
    Object.assign(this.peerAuthInfo, this.vpnProfile.peerAuthInfo);

    if (this.vpnProfile.ike) {
      Object.assign(this.ike, this.vpnProfile.ike);
      this.hashList = [];
      this.encryList = [];
      this.dhList = [];
      this.ike.hashAlgorithms &&
        this.ike.hashAlgorithms.forEach((hash) => {
          this.hashList.push(hash);
        });
      this.ike.encryptionAlgorithms &&
        this.ike.encryptionAlgorithms.forEach((encry) => {
          this.encryList.push(encry);
        });
      this.ike.groups &&
        this.ike.groups.forEach((dh) => {
          this.dhList.push(dh);
        });
      this.ike.tempLifetime = this.ike.lifetime ? this.ike.lifetime : '';
    }
    this.changePeerIdType(this.peerAuthInfo.idType);
    if (
      this.ike.encryptionAlgorithms ||
      this.ike.groups ||
      this.ike.hashAlgorithms
    ) {
      this.cVPNProfile.tempIkeNewOrOld = 'New';
    } else {
      this.cVPNProfile.tempIkeNewOrOld = 'Old';
    }
  },
  methods: {
    ...mapMutations([
      'vpnTableSelectsPlus',
      'vpnTableSelectsMinus',
      'vpnTableSelectsAll',
    ]),
    getData() {
      this.$refs.hashRef && this.$refs.hashRef.param();
      this.$refs.encryListRef && this.$refs.encryListRef.param();
      this.$refs.dhGroupRef && this.$refs.dhGroupRef.param();
      this.cVPNProfile.localAuthInfo = this.localAuthInfo;
      this.cVPNProfile.peerAuthInfo = this.peerAuthInfo;
      this.cVPNProfile.ike = this.ike;
      let data = JSON.parse(JSON.stringify(this.cVPNProfile));
      if (this.cVPNProfile.tempIkeNewOrOld === 'New') {
        delete data.ike.transform;
        delete data.ike.group;
      } else {
        delete data.ike.hashAlgorithms;
        delete data.ike.encryptionAlgorithms;
        delete data.ike.groups;
      }
      this.$emit('passChildContent', data);
    },
    validLifetime(rule, value, callback) {
      if (value && isNaN(Number(value))) {
        callback('Input number');
      } else if (!value) {
        callback();
      } else {
        value = Number(value);
        switch(this.ike.tempRekeyTime) {
          case 'Hours':
            if (value < 1 || value > 8) {
              callback('Allowed Range is 1-8');
            } else {
              this.ike.lifetime = Number(this.ike.tempLifetime) * 60 * 60;
              callback();
            }
            break;
          case 'Minutes':
            if (value < 3 || value > 480) {
              callback('Allowed Range is 3-480');
            } else {
              this.ike.lifetime = Number(this.ike.tempLifetime) * 60;
              callback();
            }
            break;
          default:
            if (value < 132 || value > 28800) {
              callback('Allowed Range is 132-28800');
            } else {
              this.ike.lifetime = Number(this.ike.tempLifetime);
              callback();
            }
            break;
        }
      }
    },
    changeRekeyTime() {
      switch(this.ike.tempRekeyTime) {
        case 'Hours':
          this.ike.lifetime = Number(this.ike.tempLifetime) * 60 * 60;
          this.$refs.ikeBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
        case 'Minutes':
          this.ike.lifetime = Number(this.ike.tempLifetime) * 60;
          this.$refs.ikeBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
        default:
          this.ike.lifetime = Number(this.ike.tempLifetime);
          this.$refs.ikeBaseRef.validate(valid => {
            if (!valid) {
              return false;
            }
          });
          break;
      }
    },
    changeRadio(e) {
      if (e.target.value === 'Old') {
        this.ike.transform = this.ike.transform ? this.ike.transform : 'aes128-sha1';
        this.ike.group = this.ike.group ? this.ike.group : 'mod2';
      }
    },
    changeLocalIdType(value) {
      if (value === 'email') {
        this.placeholders.localIdString = this.$t('IKE_IDTYPE_EMAIL');
      } else {
        this.placeholders.localIdString = '';
      }
    },
    changePeerIdType(value) {
      if (value === 'email') {
        this.placeholders.peerIdString = this.$t('IKE_IDTYPE_EMAIL');
      } else {
        this.placeholders.peerIdString = '';
      }
    },
    validIkeData() {
      let dpdTimeout = Number(this.ike.dpdTimeout) || 10;
      if (dpdTimeout && isNaN(dpdTimeout)) {
        this.$message.error(this.$t('IKE_ERROR'));
        return false;
      } else {
        if (dpdTimeout < 10 || dpdTimeout > 180) {
          this.$message.error(this.$t('IKE_ERROR'));
          return false;
        }
      }
    },
    changeVersion(value) {
      if (value === 'v1' || value === 'v2-or-v1') {
        this.showMode = true;
      } else {
        this.showMode = false;
      }
    },
    changeATabs(value) {
      console.log('changeATabs ', value);
      if (value === 3) {
        console.log(value);
      }
    },
    hashCustomFunc(data) {
      this.ike.hashAlgorithms = data;
      this.hashList = data;
    },
    encryCustomFunc(data) {
      this.ike.encryptionAlgorithms = data;
      this.encryList = data;
    },
    dhCustomFunc(data) {
      this.ike.groups = data;
      this.dhList = data;
    },
    customFunc(params) {
      console.log(params, 8876);
      console.log(this.vpnTableSelects, 7788);
      switch (params.type) {
        case 'idType':
          params.rowData.type === 'certificate'
            ? (this.certAuthList[params.index]['idType'] = params.label)
            : (this.pskList[params.index]['idType'] = params.label);
          break;
        case 'idString':
          params.rowData.type === 'certificate'
            ? (this.certAuthList[params.index]['idString'] = params.label)
            : (this.pskList[params.index]['idString'] = params.label);
          console.log(params.rowData);
          break;
        case 'key':
          this.pskList[params.index]['key'] = params.label;
          break;
        case 'cert_plus':
          this.certAuthList.push({ type: 'certificate' });
          break;
        default:
          this.pskList.push({ type: 'psk' });
          break;
      }
    },
    changeLocalAuthType(value) {
      if (value === 'certificate') {
        this.showCert = true;
        this.showPsk = false;
        this.changeCertArea(this.localAuthInfo.certDomain);
      } else {
        this.showPsk = true;
        this.showCert = false;
        this.showTenant = false;
      }
    },
    changePeerAuthType(value) {
      if (value === 'certificate') {
        this.showPeerCert = true;
        this.showPeerPsk = false;
      } else {
        this.showPeerPsk = true;
        this.showPeerCert = false;
      }
    },
    changeConPeerAuthType(value) {
      if (value === 'certificate') {
        this.showConCert = true;
        this.showConPsk = false;
      } else {
        this.showConPsk = true;
        this.showConCert = false;
      }
    },
    changeCertArea(value) {
      if (value == 'tenant') {
        this.showTenant = true;
      } else {
        this.showTenant = false;
      }
    },
  },
};
let props = {
  rowData: {
    type: Object,
  },
  field: {
    type: String,
  },
  index: {
    type: Number,
  },
};
Vue.component('idtype-opration', {
  template: `<span>
     <a-select
        :default-value="rowData['idType']"
        placeholder="--Select--"
        size="small"
        @change="change"
      >
        <a-select-option
          :value="item.label"
          v-for="(item, index) in vpnTableSelects.idTypeOptions"
          v-if="!item.used"
          :key="index"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </span>`,
  props,
  computed: {
    ...mapState(['vpnTableSelects']),
  },
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'idtype',
        index: this.index,
        rowData: this.rowData,
        label,
      };
      this.$emit('on-custom-comp', params);
    },
  },
});
Vue.component('id-opration', {
  template: `<span>
    <a-input
      size="small"
      v-model="rowData['idString']"
      style="width:250px;"
      @change="change"
    />
    </span>`,
  props,
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'idString',
        index: this.index,
        rowData: this.rowData,
        label,
      };
      this.$emit('on-custom-comp', params);
    },
  },
});
Vue.component('key-opration', {
  template: `<span>
    <a-input
      size="small"
      v-model="rowData['key']"
      style="width:250px;"
      @change="change"
    />
    </span>`,
  props,
  methods: {
    change(label) {
      // 参数根据业务场景随意构造
      let params = {
        type: 'key',
        index: this.index,
        rowData: this.rowData,
        label,
      };
      this.$emit('on-custom-comp', params);
    },
  },
});
Vue.component('certoper-opration', {
  template: `<span>
     <a-icon type="plus" @click="clickHandle"/>
    </span>`,
  props,
  methods: {
    clickHandle() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'cert_plus',
        index: this.index,
        rowData: this.rowData,
      };
      this.$emit('on-custom-comp', params);
    },
  },
});

Vue.component('pskoper-opration', {
  template: `<span>
     <a-icon type="plus" @click="clickHandle"/>
    </span>`,
  props,
  methods: {
    clickHandle() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'psk_plus',
        index: this.index,
        rowData: this.rowData,
      };
      this.$emit('on-custom-comp', params);
    },
  },
});
</script>
<style lang="scss" scoped>
.mandatory {
  color: #ee6978;
  font-size: 11px;
  padding-left: 1px;
  vertical-align: top;
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
.peerAuthInfo {
  /deep/.v-table-rightview {
    width: 800px !important;
    /deep/.v-table-header {
      width: 800px !important;
    }
    /deep/.v-table-body {
      width: 800px !important;
    }
  }
}

.add-modle-item {
  width: 290px;
  height: 140px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
  background: #fff;
}
</style>

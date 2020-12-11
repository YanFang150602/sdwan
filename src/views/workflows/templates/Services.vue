<template>
  <div>
    <a-row
      type="flex"
      justify="space-between"
      align="top"
      data-text="DHCP Server"
      style="margin: 5px 0 20px;"
    >
      <a-col class="tableSub" data-text="DHCP Server">
        <div class="serTable">
          <a-form-model
            ref="formser"
            :rules="rulesSer"
            :model="serCrt"
            @validate="validate"
            hideRequiredMark
          >
            <table>
              <thead>
                <tr>
                  <th>
                    <span>LAN Interfaces</span>
                  </th>
                  <th>
                    <span>DHCP Options Profile</span>
                  </th>
                  <th style="width: 68px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    @mouseenter="enter('name')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  >
                    <a-form-model-item prop="name">
                      <a-select v-model="serCrt.name">
                        <a-select-option value="" selected
                          >--Select--</a-select-option
                        >
                        <a-select-option
                          v-for="item in networkname"
                          :key="item"
                          :value="item"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item>
                      <a-select v-model="serCrt.profile">
                        <a-select-option value="" selected
                          >--Select--</a-select-option
                        >
                        <a-select-option
                          v-for="item in profileList"
                          :key="item.name"
                          :value="item.name"
                          >{{ item.name }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td class="addBtn">
                    <button @click="addParam('ser')">+</button>
                  </td>
                </tr>
                <tr v-for="item in serParam" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.profile }}</td>
                  <td class="delBtn">
                    <a href="javascript:;" @click="delParam(item.id, 'ser')"
                      ><img src="@/assets/images/organize/del.png" alt
                    /></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-form-model>
        </div>
      </a-col>
      <a-col class="tableSub" data-text="DHCP Relay">
        <div class="relTable">
          <a-form-model
            ref="formrel"
            :rules="rulesRel"
            :model="relCrt"
            @validate="validate"
            hideRequiredMark
          >
            <table>
              <thead>
                <tr>
                  <th>
                    <span>LAN Interfaces</span>
                  </th>
                  <th class="mandatory">
                    <span>IP Address</span>
                  </th>

                  <th style="width: 68px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    @mouseenter="enter('name')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  >
                    <a-form-model-item prop="name">
                      <a-select v-model="relCrt.name">
                        <a-select-option value="" selected
                          >--Select--</a-select-option
                        >
                        <a-select-option
                          v-for="item in networkname"
                          :key="item"
                          :value="item"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item prop="address">
                      <a-input
                        @mouseenter="enter('address')"
                        @mouseleave="leave"
                        @mousemove="updateXY"
                        v-model="relCrt.address"
                      />
                    </a-form-model-item>
                  </td>
                  <td class="addBtn">
                    <button @click="addParam('rel')">+</button>
                  </td>
                </tr>
                <tr v-for="item in relParam" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.address }}</td>
                  <td class="delBtn">
                    <a href="javascript:;" @click="delParam(item.id, 'rel')"
                      ><img src="@/assets/images/organize/del.png" alt
                    /></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-form-model>
        </div>
      </a-col>
    </a-row>
    <a-row class="tableSub" data-text="Service Templates">
      <a-col class="tmpTable">
        <table>
          <thead>
            <tr>
              <th>
                <span>Organization</span>
              </th>
              <th>
                <span>Security</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>cmcc_shanghai</td>
              <td>
                <a-radio-group v-model="temValue" @change="temChange">
                  <a-radio :value="1">
                    None
                  </a-radio>
                  <a-radio :value="2">
                    NGFW
                  </a-radio>
                  <a-radio :value="3">
                    SFW
                  </a-radio>
                </a-radio-group>
              </td>
            </tr>
          </tbody>
        </table>
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

import { profile } from 'apis/administration';
export default {
  mixins: [tip],
  props: {
    servicesData: {
      type: Object
    }
  },
  data() {
    return {
      serCrt: {
        id: this.guid() + 'ser',
        name: '',
        profile: ''
      },
      serParam: this.servicesData.serData,
      rulesSer: {
        name: [{ required: true, message: 'field required' }]
      },

      relCrt: {
        id: this.guid() + 'rel',
        name: '',
        address: ''
      },
      relParam: this.servicesData.relData,
      rulesRel: {
        name: [{ required: true, message: 'field required' }],
        address: [{ required: true, message: 'field required' }]
      },

      temValue: this.servicesData.temValue,
      temParam: {},

      networkname: this.servicesData.networkNameLan,
      profileList: []
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    async getProfile() {
      const { result } = await profile({
        organization: this.servicesData.orguuid
      });
      this.profileList = result.dhcpV4Profiles.dhcpV4Profile;
    },
    addParam(type) {
      this.$refs[`form${type}`].validate(valid => {
        if (valid) {
          this[`${type}Param`].push({ ...this[`${type}Crt`] });
          this.networkname = this.networkname.filter(item => {
            return item !== this[`${type}Crt`].name;
          });
          if (type === 'ser') {
            this.serCrt = {
              id: this.guid() + 'ser',
              name: '',
              profile: ''
            };
          } else {
            this.relCrt = {
              id: this.guid() + 'rel',
              name: '',
              address: ''
            };
          }
        }
      });
    },
    delParam(id, type) {
      this[`${type}Param`].forEach(item => {
        if (item.id === id) {
          this.networkname.push(item.name);
        }
      });
      this[`${type}Param`] = this[`${type}Param`].filter(item => {
        return item.id !== id;
      });
    },
    temChange() {
      this.temParam = {
        statefulFW: this.temValue === 3 ? true : false,
        nextGenFW: this.temValue === 2 ? true : false
      };
    },
    param() {
      this.servicesParam = [...this.serParam, ...this.relParam];
      this.$emit('services-param', this.servicesParam, this.temParam);
    }
  }
};
</script>

<style lang="scss" scoped>
.serTable,
.relTable {
  width: 580px;
  height: 160px;
  background: #fff;
  th {
    width: 256px;
  }
}
.tmpTable {
  background: #fff;
  overflow: scroll;
  th {
    width: 160px;
  }
  th:nth-of-type(2) {
    width: 1030px;
  }
  td {
    /deep/.ant-radio-wrapper {
      text-align: center;
      width: 155px;
      span {
        font-size: 12px;
        color: #0f2c3e;
      }
    }
  }
}
</style>

<template>
  <div>
    <a-row class="tableSub" data-text="Inbound NAT" style="margin: 5px 0 20px;">
      <a-col
        class="inboundTable"
        :class="{ shadow: inboundData.vrfName.length < 1 }"
      >
        <a-form-model
          ref="formInb"
          :rules="rulesInb"
          :model="inbCrt"
          @validate="validate"
          hideRequiredMark
        >
          <table>
            <thead>
              <tr>
                <th class="mandatory">
                  <span>Name</span>
                </th>
                <th class="mandatory">
                  <span>WAN Network</span>
                </th>
                <th class="mandatory">
                  <span>LAN Routing Instance</span>
                </th>
                <th>
                  <span>Protocol</span>
                </th>
                <th class="mandatory">
                  <span>External Addresses</span>
                </th>
                <th>
                  <span>External Ports</span>
                </th>
                <th class="mandatory">
                  <span>Internal Addresses</span>
                </th>
                <th>
                  <span>Internal Ports</span>
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
                      v-model="inbCrt.name"
                    />
                  </a-form-model-item>
                </td>
                <td
                  @mouseenter="enter('wanNetworkName')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="wanNetworkName">
                    <a-select v-model="inbCrt.wanNetworkName">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in inboundData.networkNameWall"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td
                  @mouseenter="enter('lanRoutingInstance')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="lanRoutingInstance">
                    <a-select v-model="inbCrt.lanRoutingInstance">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in inboundData.vrfName"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-select @change="protChange" v-model="inbCrt.protocol">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option value="TCP">TCP</a-select-option>
                      >
                      <a-select-option value="UDP">UDP</a-select-option>
                      >
                      <a-select-option value="ICMP">ICMP</a-select-option>
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item prop="externalAddress">
                    <a-input
                      @mouseenter="enter('externalAddress')"
                      @mouseleave="leave"
                      @mousemove="updateXY"
                      v-model="inbCrt.externalAddress"
                    />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-input
                      :disabled="portDisabled"
                      v-model="inbCrt.externalPort"
                    />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item prop="internalAddress">
                    <a-input
                      @mouseenter="enter('internalAddress')"
                      @mouseleave="leave"
                      @mousemove="updateXY"
                      v-model="inbCrt.internalAddress"
                    />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-input
                      :disabled="portDisabled"
                      v-model="inbCrt.internalPort"
                    />
                  </a-form-model-item>
                </td>
                <td class="addBtn">
                  <button @click="addParam">+</button>
                </td>
              </tr>
              <tr v-for="item in inbParam" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.wanNetworkName }}</td>
                <td>{{ item.lanRoutingInstance }}</td>
                <td>{{ item.protocol }}</td>
                <td>{{ item.externalAddress }}</td>
                <td>{{ item.externalPort }}</td>
                <td>{{ item.internalAddress }}</td>
                <td>{{ item.internalPort }}</td>
                <td class="delBtn">
                  <a href="javascript:;" @click="delParam(item.id)"
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
    inboundData: {
      type: Object
    }
  },
  data() {
    return {
      inbCrt: {
        id: this.guid() + 'inb',
        name: '',
        wanNetworkName: '',
        lanRoutingInstance: '',
        protocol: '',
        externalAddress: '',
        externalPort: null,
        internalAddress: '',
        internalPort: null
      },
      inbParam: this.inboundData.inbdata,
      rulesInb: {
        name: [{ required: true, message: 'field required' }],
        externalAddress: [{ required: true, message: 'field required' }],
        internalAddress: [{ required: true, message: 'field required' }],
        wanNetworkName: [{ required: true, message: 'field required' }],
        lanRoutingInstance: [{ required: true, message: 'field required' }]
      },
      portDisabled: true
    };
  },
  methods: {
    addParam() {
      this.$refs.formInb.validate(valid => {
        if (valid) {
          if (this.inbParam.length > 0) {
            const hasItem = this.inbParam.some(item => {
              return item.name === this.inbCrt.name;
            });
            if (!hasItem) {
              this.inbParam.push({ ...this.inbCrt });
            }
          } else {
            this.inbParam.push({ ...this.inbCrt });
          }
          this.inbCrt = {
            id: this.guid() + 'spl',
            name: '',
            protocol: '',
            externalAddress: '',
            externalPort: null,
            internalAddress: '',
            internalPort: null,
            lanRoutingInstance: '',
            wanNetworkName: ''
          };
        }
      });
    },
    delParam(id) {
      this.inbParam = this.inbParam.filter(item => {
        return item.id !== id;
      });
    },
    protChange(value) {
      this.portDisabled = !(value === 'TCP' || value === 'UDP');
    },
    param() {
      this.$emit('inbound-param', this.inbParam);
    }
  }
};
</script>

<style lang="scss" scoped>
.inboundTable {
  height: 160px;
  background: #fff;
  th {
    width: 152px;
  }
}
</style>

<template>
  <div>
    <a-row class="tableSub" data-text="BGP" style="margin:5px 0 20px">
      <a-col
        class="bgpTable"
        :class="{ shadow: routingData.networkNameWall.length < 1 }"
      >
        <a-form-model
          ref="formBgp"
          :rules="rulesBgp"
          :model="bgpCrt"
          @validate="validate"
          hideRequiredMark
        >
          <table>
            <thead>
              <tr>
                <th class="mandatory">
                  <span>Network</span>
                </th>
                <th>
                  <span>iBGP</span>
                </th>
                <th class="mandatory">
                  <span>Local AS</span>
                </th>
                <th class="mandatory">
                  <span>Neighbor IP</span>
                </th>
                <th class="mandatory">
                  <span>Peer AS</span>
                </th>
                <th>
                  <span>BFD</span>
                </th>
                <th style="width:50px"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  @mouseenter="enter('networkName')"
                  @mouseleave="leave"
                  @mousemove="updateXY"
                >
                  <a-form-model-item prop="networkName">
                    <a-select @change="bgpChange" v-model="bgpCrt.networkName">
                      <a-select-option value="" selected
                        >--Select--</a-select-option
                      >
                      <a-select-option
                        v-for="item in routingData.networkName"
                        :key="item"
                        :value="item"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-checkbox v-model="bgpCrt.ibgp" />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item prop="localAS">
                    <a-input
                      :disabled="bgpDisabled"
                      @mouseenter="enter('localAS')"
                      @mouseleave="leave"
                      @mousemove="updateXY"
                      v-model="bgpCrt.localAS"
                    />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item prop="neighborName">
                    <a-input
                      @mouseenter="enter('neighborName')"
                      @mouseleave="leave"
                      @mousemove="updateXY"
                      v-model="bgpCrt.neighborName"
                    />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item prop="peerAS">
                    <a-input
                      :disabled="bgpCrt.ibgp"
                      @mouseenter="enter('peerAS')"
                      @mouseleave="leave"
                      @mousemove="updateXY"
                      v-model="bgpCrt.peerAS"
                    />
                  </a-form-model-item>
                </td>
                <td>
                  <a-form-model-item>
                    <a-checkbox v-model="bgpCrt.bfd" />
                  </a-form-model-item>
                </td>
                <td class="addBtn">
                  <button @click="addParam('bgp')">+</button>
                </td>
              </tr>
              <template v-for="item in bgpParam">
                <tr v-for="i in item.neighbors" :key="i.id">
                  <td>{{ item.networkName }}</td>
                  <td>{{ i.ibgp ? 'true' : 'false' }}</td>
                  <td>{{ item.localAS }}</td>
                  <td>{{ i.neighborName }}</td>
                  <td>{{ i.peerAS }}</td>
                  <td>{{ i.bfd ? 'true' : 'false' }}</td>
                  <td class="delBtn">
                    <a href="javascript:;" @click="delParam(i.id, 'bgp')"
                      ><img src="@/assets/images/organize/del.png" alt
                    /></a>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </a-form-model>
      </a-col>
    </a-row>
    <a-row type="flex" align="top" justify="space-between">
      <a-col class="tableSub" data-text="OSPF / OSPFv3">
        <div
          class="ospfTable"
          :class="{ shadow: routingData.networkNameWall.length < 1 }"
        >
          <a-form-model
            ref="formOsp"
            :rules="rulesOsp"
            :model="ospCrt"
            @validate="validate"
            hideRequiredMark
          >
            <table>
              <thead>
                <tr>
                  <th class="mandatory">
                    <span>Network Name</span>
                  </th>
                  <th class="mandatory">
                    <span>Area</span>
                  </th>
                  <th>
                    <span>BFD</span>
                  </th>
                  <th style="width:50px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    @mouseenter="enter('networkName')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  >
                    <a-form-model-item prop="networkName">
                      <a-select v-model="ospCrt.networkName">
                        <a-select-option value="" selected
                          >--Select--</a-select-option
                        >
                        <a-select-option
                          v-for="item in routingData.networkName"
                          :key="item"
                          :value="item"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item prop="area">
                      <a-input
                        @mouseenter="enter('area')"
                        @mouseleave="leave"
                        @mousemove="updateXY"
                        v-model="ospCrt.area"
                      />
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item>
                      <a-checkbox v-model="ospCrt.bfd" />
                    </a-form-model-item>
                  </td>
                  <td class="addBtn">
                    <button @click="addParam('ospf')">+</button>
                  </td>
                </tr>
                <tr v-for="item in ospParam" :key="item.id">
                  <td>{{ item.networkName }}</td>
                  <td>{{ item.area }}</td>
                  <td>{{ item.bfd ? 'true' : 'false' }}</td>
                  <td class="delBtn">
                    <a href="javascript:;" @click="delParam(item.id, 'ospf')"
                      ><img src="@/assets/images/organize/del.png" alt
                    /></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-form-model>
        </div>
      </a-col>
      <a-col class="tableSub" data-text="Static Routes">
        <div
          class="staRouterTable"
          :class="{ shadow: routingData.networkNameLan.length < 1 }"
        >
          <a-form-model
            ref="formRi"
            :rules="rulesRi"
            :model="riCrt"
            @validate="validate"
            hideRequiredMark
          >
            <table>
              <thead>
                <tr>
                  <th class="mandatory">
                    <span>Routing Instance</span>
                  </th>
                  <th class="mandatory">
                    <span>Prefix</span>
                  </th>
                  <th class="mandatory">
                    <span>Nexthop</span>
                  </th>
                  <th style="width:50px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    @mouseenter="enter('routingInstance')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                  >
                    <a-form-model-item prop="routingInstance">
                      <a-select v-model="riCrt.routingInstance">
                        <a-select-option value="" selected
                          >--Select--</a-select-option
                        >
                        <a-select-option
                          v-for="item in routingData.vrfName"
                          :key="item"
                          :value="item"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item prop="prefixStr">
                      <a-input
                        @mouseenter="enter('prefixStr')"
                        @mouseleave="leave"
                        @mousemove="updateXY"
                        v-model="riCrt.prefixStr"
                      />
                    </a-form-model-item>
                  </td>
                  <td>
                    <a-form-model-item prop="nexthop">
                      <a-input
                        @mouseenter="enter('nexthop')"
                        @mouseleave="leave"
                        @mousemove="updateXY"
                        v-model="riCrt.nexthop"
                      />
                    </a-form-model-item>
                  </td>
                  <td class="addBtn">
                    <button @click="addParam('ri')">+</button>
                  </td>
                </tr>
                <template v-for="item in riParam">
                  <tr v-for="i in item.prefixes" :key="i.id">
                    <td>{{ item.routingInstance }}</td>
                    <td>{{ i.prefixStr }}</td>
                    <td>{{ i.nexthop }}</td>
                    <td class="delBtn">
                      <a href="javascript:;" @click="delParam(i.id, 'ri')"
                        ><img src="@/assets/images/organize/del.png" alt
                      /></a>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </a-form-model>
        </div>
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
import common from '@/mixins/tip';

export default {
  mixins: [common],
  props: {
    routingData: {
      type: Object
    }
  },
  data() {
    return {
      bgpCrt: {
        networkName: '',
        localAS: '',
        ibgp: false,
        neighborName: '',
        peerAS: null,
        bfd: false
      },
      bgpDisabled: false,
      bgpParam: this.routingData.bgpData,
      rulesBgp: {
        networkName: [{ required: true, message: 'field required' }],
        localAS: [{ required: true, message: 'field required' }],
        neighborName: [{ required: true, message: 'field required' }],
        peerAS: [{ required: true, message: 'field required' }]
      },

      ospCrt: {
        id: this.guid() + 'osp',
        networkName: '',
        area: '',
        bfd: false
      },
      ospParam: this.routingData.ospfData,
      rulesOsp: {
        networkName: [{ required: true, message: 'field required' }],
        area: [{ required: true, message: 'field required' }]
      },

      riCrt: {
        routingInstance: '',
        prefixStr: '',
        nexthop: ''
      },
      riParam: this.routingData.riData,
      rulesRi: {
        routingInstance: [{ required: true, message: 'field required' }],
        prefixStr: [{ required: true, message: 'field required' }],
        nexthop: [{ required: true, message: 'field required' }]
      }
    };
  },
  created() {
    console.log(this.routingData);
  },
  methods: {
    addParam(type) {
      switch (true) {
        // bgp 数据
        case type === 'bgp':
          this.$refs.formBgp.validate(valid => {
            if (valid) {
              const neighborsData = {
                id: this.guid() + 'neighbors',
                bfd: this.bgpCrt.bfd,
                ibgp: this.bgpCrt.ibgp,
                neighborName: this.bgpCrt.neighborName,
                peerAS: this.bgpCrt.peerAS
              };
              const bgpData = {
                networkName: this.bgpCrt.networkName,
                localAS: this.bgpCrt.localAS,
                neighbors: [
                  {
                    id: this.guid() + 'bgp',
                    ibgp: this.bgpCrt.ibgp,
                    neighborName: this.bgpCrt.neighborName,
                    peerAS: this.bgpCrt.peerAS,
                    bfd: this.bgpCrt.bfd
                  }
                ]
              };

              if (this.bgpParam.length > 0) {
                this.bgpParam.forEach(item => {
                  if (item.networkName === this.bgpCrt.networkName) {
                    const hasItem = item.neighbors.some(i => {
                      return (
                        String(i.ibgp) === String(neighborsData.ibgp) &&
                        i.neighborName === neighborsData.neighborName &&
                        i.peerAS === neighborsData.peerAS
                      );
                    });

                    if (!hasItem) {
                      item.neighbors.push(neighborsData);
                    }
                  } else {
                    this.bgpParam.push(bgpData);
                  }
                });
              } else {
                this.bgpParam.push(bgpData);
              }

              this.bgpCrt = {
                networkName: '',
                localAS: '',
                ibgp: false,
                neighborName: '',
                peerAS: '',
                bfd: false
              };
              this.bgpDisabled = false;
            }
          });
          break;
        // ospf数据
        case type === 'ospf':
          this.$refs.formOsp.validate(valid => {
            if (valid) {
              if (this.ospParam.length > 0) {
                const hasItem = this.ospParam.some(item => {
                  return item.networkName === this.ospCrt.networkName;
                });
                if (!hasItem) {
                  this.ospParam.push(this.ospCrt);
                }
              } else {
                this.ospParam.push(this.ospCrt);
              }
              this.ospCrt = {
                id: this.guid() + 'osp',
                networkName: '',
                area: '',
                bfd: false
              };
            }
          });
          break;
        // routingInstances数据
        case type === 'ri':
          this.$refs.formRi.validate(valid => {
            if (valid) {
              if (this.riParam.length > 0) {
                const hasItem = this.riParam.some(item => {
                  if (item.routingInstance === this.riCrt.routingInstance) {
                    return item.prefixes.some(i => {
                      return (
                        i.prefix === this.riCrt.prefix &&
                        i.nexthop === this.riCrt.nexthop
                      );
                    });
                  }
                });

                if (!hasItem) {
                  this.riParam.forEach(item => {
                    if (item.routingInstance === this.riCrt.routingInstance) {
                      item.prefixes.push({
                        id: this.guid() + 'ri',
                        prefixStr: this.riCrt.prefixStr,
                        nexthop: this.riCrt.nexthop
                      });
                    } else {
                      const data = {
                        routingInstance: this.riCrt.routingInstance,
                        prefixes: [
                          {
                            id: this.guid() + 'ri',
                            prefixStr: this.riCrt.prefixStr,
                            nexthop: this.riCrt.nexthop
                          }
                        ]
                      };
                      this.riParam.push(data);
                    }
                  });
                }
              } else {
                const data = {
                  routingInstance: this.riCrt.routingInstance,
                  prefixes: [
                    {
                      id: this.guid() + 'ri',
                      prefixStr: this.riCrt.prefixStr,
                      nexthop: this.riCrt.nexthop
                    }
                  ]
                };
                this.riParam.push(data);
              }
              this.riCrt = {
                routingInstance: '',
                prefixStr: '',
                nexthop: ''
              };
            }
          });
          break;
      }
    },
    bgpChange(value) {
      this.bgpParam.forEach(item => {
        if (item.networkName === value) {
          this.bgpCrt.localAS = item.localAS;
          this.bgpDisabled = true;
        } else {
          this.bgpCrt.localAS = '';
          this.bgpDisabled = false;
        }
      });
    },
    delParam(id, type) {
      switch (true) {
        case type === 'bgp':
          this.bgpParam.forEach(item => {
            if (item.neighbors.length === 1) {
              this.bgpParam = this.bgpParam.filter(item => {
                return item.neighbors[0].id !== id;
              });
            } else {
              item.neighbors = item.neighbors.filter(i => {
                return i.id !== id;
              });
            }
          });

          break;

        case type === 'ospf':
          this.ospParam = this.ospParam.filter(item => {
            return item.id !== id;
          });
          break;

        case type === 'ri':
          this.riParam = this.riParam.filter(item => {
            return item.id !== id;
          });

          this.riParam.forEach(item => {
            if (item.prefixes.length > 1) {
              item.prefixes = item.prefixes.filter(i => {
                return i !== id;
              });
            } else {
              this.riParam = this.riParam.filter(item => {
                return item.prefixes[0].id !== id;
              });
            }
          });

          break;
      }
    },
    param() {
      this.$emit('routing-param', this.bgpParam, this.ospParam, this.riParam);
    }
  },
  watch: {
    'bgpCrt.ibgp'(val) {
      if (!val) {
        this.rulesBgp.peerAS = [{ required: true, message: 'field required' }];
      } else {
        this.rulesBgp.peerAS = null;
        this.bgpCrt.peerAS = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bgpTable {
  height: 230px;
  background: #fff;
  th {
    width: 194px;
  }
}
.ospfTable {
  width: 580px;
  height: 230px;
  background: #fff;
  th {
    width: 177px;
  }
}
.staRouterTable {
  width: 580px;
  height: 175px;
  background: #fff;
  th {
    width: 177px;
  }
}
</style>

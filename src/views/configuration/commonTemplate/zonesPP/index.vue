<template>
  <div class="main-con">
    <!-- 头部信息 -->
    <Pagination
      :total="totalCount"
      :page-size="listParam.pageSize"
      :flag="true"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="createItem"
      @delete-item="deleteItem"
      @search="search"
      @cancel-search="cancelSearch"
    />
    <!-- 表单主体内容 -->
    <v-table
      is-horizontal-resize
      is-vertical-resize
      column-width-drag
      :columns="columns"
      :title-rows="titleRows"
      :table-data="tableData"
      :select-change="delItem"
      style="width:100%;"
      isFrozen="true"
      @on-custom-comp="modifyItem"
      error-content="Temporarily no data"
    ></v-table>
    <!-- 数据添加编辑弹窗 -->
    <a-modal
      v-drag
      v-model="visible"
      :title="modalTitle"
      :width="645"
      wrapClassName="form-wrap"
      :afterClose="cleanData"
      :maskClosable="false"
    >
      <a-form-model
        :model="formParam"
        ref="form"
        :rules="rules"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
        :maskClosable="false"
      >
        <a-tabs
          @tabClick="tabClick"
          class="tabs-wrap"
          type="card"
          :activeKey="actKey"
        >
          <!-- General -->
          <a-tab-pane key="1" tab="General">
            <a-row type="flex" justify="space-between" align="top">
              <!-- Name -->
              <a-col
                :span="24"
                @mouseenter="enter('name')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-form-model-item class="mandatory" label="Name" prop="name">
                  <a-input
                    v-model="formParam.name"
                    :disabled="modalType === 'edt'"
                  />
                </a-form-model-item>
              </a-col>
              <!-- Description -->
              <a-col :span="24">
                <a-form-model-item label="Description">
                  <a-input v-model="formParam.description" />
                </a-form-model-item>
              </a-col>
              <!-- Tags -->
              <a-col :span="24">
                <a-form-model-item label="Tags">
                  <TagInput @addtag="addtag" :tags="formParam.tag" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Flood -->
          <a-tab-pane key="2" tab="Flood">
            <div class="tableSub">
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <span>Protocol</span>
                      </th>
                      <th>
                        <span>Enable</span>
                      </th>
                      <th>
                        <span
                          >Alarm Rate <br />
                          Packets/sec</span
                        >
                      </th>
                      <th>
                        <span
                          >Actival Rate <br />
                          Packets/sec</span
                        >
                      </th>
                      <th>
                        <span
                          >Maximum Rate <br />
                          Packets/sec</span
                        >
                      </th>
                      <th>
                        <span
                          >Drop Period <br />
                          Seconds</span
                        >
                      </th>
                      <th>
                        <span>Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in formParam.floodLists"
                      :key="item.protocol"
                    >
                      <td>
                        {{
                          item.protocol === 'other-ip'
                            ? 'Other IP'
                            : item.protocol === 'icmpv6'
                            ? 'ICMPv6'
                            : item.protocol.toUpperCase()
                        }}
                      </td>
                      <td>
                        <input v-model="item.enable" type="checkbox" />
                      </td>
                      <td><input v-model="item.alarmRate" type="text" /></td>
                      <td><input v-model="item.activateRate" type="text" /></td>
                      <td><input v-model="item.maximalRate" type="text" /></td>
                      <td><input v-model="item.dropPeriod" type="text" /></td>
                      <td>
                        <select
                          v-if="item.protocol === 'tcp'"
                          v-model="item.action"
                        >
                          <option value="random-early-drop"
                            >Random Early Drop</option
                          >
                          <option value="syn-cookie">Cookies</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </a-tab-pane>
          <!-- Scan -->
          <a-tab-pane key="3" tab="Scan">
            <div class="tableSub">
              <div>
                <table>
                  <thead>
                    <tr>
                      <th :style="{ width: '93px' }">
                        <span>Scan</span>
                      </th>
                      <th :style="{ width: '62px' }">
                        <span>Enable</span>
                      </th>
                      <th :style="{ width: '83px' }">
                        <span>Actions</span>
                      </th>
                      <th :style="{ width: '193px' }">
                        <span>Interval(sec)</span>
                      </th>
                      <th :style="{ width: '193px' }">
                        <span>Threshold(Events)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in formParam.scanList" :key="item.protocol">
                      <td>
                        {{
                          item.protocol === 'hostseep'
                            ? 'HostSweep'
                            : item.protocol.toUpperCase()
                        }}
                      </td>
                      <td>
                        <input v-model="item.enable" type="checkbox" />
                      </td>
                      <td>
                        <select v-model="item.action">
                          <option value="allow">Allow</option>
                          <option value="alert">Alert</option>
                        </select>
                      </td>
                      <td><input v-model="item.interval" type="text" /></td>
                      <td><input v-model="item.threshold" type="text" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </a-tab-pane>
          <!-- Packet Based Attack Protection -->
          <a-tab-pane key="4" tab="Packet Based Attack Protection">
            <a-tabs type="card" class="pbap">
              <a-tab-pane key="5" tab="UDP/TCP/IP Discard">
                <a-row>
                  <a-col>
                    <input
                      v-modle="formParam.ipDiscardIpFrag"
                      type="checkbox"
                    />
                    IP Frag
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.ipDiscardIpSpoof"
                      type="checkbox"
                    />
                    IP Spoof
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.tcpRejectNonSyn"
                      type="checkbox"
                    />
                    Reject Non-SYN TCP
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.udpDiscardMalFormed"
                      type="checkbox"
                    />
                    UDP Malformed
                  </a-col>
                </a-row>
                <div class="ipOpt">
                  <a-row>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardSecurity"
                        type="checkbox"
                      />
                      Security
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardStream"
                        type="checkbox"
                      />
                      Stream
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardUnknown"
                        type="checkbox"
                      />
                      Unknown
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardMalformed"
                        type="checkbox"
                      />
                      Malformed
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardLooseSourceRouting"
                        type="checkbox"
                      />
                      Loose-source Routing
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardStrictSourceRouting"
                        type="checkbox"
                      />
                      Strict-source Routing
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardTimestamp"
                        type="checkbox"
                      />
                      Timestamp
                    </a-col>
                    <a-col>
                      <input
                        v-modle="formParam.ipDiscardRecordRoute"
                        type="checkbox"
                      />
                      Record Route
                    </a-col>
                  </a-row>
                </div>
              </a-tab-pane>
              <a-tab-pane key="6" tab="ICMP">
                <a-row>
                  <a-col>
                    <input
                      v-modle="formParam.icmpDiscardPingZeroId"
                      type="checkbox"
                    />
                    Ping Zero ID
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.icmpdiscardFrag"
                      type="checkbox"
                    />
                    Fragment
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.icmpDiscardLargePacket"
                      type="checkbox"
                    />
                    Large Packet (length > 1024 bytes)
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.icmpDiscardErrorMessage"
                      type="checkbox"
                    />
                    Error Message
                  </a-col>
                  <a-col>
                    <input
                      v-modle="formParam.icmpDiscardMalformed"
                      type="checkbox"
                    />
                    Malformed Packet
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>

      <template slot="footer">
        <a-button type="primary" key="Ok" @click="handleOk" :loading="loading"
          >Ok</a-button
        >
        <a-button key="Cancel" @click="visible = false">Cancel</a-button>
      </template>
    </a-modal>
    <!-- 表单验证提示 -->
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
import { mapState } from 'vuex';
import { columns, titleRows } from './table';
import { name } from '@/validate/common';
import common from '@/mixins/common';
import { removeNull } from '@/utils/assits';

import Pagination from 'components/Pagination';
import TagInput from 'components/TagInput';

import {
  zonePPLists,
  zonePPCreate,
  zonePPSearch,
  zonePPModify,
  zonePPDelete
} from 'apis/zoneQos';

export default {
  mixins: [common],
  data() {
    return {
      actKey: '1',
      columns,
      titleRows,
      // 列表查询参数
      admodleShow: 0, //addModle显示隐藏
      // addModle 标题
      interfaceTit: 'Interfaces',
      routingTit: 'Routing Instances',
      networkTit: 'Networks',
      organTit: 'Organizations',

      // 新建更新数据模型
      formParam: {
        objectType: 'template',
        objectName: '',
        orgName: '',
        name: '',
        description: '',
        tag: [],
        floodLists: [
          {
            protocol: 'tcp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: 'random-early-drop'
          },
          {
            protocol: 'udp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'icmp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'other-ip',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'sctp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'icmpv6',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          }
        ],
        scanList: [
          {
            protocol: 'tcp',
            enable: false,
            interval: '300',
            threshold: '300',
            action: 'allow'
          },
          {
            protocol: 'udp',
            enable: false,
            interval: '300',
            threshold: '300',
            action: 'allow'
          },
          {
            protocol: 'hostseep',
            enable: false,
            interval: '300',
            threshold: '300',
            action: 'allow'
          }
        ],
        ipDiscardIpSpoof: false,
        ipDiscardIpFrag: false,
        ipDiscardStrictSourceRouting: false,
        ipDiscardLooseSourceRouting: false,
        ipDiscardTimestamp: false,
        ipDiscardRecordRoute: false,
        ipDiscardSecurity: false,
        ipDiscardStream: false,
        ipDiscardUnknown: false,
        ipDiscardMalformed: false,
        tcpRejectNonSyn: false,
        udpDiscardMalFormed: false,
        icmpdiscardFrag: false,
        icmpDiscardErrorMessages: false,
        icmpDiscardPingZeroId: false,
        icmpDiscardLargePacket: false,
        icmpDiscardMalformed: false
      },
      // 列表数据模板
      listParam: {
        objectName: '',
        orgName: '',
        offset: 0,
        limit: 20,
        objectType: 'template'
      },
      //查询数据模型
      searchParam: {
        objectType: 'template',
        objectName: '',
        orgName: '',
        name: ''
      },
      //删除数据模型
      delParam: {
        objectType: 'template',
        objectName: '',
        orgName: '',
        name: ''
      },
      // 表单校验规则
      rules: {
        name: [{ validator: name }]
      }
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  created() {
    //获取zone列表
    this.lists();
  },
  methods: {
    tabClick(key) {
      this.actKey = key;
    },
    // 添加tag标签
    addtag(tag) {
      this.formParam.tag = tag;
    },
    // 获取zone列表
    async lists() {
      this.listParam = {
        objectName: this.deviceName,
        orgName: this.organization,
        offset: this.offset,
        objectType: 'template',
        limit: this.pageSize
      };
      const { result } = await zonePPLists(this.listParam);
      this.totalCount = result.totalCount;
      console.log('result.data', result.data);

      this.tableData = [];
      result.data.forEach(item => {
        const rowData = {
          name: item.name,
          ftcp: item.floodLists[0].enable,
          fudp: item.floodLists[1].enable,
          ficmp: item.floodLists[2].enable,
          fotherip: item.floodLists[3].enable,
          fsctp: item.floodLists[4].enable,
          ficmpv6: item.floodLists[5].enable,
          stcp: item.scanList[0].enable,
          sudp: item.scanList[1].enable,
          hostsweep: item.scanList[2] ? item.scanList[2].enable : null
        };
        this.tableData.push(rowData);
      });
    },

    //新建zone
    async createItem() {
      this.modalTitle = 'Add Zone';
      this.modalType = 'add';
      this.visible = true;
    },

    //编辑zone
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Zone';
      this.modalType = 'edt';
      this.searchParam = {
        objectName: this.deviceName,
        orgName: this.organization,
        name: rowData.name,
        objectType: 'template'
      };
      const { result } = await zonePPSearch(this.searchParam);
      console.log('result', result);
      this.formParam = Object.assign(this.formParam, removeNull(result));
      this.visible = true;
    },

    //获取删除表单的name
    delItem(selection, rowData) {
      // 添加单选
      const data = [];
      this.tableData.map(item => {
        item.name != rowData.name
          ? (item._checked = false)
          : (item._checked = true);
        data.push(item);
      });
      this.tableData = data;
      this.delParam.name = rowData.name;
    },
    // 删除选中zone
    async deleteItem() {
      this.delParam.objectName = this.deviceName;
      this.delParam.orgName = this.organization;
      const res = await zonePPDelete(this.delParam);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('zone删除成功！');
      this.lists();
    },

    //表单提交
    async handleOk() {
      this.formParam.objectName = this.deviceName;
      this.formParam.orgName = this.organization;
      // 新建zone数据
      if (this.modalType === 'add') {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loading = true;
            const addRes = await zonePPCreate(this.formParam);
            this.loading = false;
            if (addRes.status !== '0000')
              return this.$message.error(addRes.message);
            this.$message.success('zone创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      // 修改zone数据
      if (this.modalType === 'edt') {
        this.$refs.form.validateField(['name'], async () => {
          if (!this.message.name) {
            this.loading = true;
            const edtRes = await zonePPModify(this.formParam);
            this.loading = false;
            if (edtRes.status !== '0000')
              return this.$message.error(edtRes.message);
            this.$message.success('zone更新成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
    },
    // 关闭弹窗清楚表单 验证信息
    cleanData() {
      this.$refs.form.clearValidate();
      this.formParam = {
        objectType: 'template',
        objectName: '',
        orgName: '',
        name: '',
        description: '',
        tag: [],
        floodLists: [
          {
            protocol: 'tcp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: 'random-early-drop'
          },
          {
            protocol: 'udp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'icmp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'other-ip',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'sctp',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          },
          {
            protocol: 'icmpv6',
            enable: false,
            alarmRate: '100000',
            activateRate: '100000',
            maximalRate: '100000',
            dropPeriod: '300',
            action: ''
          }
        ],
        scanList: [
          {
            protocol: 'tcp',
            enable: false,
            interval: '300',
            threshold: '300',
            action: 'allow'
          },
          {
            protocol: 'udp',
            enable: false,
            interval: '300',
            threshold: '300',
            action: 'allow'
          },
          {
            protocol: 'hostseep',
            enable: false,
            interval: '300',
            threshold: '300',
            action: 'allow'
          }
        ],
        ipDiscardIpSpoof: false,
        ipDiscardIpFrag: false,
        ipDiscardStrictSourceRouting: false,
        ipDiscardLooseSourceRouting: false,
        ipDiscardTimestamp: false,
        ipDiscardRecordRoute: false,
        ipDiscardSecurity: false,
        ipDiscardStream: false,
        ipDiscardUnknown: false,
        ipDiscardMalformed: false,
        tcpRejectNonSyn: false,
        udpDiscardMalFormed: false,
        icmpdiscardFrag: false,
        icmpDiscardErrorMessages: false,
        icmpDiscardPingZeroId: false,
        icmpDiscardLargePacket: false,
        icmpDiscardMalformed: false
      };
      this.actKey = '1';
      this.message = {};
      this.loading = false;
    }
  },
  components: {
    Pagination,
    TagInput
  },
  directives: {
    // 拖拽自定义指令
    drag(el) {
      console.log('移动', el);
      // 将ant-modal的position改为静态，使拖拽框按照电脑屏幕定位
      // el.children[1].children[0].style.position = 'static';
      // 获取到ant-modal-content元素
      let targetEl = el.children[1].children[0].children[1];
      // targetEl.style.top = '100px';
      targetEl.onmousedown = function(e) {
        // 点下鼠标的位置
        let startX = e.pageX;
        let startY = e.pageY;
        // 点下鼠标的元素的位置
        let offsetX = targetEl.offsetLeft;
        let offsetY = targetEl.offsetTop;
        document.onmousemove = function(e) {
          // 计算出元素的left 和 top 值
          let dx = offsetX + (e.pageX - startX);
          let dy = offsetY + (e.pageY - startY);
          // // 进行拖拽范围的限制(不能超出屏幕)
          // dx = Math.max(0, dx);
          // dy = Math.max(0, dy);
          // let scrollWidth = window.innerWidth - targetEl.offsetWidth;
          // let scrollHeight = window.innerHeight - targetEl.offsetHeight;
          // dx = Math.min(scrollWidth, dx);
          // dy = Math.min(scrollHeight, dy);
          // 设置元素的left和top值，实现拖拽
          targetEl.style.left = dx + 'px';
          targetEl.style.top = dy + 'px';
        };
        // 鼠标弹起，取消鼠标移动事件
        targetEl.onmouseup = function() {
          document.onmousemove = null;
        };
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.tableSub {
  background: #fff;
  padding: 0;
  &::before {
    display: none;
  }
  div {
    table {
      thead {
        th {
          padding: 0 5px;
        }
      }
      tbody {
        tr {
          border: 0;
          height: 28px;
          td {
            border: 1px solid #ddd;
            text-align: center;
            padding: 0;
            input[type='checkbox'] {
              margin: 0 !important;
              width: auto;
            }
            input[type='text'],
            select {
              margin: 0 !important;
              border: 1px solid #b0c7d5;
              padding: 0px 3px;
              height: 20px;
              border-radius: 4px;
              color: #0f2c3e;
              font-size: 12px;
              line-height: 18px;
              width: 90%;
            }
          }
          td:nth-of-type(1) {
            text-align: left;
            padding-left: 5px;
          }
        }
      }
    }
  }
}
.pbap {
  /deep/.ant-tabs-nav {
    .ant-tabs-tab {
      border: 0;
      color: #fff;
      padding: 0 0 5px 0;
      font-size: 12px;
      line-height: 22px;
      background: transparent;
      margin-right: 16px;
    }
    .ant-tabs-ink-bar {
      background: #a7d054;
      height: 3px;
      visibility: visible;
    }
  }
  .ant-tabs-tabpane {
    color: #f9f9f9;
    font-size: 12px;
    line-height: 18px;
    .ipOpt {
      border: 1px solid #456880;
      padding: 18px 10px 10px;
      border-radius: 4px;
      margin-bottom: 5px;
      margin-top: 14px;
      position: relative;
      &::before {
        content: 'IP Options';
        position: absolute;
        font-size: 12px;
        line-height: 18px;
        color: #fff;
        background: #507691;
        border-radius: 4px;
        padding: 2px 5px;
        left: 10px;
        top: 0;
        transform: translateY(-50%);
      }
    }
  }
}
</style>

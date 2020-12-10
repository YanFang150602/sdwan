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
      @cancelSearch="cancelSearch"
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
      style="width: 100%;"
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
        :model="formParam.data"
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
                :span="17"
                @mouseenter="enter('name')"
                @mouseleave="leave"
                @mousemove="updateXY"
              >
                <a-form-model-item class="mandatory" label="Name" prop="name">
                  <a-input
                    :disabled="modalType === 'edt'"
                    v-model="formParam.data.name"
                  />
                </a-form-model-item>
              </a-col>
              <!-- Session Timeout(secs) -->
              <a-col :span="6">
                <a-form-model-item label="Session Timeout(secs)">
                  <a-input v-model="formParam.data.setSessionTimeout" />
                </a-form-model-item>
              </a-col>
              <!-- Description -->
              <a-col :span="24">
                <a-form-model-item label="Description">
                  <a-input v-model="formParam.data.description" />
                </a-form-model-item>
              </a-col>
              <!-- Tags -->
              <a-col :span="24">
                <a-form-model-item label="Tags">
                  <TagInput @addtag="addtag" :tags="formParam.data.tag" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Source/Destination -->
          <a-tab-pane :forceRender="true" key="2" tab="Source/Destination">
            <a-row
              class="add-modle-con"
              type="flex"
              justify="space-between"
              align="top"
            >
              <a-col class="add-modle-item">
                <ListCrt
                  ref="zone"
                  :list-data="zoneListData"
                  :item-data="formParam.data.sourceZoneList"
                  :title="sourceZone"
                  @subdata="zoneSub"
                />
              </a-col>
              <a-col class="add-modle-item">
                <ListCrt
                  v-if="visible"
                  ref="desZone"
                  :list-data="zoneListData"
                  :item-data="formParam.data.destinationZoneList"
                  :title="destinationZone"
                  @subdata="desZoneSub"
                />
              </a-col>
              <a-col class="add-modle-item" :style="{ marginBottom: 0 }">
                <ListCrt
                  ref="address"
                  crt-type="sltGp"
                  :list-gp-data="addressListData"
                  :item-data="addressItemData"
                  :title="sourceAddress"
                  @subdata="addressSub"
                />
              </a-col>
              <a-col class="add-modle-item" :style="{ marginBottom: 0 }">
                <ListCrt
                  ref="desAddress"
                  crt-type="sltGp"
                  :list-gp-data="addressListData"
                  :item-data="desAddressItemData"
                  :title="destinationAddress"
                  @subdata="desAddressSub"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Headers/Schedule -->
          <a-tab-pane :forceRender="true" key="3" tab="Headers/Schedule">
            <a-row type="flex" justify="space-between" align="top">
              <a-col :style="{ width: '305px' }">
                <a-row
                  class="ipInfo"
                  type="flex"
                  justify="space-between"
                  align="top"
                >
                  <a-col :style="{ width: '115px' }">
                    <a-form-model-item label="IP Version">
                      <a-select v-model="formParam.data.ipVersion">
                        <a-select-option value="">--Select--</a-select-option>
                        <a-select-option value="ipv4">Ipv4</a-select-option>
                        <a-select-option value="ipv6">Ipv6</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :style="{ width: '115px', marginRight: '30px' }">
                    <a-form-model-item label="IP Flags">
                      <a-select v-model="formParam.data.ipFlags">
                        <a-select-option value="">--Select--</a-select-option>
                        <a-select-option value="DF"
                          >Don't Fragment</a-select-option
                        >
                        <a-select-option value="MF"
                          >More Fragment</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="22">
                    <a-row type="flex" justify="space-between" align="middle">
                      <a-col :span="24">
                        <a-form-model-item label="DSCP">
                          <TagInput
                            @addtag="addDacp"
                            :tags="formParam.data.dscp"
                          />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                    <a-row
                      class="ttlInfo"
                      type="flex"
                      justify="space-between"
                      align="middle"
                    >
                      <a-col :span="13">
                        <a-form-model-item label="Condition">
                          <a-select v-model="formParam.data.type">
                            <a-select-option value=""
                              >--Select--</a-select-option
                            >
                            <a-select-option value="Greater than or equal to"
                              >Greater than or equal to</a-select-option
                            >
                            <a-select-option value="Less than or equal to"
                              >Less than or equal to</a-select-option
                            >
                            <a-select-option value="Equal to"
                              >Equal to</a-select-option
                            >
                          </a-select>
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="10">
                        <a-form-model-item label="Value">
                          <a-input v-model="formParam.data.value" />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="otherInfo" :span="24">
                    <a-form-model-item
                      v-model="formParam.data.schedule"
                      :style="{ width: '170px' }"
                      label="Schedules"
                    >
                      <a-select placeholder="select">
                        <a-select-option
                          v-for="(item, index) in schedulesData"
                          :key="index"
                          :value="item"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :style="{ width: '305px', height: '230px' }">
                <h6
                  :style="{
                    fontSize: '12px',
                    lineHeight: '18px',
                    color: '#f9f9f9'
                  }"
                >
                  Services
                </h6>
                <div :style="{ height: '200px', background: '#fff' }">
                  <ListCrt
                    ref="service"
                    crt-type="sltGp"
                    :list-gp-data="servicesListData"
                    :item-data="[
                      ...formParam.data.predefinedServicesList,
                      ...formParam.data.userDefinedServices
                    ]"
                    :title="servicesList"
                    @subdata="serviceSub"
                  />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Layer2 -->
          <a-tab-pane key="4" tab="Layer2">
            <a-row
              :style="{ width: '360px' }"
              type="flex"
              justify="space-between"
              align="middle"
            >
              <a-col :style="{ width: '150px' }">
                <a-form-model-item label="MAC Address Type">
                  <a-select
                    placeholder="select"
                    v-model="formParam.data.destinationMacAddressType"
                  >
                    <a-select-option value="">--Select--</a-select-option>
                    <a-select-option value="broadcast"
                      >Broadcast</a-select-option
                    >
                    <a-select-option value="multicast"
                      >Multicast</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :style="{ width: '180px' }">
                <a-form-model-item label="IEEE 802 1p Values">
                  <a-input />
                </a-form-model-item>
              </a-col>
            </a-row>
            <div class="ethernet">
              <a-radio-group
                name="radioGroup"
                v-model="ethernet"
                @change="etherChange"
              >
                <a-radio :value="1">Ether Type</a-radio>
                <a-radio :value="2">Ether Type Value</a-radio>
                <a-radio :value="3">None</a-radio>
              </a-radio-group>
              <a-row :style="{ marginTop: '8px' }">
                <a-col>
                  <a-form-model-item
                    v-show="ethernet === 1"
                    :style="{ width: '170px' }"
                  >
                    <a-select
                      placeholder="select"
                      v-model="formParam.data.etherType"
                    >
                      <a-select-option value="">--Select--</a-select-option>
                      <a-select-option value="IPv4">IPv4</a-select-option>
                      <a-select-option value="IPv6">IPv6</a-select-option>
                      <a-select-option value="ARP">ARP</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col>
                  <a-form-model-item
                    v-show="ethernet === 2"
                    :style="{ width: '170px' }"
                  >
                    <a-input v-model="formParam.data.etherTypeValue" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <!-- Enforce -->
          <a-tab-pane key="5" tab="Enforce">
            <a-row type="flex" justify="space-between" align="top">
              <a-col :style="{ width: '305px' }">
                <div class="actionSet">
                  <a-radio-group
                    name="radioGroup"
                    v-model="formParam.data.setAction"
                  >
                    <a-radio value="allow">Allow</a-radio>
                    <a-radio value="deny">Deny</a-radio>
                  </a-radio-group>
                </div>
                <a-form-model-item label="Anchor Core Class">
                  <a-select placeholder="select"></a-select>
                </a-form-model-item>
                <div class="permit">
                  <a-form-model-item label="Permit Existing Flow">
                    <a-select placeholder="select">
                      <a-select-option value="Allow">Allow</a-select-option>
                      <a-select-option value="validate"
                        >validate</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </div>
              </a-col>
              <a-col :style="{ width: '305px' }">
                <div class="qosSet">
                  <a-form-model-item label="Qos Profile">
                    <a-select v-model="formParam.data.setQosProfile">
                      <a-select-option value="">--Select--</a-select-option>
                      <a-select-option
                        v-for="(item, index) in ProfileSetData"
                        :value="item"
                        :key="index"
                        >{{ item }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                </div>
              </a-col>
            </a-row>
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
import ListCrt from 'components/ListCrt';
import {
  qosPolicyLists,
  qosPolicySearch,
  qosPolicyCreate,
  qosPolicyModify,
  qosPolicyDelete,
  zoneList,
  addressList,
  ProfileSetting,
  serviceList,
  schedules
} from 'apis/zoneQos';

export default {
  mixins: [common],
  data() {
    return {
      actKey: '1', //tab切换控制
      ethernet: '3', //Ethernet提交框切换
      columns,
      titleRows,
      // addModle 标题
      sourceZone: 'Source Zone',
      destinationZone: 'Destination Zone',
      sourceAddress: 'Source Address',
      destinationAddress: 'Destination Address',
      servicesList: 'Service List',

      // zone列表数据
      zoneListData: [],
      // address列表数据
      addressListData: [],
      regionList: [],
      // ProfileSetting列表数据
      ProfileSetData: [],
      // schedules
      schedulesData: [],
      // servicesListData
      servicesListData: [],
      addressItemData: [], //address 传给组件值
      desAddressItemData: [], //desAddress 传给组件值
      // 新增修改数据模型
      formParam: {
        data: {
          description: '',
          destinationAddressGroupList: [],
          destinationAddressList: [],
          destinationMacAddressType: '',
          destinationNegate: '',
          destinationRegion: [],
          destinationZoneList: [],
          dscp: [],
          etherType: '',
          etherTypeValue: '',
          type: '',
          value: '',
          ieee802Value: [],
          ipFlags: '',
          ipVersion: '',
          name: '',
          predefinedServicesList: [],
          userDefinedServices: [],
          schedule: '',
          setAction: '',
          setPermitExistingFlow: '',
          setQosProfile: '',
          setSessionTimeout: '',
          sourceAddressGroupList: [],
          sourceAddressList: [],
          sourceNegate: '',
          sourceRegion: [],
          sourceZoneList: [],
          tag: []
        },
        deviceName: '',
        groupName: '',
        orgName: ''
      },
      // 列表数据模型
      listParam: {
        deviceName: '',
        orgName: '',
        offset: 0,
        pageSize: 20
      },
      //查询数据模型
      searchParam: {
        deviceName: '',
        orgName: '',
        name: ''
      },
      //删除数据模型
      delParam: {},
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
    this.lists();
  },

  methods: {
    // tab 验证切换
    tabClick(key) {
      this.actKey = key;
    },

    // 获取zoneList 列表
    async sourceDesZone() {
      const { result } = await zoneList({
        deviceName: this.deviceName,
        userName: this.organization
      });
      if (result && result.length > 0) this.zoneListData = result;
    },

    // 获取Zone Protection Profile 列表
    async sourceDesAddress() {
      const { result } = await addressList({
        deviceName: this.deviceName,
        orgName: this.organization
      });

      if (result && result.length > 0) this.addressListData = result;

      if (this.modalType === 'edt') {
        this.addressItemData = [
          ...this.formParam.data.sourceRegion,
          ...this.formParam.data.sourceAddressList,
          ...this.formParam.data.sourceAddressGroupList
        ];
        this.desAddressItemData = [
          ...this.formParam.data.destinationRegion,
          ...this.formParam.data.destinationAddressList,
          ...this.formParam.data.destinationAddressGroupList
        ];
        const address = [];
        this.addressItemData.forEach(item => {
          this.addressListData.forEach(i => {
            i.data.forEach(o => {
              if (item === o.value) {
                address.push(o.key);
              }
            });
          });
        });
        this.addressItemData = address;

        const desAddress = [];
        this.desAddressItemData.forEach(item => {
          this.addressListData.forEach(i => {
            i.data.forEach(o => {
              if (item === o.value) {
                desAddress.push(o.key);
              }
            });
          });
        });
        this.desAddressItemData = desAddress;
      }
    },

    // 获取Services列表
    async services() {
      const { result } = await serviceList({
        objectName: this.deviceName,
        orgName: this.organization,
        objectType: 'device'
      });

      if (result && result.length > 0) this.servicesListData = result;
    },

    // 获取Schedules列表
    async schedules() {
      const { result } = await schedules({
        deviceName: this.deviceName,
        userName: this.organization
      });
      if (result && result.length > 0) this.schedulesData = result;
    },

    // 获取ProfileSetting列表
    async ProfileSet() {
      const { result } = await ProfileSetting({
        deviceName: this.deviceName,
        userName: this.organization
      });
      if (result && result.length > 0) this.ProfileSetData = result;
    },

    //addModle提交数据
    zoneSub(data) {
      this.formParam.data.sourceZoneList = data;
    },
    desZoneSub(data) {
      this.formParam.data.destinationZoneList = data;
    },
    addressSub(data) {
      this.formParam.data.sourceAddressList = data.Address;
      this.formParam.data.sourceAddressGroupList = data.AddressGroup;
      this.formParam.data.sourceRegion = data.AddressRegion;
    },
    desAddressSub(data) {
      this.formParam.data.destinationAddressList = data.Address;
      this.formParam.data.destinationAddressGroupList = data.AddressGroup;
      this.formParam.data.destinationRegion = data.AddressRegion;
    },
    serviceSub(data) {
      this.formParam.data.predefinedServicesList = data.userDefinedService;
      this.formParam.data.userDefinedServices = data.predefinedService;
    },

    // 添加tag标签
    addtag(tag) {
      this.formParam.data.tag = tag;
    },
    addDacp(tag) {
      this.formParam.data.dscp = tag;
    },
    // ethernet切换清空已有值
    etherChange() {
      this.formParam.data.etherType = '';
      this.formParam.data.etherTypeValue = '';
    },
    // 获取qos列表
    async lists() {
      this.listParam = {
        deviceName: this.deviceName,
        orgName: this.organization,
        offset: this.offset,
        pageSize: this.pageSize
      };
      const { result } = await qosPolicyLists(this.listParam);
      console.log('result', result);
      this.tableData = [];
      if (result) {
        result.data.forEach(item => {
          for (let key in item) {
            item[key] = Array.isArray(item[key])
              ? item[key].join(';')
              : item[key];
          }
        });

        // 获取总条数
        this.totalCount = result.total;
        this.tableData = result.data;
      } else {
        this.tableData = [];
      }
    },

    //新建qos
    async createItem() {
      this.modalTitle = 'Add Qos Rule';
      this.modalType = 'add';
      this.sourceDesZone();
      this.sourceDesAddress();
      this.ProfileSet();
      this.services();
      this.schedules();

      this.visible = true;
    },

    //编辑qos
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Qos Rule';
      this.modalType = 'edt';
      this.searchParam = {
        deviceName: this.deviceName,
        orgName: this.organization,
        name: rowData.name
      };
      const { result } = await qosPolicySearch(this.searchParam);
      this.formParam.data = Object.assign(
        this.formParam.data,
        removeNull(result)
      );
      this.sourceDesZone();
      this.sourceDesAddress();
      this.ProfileSet();
      this.services();
      this.schedules();
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
      this.delParam.data = rowData.name;
    },

    // 删除选中qos
    async deleteItem() {
      this.delParam.deviceName = this.deviceName;
      this.delParam.orgName = this.organization;
      const res = await qosPolicyDelete(this.delParam);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('qos删除成功！');
      this.lists();
    },

    //表单提交
    handleOk() {
      this.formParam.deviceName = this.deviceName;
      this.formParam.orgName = this.organization;
      // 新建qos数据
      if (this.modalType === 'add' && !this.loading) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.$nextTick(() => {
              this.$refs.zone && this.$refs.zone.param();
              this.$refs.desZone && this.$refs.desZone.param();
              this.$refs.address && this.$refs.address.param();
              this.$refs.desAddress && this.$refs.desAddress.param();
              this.$refs.service && this.$refs.service.param();
            });
            this.loading = true;
            const addRes = await qosPolicyCreate(this.formParam);
            this.loading = false;
            if (addRes.status !== '0000')
              return this.$message.error(addRes.message);
            this.$message.success('qos创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      // 修改qos数据
      if (this.modalType === 'edt' && !this.loading) {
        this.$refs.form.validateField(['name'], async () => {
          this.$nextTick(() => {
            this.$refs.zone && this.$refs.zone.param();
            this.$refs.desZone && this.$refs.desZone.param();
            this.$refs.address && this.$refs.address.param();
            this.$refs.desAddress && this.$refs.desAddress.param();
            this.$refs.service && this.$refs.service.param();
          });

          if (!this.message.name) {
            this.loading = true;
            const edtRes = await qosPolicyModify(this.formParam);
            this.loading = false;
            if (edtRes.status !== '0000')
              return this.$message.error(edtRes.message);
            this.$message.success('qos更新成功！');
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
        data: {
          description: '',
          destinationAddressGroupList: [],
          destinationAddressList: [],
          destinationMacAddressType: '',
          destinationNegate: '',
          destinationRegion: [],
          destinationZoneList: [],
          dscp: [],
          etherType: '',
          etherTypeValue: '',
          type: '',
          value: '',
          ieee802Value: [],
          ipFlags: '',
          ipVersion: '',
          name: '',
          predefinedServicesList: [],
          userDefinedServices: [],
          schedule: '',
          setAction: '',
          setPermitExistingFlow: '',
          setQosProfile: '',
          setSessionTimeout: '',
          sourceAddressGroupList: [],
          sourceAddressList: [],
          sourceNegate: '',
          sourceRegion: [],
          sourceZoneList: [],
          tag: []
        },
        deviceName: '',
        groupName: '',
        orgName: ''
      };
      this.actKey = '1';
      this.message = {};
      this.loading = false;
    }
  },
  components: { TagInput, ListCrt, Pagination },
  directives: {
    // 拖拽自定义指令
    drag(el) {
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
.form-wrap {
  .add-modle-con {
    .add-modle-item {
      width: 305px;
      height: 185px;
      overflow: hidden;
      position: relative;
      margin-bottom: 15px;
      background: #fff;
    }
  }
  .ipInfo {
    border: 1px solid #456880;
    padding: 18px 10px 3px;
    border-radius: 4px;
    margin-bottom: 5px;
    position: relative;
    margin-top: 18px;
    &::before {
      position: absolute;
      content: 'IP';
      background: #507691;
      border-radius: 4px;
      padding: 2px 5px;
      position: absolute;
      left: 10px;
      top: -10px;
      font-size: 12px;
      color: #fff;
    }
  }
  .otherInfo {
    &::before {
      content: 'Others';
    }
    @extend .ipInfo;
  }
  .ethernet {
    width: 360px;
    &::before {
      content: 'Ethernet';
    }
    @extend .ipInfo;
  }
  .actionSet {
    &::before {
      content: 'Action Setting';
    }
    @extend .ipInfo;
  }
  .permit {
    &::before {
      content: 'Permit Existing Flow';
    }
    @extend .ipInfo;
  }
  .qosSet {
    &::before {
      content: 'Qos Profile Setting';
    }
    @extend .ipInfo;
  }
  .ttlInfo {
    &::before {
      content: 'TTL';
    }
    @extend .ipInfo;
  }
}
</style>

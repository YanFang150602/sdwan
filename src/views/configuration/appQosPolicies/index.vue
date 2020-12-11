<template>
  <div class="main-con">
    <!-- 头部信息 -->
    <Pagination
      :total="totalCount"
      :page-size="pageSize"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
      @create-item="createItem"
      @delete-item="deleteItem"
      @search="search"
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
      v-model="visible"
      :title="modalTitle"
      :width="645"
      wrapClassName="form-wrap"
      cancelText="Cancel"
      okText="Ok"
      :afterClose="cleanData"
      :maskClosable="false"
    >
      <a-form-model
        ref="form"
        :rules="rules"
        :model="formParam.dto"
        layout="vertical"
        @validate="validate"
        hideRequiredMark
        :maskClosable="false"
      >
        <a-tabs @tabClick="tabClick" type="card" :activeKey="actKey">
          <!-- General -->
          <a-tab-pane key="1" tab="General">
            <a-row type="flex" justify="space-between" align="top">
              <!-- Name -->
              <a-col :span="24">
                <a-form-model-item class="mandatory" label="Name" prop="name">
                  <a-input
                    :disabled="modalType === 'edt'"
                    @mouseenter="enter('name')"
                    @mouseleave="leave"
                    @mousemove="updateXY"
                    v-model="formParam.dto.name"
                  />
                </a-form-model-item>
              </a-col>
              <!-- Description -->
              <a-col :span="24">
                <a-form-model-item label="Description">
                  <a-input v-model="formParam.dto.description" />
                </a-form-model-item>
              </a-col>
              <!-- Tags -->
              <a-col :span="24">
                <a-form-model-item label="Tags">
                  <TagInput @addtag="addtag" :tags="formParam.dto.tag" />
                </a-form-model-item>
              </a-col>
              <!-- Session Timeout(secs) -->
              <a-col :span="24">
                <a-row type="flex" justify="start" align="bottom">
                  <a-col>
                    <a-form-model-item label="Session Timeout(secs)">
                      <a-input v-model="formParam.dto.sessionTimeout" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :style="{ padding: '8px' }">
                    <input
                      v-model="formParam.dto.tcpSessionKeepalive"
                      type="checkbox"
                    />
                  </a-col>
                  <a-col
                    :style="{
                      color: '#fff',
                      fontSize: '12px',
                      paddingBottom: '10px'
                    }"
                    >TCP Keepalive</a-col
                  >
                </a-row>
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
                <div class="listCon">
                  <ListCrt
                    ref="sourZone"
                    :list-data="zoneListData"
                    :item-data="formParam.dto.sourceZoneList"
                    :title="sourceZone"
                    @subdata="sourZoneSub"
                  />
                </div>
              </a-col>
              <a-col class="add-modle-item">
                <div class="listCon">
                  <ListCrt
                    ref="desZone"
                    :list-data="zoneListData"
                    :item-data="formParam.dto.destinationZoneList"
                    :title="destinationZone"
                    @subdata="desZoneSub"
                  />
                </div>
              </a-col>
              <a-col class="add-modle-item" :style="{ marginBottom: 0 }">
                <div class="listCon">
                  <ListCrt
                    ref="sourAddress"
                    crt-type="sltGp"
                    :list-gp-data="addressListData"
                    :item-data="addressItemData"
                    :title="sourceAddress"
                    @subdata="sourAddressSub"
                  />
                </div>
              </a-col>
              <a-col class="add-modle-item" :style="{ marginBottom: 0 }">
                <div class="listCon">
                  <ListCrt
                    ref="desAddress"
                    crt-type="sltGp"
                    :list-gp-data="addressListData"
                    :item-data="desAddressItemData"
                    :title="destinationAddress"
                    @subdata="desAddressSub"
                  />
                </div>
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
                  <a-col :style="{ width: '120px' }">
                    <a-form-model-item label="Ip Version">
                      <a-select v-model="formParam.dto.ipVersion">
                        <a-select-option value="">--Select--</a-select-option>
                        <a-select-option value="ipv4">ipv4</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :style="{ width: '120px', marginRight: '30px' }">
                    <a-form-model-item label="IP Flags">
                      <a-select v-model="formParam.dto.ipFlags">
                        <a-select-option value="">--Select--</a-select-option>
                        <a-select-option value="DF">DF</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="22">
                    <a-row type="flex" justify="space-between" align="middle">
                      <a-col :span="24">
                        <a-form-model-item label="DSCP">
                          <TagInput
                            @addtag="addDacp"
                            :tags="formParam.dto.dscp ? formParam.dto.dscp : []"
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
                          <a-select v-model="formParam.dto.type">
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
                          <a-input v-model="formParam.dto.value" />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="otherInfo" :span="24">
                    <a-form-model-item style="width: 150px;" label="Schedules">
                      <a-select placeholder="select">
                        <a-select-option value="yffZone001"
                          >yffZone001</a-select-option
                        >
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :style="{ width: '305px', height: '230px' }">
                <a-form-model-item label="Services">
                  <div :style="{ height: '185px', background: '#fff' }">
                    <ListCrt
                      ref="service"
                      crt-type="sltGp"
                      :list-gp-data="servicesListData"
                      :item-data="[
                        ...formParam.dto.predefinedServicesList,
                        ...formParam.dto.servicesList
                      ]"
                      :title="servicesList"
                      @subdata="serviceSub"
                    />
                  </div>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Applications/URL -->
          <a-tab-pane :forceRender="true" key="4" tab="Applications/URL">
            <a-row
              class="add-modle-con"
              type="flex"
              justify="space-between"
              align="top"
            >
              <a-col class="add-modle-item" :style="{ marginBottom: 0 }">
                <h6>Applications</h6>
                <div class="listCon">
                  <ListCrt
                    ref="application"
                    crt-type="sltGp"
                    :list-gp-data="applicationtData"
                    :item-data="[
                      ...formParam.dto.userDefinedApplicationList,
                      ...formParam.dto.groupList,
                      ...formParam.dto.filterList,
                      ...formParam.dto.predefinedApplicationList,
                      ...formParam.dto.predefinedGroupList,
                      ...formParam.dto.predefinedFilterList
                    ]"
                    :title="applicationList"
                    @subdata="applicationSub"
                  />
                </div>
              </a-col>
              <a-col class="add-modle-item" :style="{ marginBottom: 0 }">
                <h6>URL Categories</h6>
                <div class="listCon">
                  <ListCrt
                    ref="urlCategory"
                    crt-type="sltGp"
                    :list-gp-data="urlCategoryData"
                    :item-data="[
                      ...formParam.dto.userDefined,
                      ...formParam.dto.predefined
                    ]"
                    :title="urlCategoryList"
                    @subdata="urlCategorySub"
                  />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- Enforce -->
          <a-tab-pane key="5" tab="Enforce">
            <a-row type="flex" justify="space-between" align="top">
              <a-col :style="{ width: '305px' }">
                <div class="actionSet">
                  <a-radio-group
                    name="radioGroup"
                    v-model="formParam.dto.action"
                  >
                    <a-radio value="allow">Allow</a-radio>
                  </a-radio-group>
                </div>
              </a-col>
              <a-col :style="{ width: '305px' }">
                <div class="qosSet">
                  <a-form-model-item
                    label="Qos Profile"
                    class="mandatory"
                    prop="qosProfile"
                  >
                    <a-select
                      placeholder="select"
                      v-model="formParam.dto.qosProfile"
                    >
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
import { name, select } from '@/validate/common';
import common from '@/mixins/common';
import { removeNull } from '@/utils/assits';

import Pagination from 'components/Pagination';
import TagInput from 'components/TagInput';
import ListCrt from 'components/ListCrt';
import {
  appQosPolicyLists,
  appQosPolicyCreate,
  appQosPolicyModify,
  appQosPolicyDelete,
  zoneList,
  addressList,
  ProfileSetting,
  serviceList,
  applicationList,
  urlCategoryList
} from 'apis/zoneQos';
export default {
  mixins: [common],
  data() {
    return {
      columns,
      titleRows,
      actKey: '1', //tab切换控制
      // addModle 标题
      sourceZone: 'Source Zone',
      destinationZone: 'Destination Zone',
      sourceAddress: 'Source Address',
      destinationAddress: 'Destination Address',
      servicesList: 'Service List',
      applicationList: 'Applications',
      urlCategoryList: 'URL Category List',
      addressItemData: [], //address 传给组件值
      desAddressItemData: [], //desAddress 传给组件值
      // 新增修改数据模型
      formParam: {
        deviceName: '',
        dto: {
          action: '',
          description: '',
          destinationAddressGroupList: [],
          destinationAddressList: [],
          destinationNegate: '',
          destinationRegion: [],
          destinationZoneList: [],
          dscp: [],
          type: '',
          value: '',
          ipFlags: '',
          ipVersion: '',
          name: '',
          predefined: [],
          userDefined: [],

          predefinedApplicationList: [],
          userDefinedApplicationList: [],
          predefinedGroupList: [],
          predefinedFilterList: [],
          groupList: [],
          filterList: [],

          predefinedServicesList: [],
          servicesList: [],
          qosProfile: '',
          schedule: '',
          sessionTimeout: '',
          sourceAddressGroupList: [],
          sourceAddressList: [],
          sourceNegate: '',
          sourceRegion: [],
          sourceZoneList: [],
          tag: [],
          tcpSessionKeepalive: ''
        },
        id: '',
        userName: ''
      },
      // 列表查询参数
      listParam: {
        deviceName: '',
        orgName: '',
        offset: 0,
        pageSize: 20
      },
      //查询数据模型
      searchData: {
        deviceName: '',
        orgName: '',
        name: ''
      },
      //删除数据模型
      delData: {
        deviceName: '',
        userName: '',
        id: ''
      },
      // 表单校验规则
      rules: {
        name: [{ validator: name }],
        qosProfile: [{ validator: select }]
      },
      // zone列表数据
      zoneListData: [],
      // address列表数据
      addressListData: [],
      // ProfileSetting列表数据
      ProfileSetData: [],
      // servicesListData
      servicesListData: [],
      // servicesListData
      applicationtData: [],
      // servicesListData
      urlCategoryData: []
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
      console.log('sourceDesAddress', result);
      if (result && result.length > 0) this.addressListData = result;

      if (this.modalType === 'edt') {
        this.addressItemData = [
          ...this.formParam.dto.sourceRegion,
          ...this.formParam.dto.sourceAddressList,
          ...this.formParam.dto.sourceAddressGroupList
        ];
        this.desAddressItemData = [
          ...this.formParam.dto.destinationRegion,
          ...this.formParam.dto.destinationAddressList,
          ...this.formParam.dto.destinationAddressGroupList
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
    // 获取ProfileSetting列表
    async ProfileSet() {
      const { result } = await ProfileSetting({
        deviceName: this.deviceName,
        userName: this.organization
      });

      if (result && result.length > 0) this.ProfileSetData = result;
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

    // 获取application列表
    async application() {
      const { result } = await applicationList({
        deviceName: this.deviceName,
        orgName: this.organization
      });
      console.log('application', result);
      if (result && result.length > 0) this.applicationtData = result;
    },
    // 获取urlCategory列表
    async urlCategory() {
      const { result } = await urlCategoryList({
        objectName: this.deviceName,
        orgName: this.organization,
        objectType: 'device'
      });
      console.log('urlCategory', result);
      if (result && result.length > 0) this.urlCategoryData = result;
    },

    //addModle提交数据
    sourZoneSub(data) {
      this.formParam.dto.sourceZoneList = data;
    },
    desZoneSub(data) {
      this.formParam.dto.destinationZoneList = data;
    },
    sourAddressSub(data) {
      this.formParam.dto.sourceAddressList = data;
    },
    desAddressSub(data) {
      this.formParam.destinationAddressList = data;
    },
    serviceSub(data) {
      data.preService &&
        (this.formParam.dto.predefinedServicesList = data.preService);
      data.userService && (this.formParam.dto.servicesList = data.userService);
    },
    applicationSub(data) {
      data.preApplication &&
        (this.formParam.dto.predefinedApplicationList = data.preApplication);
      data.userApplication &&
        (this.formParam.dto.userDefinedApplicationList = data.userApplication);
      data.preApplicationGroup &&
        (this.formParam.dto.predefinedGroupList = data.preApplicationGroup);
      data.preApplicationFilter &&
        (this.formParam.dto.predefinedFilterList = data.preApplicationFilter);
      data.userApplicationGroup &&
        (this.formParam.dto.groupList = data.userApplicationGroup);
      data.userApplicationFilter &&
        (this.formParam.dto.filterList = data.userApplicationFilter);
    },
    urlCategorySub(data) {
      data.preUrlCategory &&
        (this.formParam.dto.predefined = data.preUrlCategory);
      data.userUrlCategory &&
        (this.formParam.dto.userDefined = data.userUrlCategory);
    },

    // 添加tag标签
    addtag(tag) {
      this.formParam.dto.tag = tag;
    },
    addDacp(tag) {
      this.formParam.dto.dscp = tag;
    },
    // 获取qos列表
    async lists() {
      this.listParam = {
        deviceName: this.deviceName,
        userName: this.organization,
        offset: this.offset,
        limit: this.pageSize
      };
      const { result } = await appQosPolicyLists(this.listParam);

      if (result) {
        this.tableData = result.data.forEach(item => {
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
      this.application();
      this.urlCategory();
      this.visible = true;
    },

    //编辑qos
    async modifyItem({ rowData }) {
      this.modalTitle = 'Edit Qos Rule';
      this.modalType = 'edt';
      const { result } = await appQosPolicyLists(this.listParam);

      result.data.forEach(item => {
        if (item.name === rowData.name) {
          console.log('rowData', item);
          this.formParam.dto = Object.assign(
            this.formParam.dto,
            removeNull(item)
          );
        }
      });

      this.sourceDesZone();
      this.sourceDesAddress();
      this.ProfileSet();
      this.services();
      this.application();
      this.urlCategory();
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
      this.delData.id = rowData.name;
    },
    // 删除选中qos
    async deleteItem() {
      this.delData.deviceName = this.deviceName;
      this.delData.userName = this.organization;
      const res = await appQosPolicyDelete(this.delData);
      if (res.status !== '0000') return this.$message.error(res.message);
      this.$message.success('qos删除成功！');
      this.lists();
    },

    //表单提交
    async handleOk() {
      this.formParam.deviceName = this.deviceName;
      this.formParam.userName = this.organization;

      // 新建appQos数据
      if (this.modalType === 'add' && !this.loading) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.$nextTick(() => {
              this.$refs.sourZone.param();
              this.$refs.desZone.param();
              this.$refs.sourAddress.param();
              this.$refs.desAddress.param();
              this.$refs.service.param();
              this.$refs.application.param();
              this.$refs.urlCategory.param();
            });

            this.loading = true;
            const result = await appQosPolicyCreate(this.formParam);
            this.loading = false;
            if (result.status !== '0000')
              return this.$message.error(result.message);
            this.$message.success('qos创建成功！');
            this.visible = false;
            this.lists();
          }
        });
      }
      // 修改appQos数据
      if (this.modalType === 'edt' && !this.loading) {
        this.$refs.form.validateField(['name'], async () => {
          if (!this.message.name) {
            this.$nextTick(() => {
              this.$refs.sourZone.param();
              this.$refs.desZone.param();
              this.$refs.sourAddress.param();
              this.$refs.desAddress.param();
              this.$refs.service.param();
              this.$refs.application.param();
              this.$refs.urlCategory.param();
            });

            this.formParam.id = this.formParam.dto.name;
            this.loading = true;
            const res = await appQosPolicyModify(this.formParam);
            this.loading = false;
            if (res.status !== '0000') return this.$message.error(res.message);
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
        deviceName: '',
        dto: {
          action: '',
          description: '',
          destinationAddressGroupList: [],
          destinationAddressList: [],
          destinationNegate: '',
          destinationRegion: [],
          destinationZoneList: [],
          dscp: [],
          type: '',
          value: '',
          ipFlags: '',
          ipVersion: '',
          name: '',
          predefined: [],
          userDefined: [],

          predefinedApplicationList: [],
          userDefinedApplicationList: [],
          predefinedGroupList: [],
          predefinedFilterList: [],
          groupList: [],
          filterList: [],

          predefinedServicesList: [],
          servicesList: [],
          qosProfile: '',
          schedule: '',
          sessionTimeout: '',
          sourceAddressGroupList: [],
          sourceAddressList: [],
          sourceNegate: '',
          sourceRegion: [],
          sourceZoneList: [],
          tag: [],
          tcpSessionKeepalive: ''
        },
        id: '',
        userName: ''
      };
      this.actKey = '1';
      this.message = {};
      this.loading = false;
      this.addressItemData = [];
      this.desAddressItemData = [];
    }
  },
  components: { TagInput, Pagination, ListCrt }
};
</script>
<style lang="scss" scoped>
.form-wrap {
  .add-modle-con {
    h6 {
      font-size: 12px;
      color: #fff;
    }
    .add-modle-item {
      width: 305px;
      position: relative;
      margin-bottom: 15px;
      .listCon {
        height: 185px;
        background: #fff;
      }
    }
  }
  .ipInfo {
    border: 1px solid #456880;
    padding: 20px 10px 3px;
    border-radius: 4px;
    margin-bottom: 10px;
    position: relative;
    margin-top: 5px;
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
    width: 284px;
    &::before {
      content: 'TTL';
    }
    @extend .ipInfo;
  }
}
</style>

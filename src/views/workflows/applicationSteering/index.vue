<template>
  <div class="temp main-con">
    <div v-if="isShow" :style="{ height: 'calc(100% - 15px)' }">
      <Pagination
        :total="totalCount"
        :page-size="pageSize"
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
        @create-item="showModal"
        @delete-item="groupDel"
        @search="search"
        @cancelSearch="cancelSearch"
      />
      <!-- 列表 -->
      <!-- 表单主体内容 -->
      <v-table
        :style="{ height: '100%' }"
        is-horizontal-resize
        is-vertical-resize
        column-width-drag
        :columns="columns"
        :table-data="tableData"
        :select-all="selectALL"
        :select-change="selectChange"
        :select-group-change="selectGroupChange"
        style="width: 100%;"
        isFrozen="true"
        @on-custom-comp="customCompFunc"
        error-content="Temporarily no data"
      ></v-table>
    </div>
    <a-form-model
      v-else
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="ruleForm"
      :rules="rulesValidation"
      :model="form"
    >
      <div class="tamplate">
        <div class="title">
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="6">
              <a-form-model-item label="Template Name" prop="templateName">
                <a-input v-model="form.templateName" :disabled="isDisabled"/>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="Organization" prop="organization">
                <a-select @change="handleChange" v-model="form.organization" :disabled="isDisabled">
                  <a-select-option
                    :value="item.name"
                    v-for="(item, index) in organ"
                    :key="index"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6"></a-col>
            <a-button type="primary" @click="showModel">Add Traffic Category</a-button>
            <!-- <a-col :span="6"></a-col> -->
          </a-row>
        </div>
        <div class="middlesection">
          <div class="mainPart" v-for="(item, index) in originData" :key="index">
            <div class="firstBox">
              <a-row type="flex" justify="space-between" align="top">
                <a-col :span="12">
                  <span>{{ item.categoryName }}</span>
                  <p>{{ item.forwardingClass }}</p>
                </a-col>
                <a-col :span="4">
                  <a-icon type="minus" @click="showDeleteTop(index)"/>
                  <a-icon type="plus" @click="showAdd(item)"/>
                  <a-icon type="edit" @click="showEdit(index, item)"/>
                </a-col>
              </a-row>
            </div>
            <div class="firstBottom">
              <div class="firstVoice" v-for="(rule, index) in item.rules" :key="rule.name">
                <a-row type="flex" justify="space-between" align="top">
                  <a-col :span="16">
                    <p>{{ rule.name }}</p>
                  </a-col>
                  <a-col :span="4">
                    <p>
                      <a-icon type="minus" @click="item.rules.splice(index, 1)"/>
                      <a-icon type="edit" @click="showRule(rule, item)"/>
                    </p>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-btn">
          <div class="btn">
            <a-button type="dashed" @click="isShow = true">cancel</a-button>
            <a-button type="danger" style="margin-left: 10px;" @click="handleClick">Save</a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="handleDeploy">Deploy</a-button>
          </div>
        </div>
      </div>
    </a-form-model>
    <!--Create Traffic Category  -->
    <TrafficCategory
      ref="TrafficCategoryRef"
      @table="information => originData.push({ ...information })"
      :wanNetworkGroups="wanNetworkGroups"
    ></TrafficCategory>
    <!--Edit Traffic Category  -->
    <EditTrafficCategory
      ref="EditTrafficCategoryRef"
      :EditTraffic="squareListInformation"
      :wanNetworkGroups="wanNetworkGroups"
    ></EditTrafficCategory>
    <!-- Edit Rule to category Real Time -->
    <EditRuleToCategory
      ref="EditRuleToCategoryRef"
      :EditRuleTo="group"
      :selects="selects"
      :wanNetworkGroups="wanNetworkGroups"
      :EditRuleToline="informationLine"
      @customerSelect="customerSelect"
      :editNameTitle="nameTitle"
    ></EditRuleToCategory>
    <!-- Create Rule to category Real Time -->
    <CreateRuleToCategoryRealTime
      :EditRuleTo="group"
      :selects="selects"
      :EditRuleToline="informationLine"
      ref="CreateRuleToCategoryRealTimeRef"
      @addLine="addLine"
      :wanNetworkGroups="wanNetworkGroups"
    ></CreateRuleToCategoryRealTime>
    <!-- 删除弹框 -->
    <Applicationdelete ref="ApplicationdeleteRef" :Application="dele"></Applicationdelete>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Pagination from 'components/Pagination';
import TrafficCategory from './TrafficCategory';
import EditRuleToCategory from './EditRuleToCategory';
import Applicationdelete from './Applicationdelete';
import EditTrafficCategory from './EditTrafficCategory';
import CreateRuleToCategoryRealTime from './CreateRuleToCategoryRealTime';
import {
  steeringForm,
  steeringOrg,
  SourceZonesSelect,
  WANCircuitSelect,
  ApplicationSelect,
  FiltersSelect,
  GroupsSelect,
  CategoriesSelect,
  ServiceSelect,
  LeftSelectAll,
  SourceAddressSelect,
  BoxInformationList,
  steeringCreate,
  steeringListCheck,
  steeringDeploy
} from 'apis/applicationSteering';

export default {
  name: 'QosProfiles',
  components: {
    Pagination,
    TrafficCategory,
    EditRuleToCategory,
    Applicationdelete,
    EditTrafficCategory,
    CreateRuleToCategoryRealTime
  },
  data() {
    return {
      nameTitle: [],
      isDisabled: false,
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      // 搜索框
      keyworks: '',
      // 新增弹框
      visible: false,
      // 表格
      tableData: [],
      columns: [
        {
          width: 36,
          columnAlign: 'center',
          titleAlign: 'center',
          type: 'selection'
        },
        {
          field: 'name',
          title: 'Name',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true,
          componentName: 'table-operationDevice'
        },
        {
          field: 'organization',
          title: 'Organization',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'status',
          title: 'Status',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'createDate',
          title: 'Created Date',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'modifyDate',
          title: 'Modified Date',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        },
        {
          field: 'lastUpdatedBy',
          title: 'Last Update By',
          width: 150,
          titleAlign: 'left',
          columnAlign: 'left',
          isResize: true
        }
      ],
      //分页
      pageIndex: 1,
      pageSize: 20,
      totalCount: 100,
      isShow: true,
      //删除的数据
      dele: {
        names: []
      },
      // 组织
      orgName: '',
      paramName: 'allNames',
      group: {
        sourceSelect: [],
        wanSelect: [],
        appSelect: [],
        filterSelect: [],
        groupSelect: [],
        categoriesSelect: [],
        serSelect: [],
        leftSelectAll: [],
        sourceAddressSelect: [],
        zones: []
      },
      boxList: [
        {
          name: '',
          titleSec: '',
          inner: []
        },
        {
          name: '',
          titleSec: '',
          inner: []
        },
        { name: '', titleSec: '', inner: [] },
        { name: '', titleSec: '', inner: [] }
      ],
      // 方形模块查询的信息
      squareList: [],
      // 方形模块数据传递
      squareListInformation: {},
      name: '',
      form: {
        templateName: '',
        organization: '',
        trafficCategories: []
      },
      boxMation: [],
      rules: {},
      newRules: new Map(),
      // 传递当行的数据
      informationLine: {},
      originData: [],
      selects: {},
      titleBoxInform: {},
      objectName: '',
      wanNetworkGroups: [],
      // 校验规则
      rulesValidation: {
        templateName: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          }
        ],
        organization: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
          }
        ]
      }
    };
  },
  created() {
    this.tableForm();
    this.getOrg();
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },

  methods: {
    // 点击+跳转
    async showModal() {
      // console.log(this.rules);
      this.isAdd = true;
      this.isShow = false;
      // 获取四个方形模块的数据
      const res = await BoxInformationList();
      // console.log(res.result[0].trafficCategories);
      this.form.trafficCategories = res.result[0].trafficCategories;
      // console.log(res.result[0], 8439843298);
      this.originData = res.result[0].trafficCategories;
      // console.log(this.originData);
      res.result[0].trafficCategories.forEach((item, index) => {
        // console.log(item);
        // item.rules.push(this.titleBoxInform);
        // console.log(item.rules);
        this.boxMation = item;
        this.boxList[index].name = item.categoryName;
        this.boxList[index].titleSec = item.forwardingClass;
        item.rules.forEach(it => {
          // console.log(it);
          this.newRules.set(it.name, it);
          this.rules = it;
          // console.log(this.rules);
          this.boxList[index].inner.push(it.name);
        });
        console.log(this.newRules);
      });
      this.squareList = res.result[0].trafficCategories;
      console.log('this.squareList', this.squareList);
    },
    // 删除弹框
    groupDel() {
      this.$refs.ApplicationdeleteRef.showModalDelete();
    },
    // 表格方法
    selectALL(selection) {
      console.log('select-aLL', selection);
    },
    selectChange(selection, rowData) {
      console.log('select-change', selection, rowData);
      console.log(rowData.name);
      this.dele.names.push(rowData.name);
    },
    selectGroupChange(selection) {
      console.log('select-group-change', selection);
    },
    async customCompFunc(params, index) {
      console.log(params.rowData.name);
      this.isShow = false;
      this.isDisabled = true;
      // this.isAdd = false;
      const res = await steeringListCheck({ id: params.rowData.name });
      console.log(res.result.trafficCategories);
      this.originData = res.result.trafficCategories;
      this.form.templateName = res.result.templateName;
      this.form.organization = res.result.organization;
      this.squareList = res.result.trafficCategories;
      if (index < 4) this.squareListInformation = this.squareList[index];
      this.handleChange();
      // this.getOrg();
      const resw = await steeringOrg();
      if (resw.result.organizations && resw.result.organizations.length > 0) {
        this.organ = resw.result.organizations;
      }
    },
    // 分页
    async pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      const res = await steeringForm({
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      console.log(res);
      this.tableData = res.result.content;
    },
    async pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      const res = await steeringForm({
        offset: (this.pageIndex - 1) * this.pageSize,
        limit: this.pageSize
      });
      console.log(res);
      this.tableData = res.result.content;
    },
    // 搜索框查询
    search(data) {
      // 转换全小写,实现模糊匹配
      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item.name.toLowerCase().includes(keyword)
      );
      this.tableData = list;
    },
    // 取消搜索，显示当前数据
    cancelSearch() {
      if (this.keyworks.trim() === '') {
        this.tableForm();
      }
    },
    showModel() {
      if (this.form.templateName == '' || this.form.organization == '') {
        alert('Please select and Org first');
      } else {
        this.$refs.TrafficCategoryRef.showModalAdd();
      }
    },
    // 弹出编辑框
    showRule(rule, item) {
      this.$refs.EditRuleToCategoryRef.showModalAdd();
      this.$refs.EditRuleToCategoryRef.getData(rule, item);
    },
    // 获取列表数据
    async tableForm() {
      const res = await steeringForm({ offset: 0, limit: 20 });
      this.tableData = res.result.content;
      this.totalCount = res.result.totalElements;
    },
    // 获取组织列表数据
    async getOrg() {
      const res = await steeringOrg();
      console.log(res.result.organizations);
      this.organ = res.result.organizations;
    },
    // 获取被选中的组织的值
    async handleChange() {
      console.log(this.organization);
      this.objectName = this.form.organization + '-DataStore';
      Promise.all([
        LeftSelectAll(),
        ApplicationSelect({
          orgName: this.form.organization,
          objectName: this.deviceName,
          objectType: this.objectType
        }),
        FiltersSelect({
          orgName: this.form.organization,
          objectName: this.deviceName,
          objectType: this.objectType
        }),
        GroupsSelect({
          orgName: this.form.organization,
          objectName: this.objectName,
          objectType: this.objectType
        }),
        CategoriesSelect({
          orgName: this.form.organization,
          objectType: 'template',
          objectName: this.objectName
        }),
        ServiceSelect({
          orgName: this.form.organization,
          objectType: 'template',
          objectName: this.objectName
        })
        // SourceAddressSelect({
        //   orgName: this.form.organization,
        //   objectType: 'template',
        //   objectName: this.objectName
        // }),
        // SourceZonesSelect({
        //   orgName: this.form.organization,
        //   objectName: this.objectName,
        //   objectType: 'template'
        // })
      ]).then(res => {
        console.log('preDefinedService', res);
        const keyArr = [
          'customApplications',
          'customFilters',
          'customGroups',
          'customCategories',
          'customService'
          // 'SourceZones'
          // 'SourceAddress'
        ];
        const leftKeys = [
          { valKey: 'preDefinedApplications', resKey: 'appNames' },
          { valKey: 'preDefinedCategories', resKey: 'urlCategoryNames' },
          { valKey: 'preDefinedGroups', resKey: 'appGroupNames' },
          { valKey: 'preDefinedFilters', resKey: 'appFilterNames' },
          { valKey: 'preDefinedService', resKey: 'serviceNames' }
        ];
        console.log(res);
        res.forEach((item, index) => {
          if (index) return (this.selects[keyArr[index - 1]] = item.result);
          leftKeys.forEach(
            key => (this.selects[key.valKey] = item.result[key.resKey])
          );
        });
      });

      // const res = await SourceZonesSelect({ orgName: this.form.organization });
      // this.group.sourceSelect = res.result;
      const res = await SourceZonesSelect({
        orgName: this.form.organization,
        objectName: this.objectName,
        objectType: 'template'
      });
      this.group.zones = res.result;
      const resw = await WANCircuitSelect({ id: this.form.organization });
      this.group.wanSelect = resw.result;
      this.wanNetworkGroups = resw.result[0].wanNetworkGroups.map(
        item => item.name
      );
      console.log(this.wanNetworkGroups);
      const ressds = await SourceAddressSelect({
        orgName: this.form.organization,
        objectType: 'template',
        objectName: this.objectName
      });
      this.group.sourceAddressSelect = ressds.result;

      // const resap = (await this.group.appSelect = resap.result);
      // const resf = (await this.group.filterSelect = resf.result);
      // const resg = (await this.group.groupSelect = resg.result);
      // const resc = (await this.group.categoriesSelect = resc.result);
      // const ress = (await this.group.serSelect = ress.result);
      // const resAll = await LeftSelectAll({ paramName: this.paramName });
      // this.group.leftSelectAll = resAll.result;
    },

    // 四个盒子的编辑
    showEdit(index, item) {
      this.$refs.EditTrafficCategoryRef.showModalAdd(index, item);
      if (index < 4) this.squareListInformation = this.squareList[index];
    },
    // 增加
    showAdd(item) {
      if (this.form.templateName == '' || this.form.organization == '') {
        alert('Please select and Org first');
      } else {
        this.$refs.CreateRuleToCategoryRealTimeRef.showModalAdd(item);
      }
      console.log(item);
      // this.nameTitle = this.nameTitle.push(item.categoryName);
      // console.log(this.nameTitle);
    },
    // 四个盒子的删除
    showDeleteTop(index) {
      console.log(index);
      this.originData.splice(index, 1);
      console.log(this.originData);
    },
    handleClick() {
      this.form.trafficCategories = this.originData;
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          const res = await steeringCreate(this.form, this.isAdd);
          console.log(res, 843777847374932);
          if (res.message === 'Success') {
            this.$message.success(`${this.isAdd ? '创建' : '保存'}成功`);
            this.tableForm();
            // this.form = {};
            // this.isShow = true;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 点击部署按钮
    async handleDeploy() {
      // const res = await steeringDeploy({ name: this.form.templateName });
      // console.log(res);
      // if (res.message === 'Success') {
      //   this.$message.success('部署成功');
      //   this.isShow = true;
      // }
      this.$refs.ruleForm.validate(async (valid, res) => {
        console.log(res);
        if (valid) {
          const res = await steeringDeploy({ name: this.form.templateName });
          console.log(res, 843777847374932);
          if (res.message === 'Success') {
            this.$message.success('部署成功');
            this.isShow = true;
            this.form = {};
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 接收子组件的数据
    customerSelect(type, val) {
      this.informationLine[type] = [...val];
      console.log(this.informationLine[type]);
      console.log(this.informationLine, 84357985);
      // this.newRules.get(aa);
      // this.newRules.get(aa) = this.informationLine;
      // console.log(this.informationLine);
    },

    // 接收单个盒子头部传递过来的数据
    addLine(information) {
      this.titleBoxInform = { ...information };
      console.log(this.titleBoxInform);
      this.originData.forEach(item => {
        console.log(item);
        item.rules.push(this.titleBoxInform);
        console.log(item.rules);
      });
    }
  },
  watch: {
    originData: {
      deep: true,
      handler(newVal) {
        console.log(newVal, 843757);
      }
    }
  }
};
import Vue from 'vue';
// import { Template } from 'webpack';
// import { template } from 'babel__core';
// import { firebrick } from 'color-name';
Vue.component('table-operationDevice', {
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  template: `<span>
        <a href="" @click.stop.prevent="update(rowData,index)">{{rowData.name}}</a>&nbsp;
        </span>`,
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
</script>

<style lang="scss" scoped>
.temp {
  // width: 1293px;
  // overflow-y: scroll;
  padding: 5px 20px 30px 15px;
  /deep/.search-bar {
    .ant-input {
      width: 700px;
      color: #6a6f75;
      border: 1px solid #b0c7d5;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 18px;
      &:focus {
        box-shadow: none;
        border-color: #b0c7d5;
      }
    }
  }
  .tamplate {
    width: 100%;
    // height: 40px;
    border: 1px solid rgb(170, 192, 213);
    overflow-y: scroll;
    .title {
      width: 100%;
      height: 40px;
      background: #b0c7d5;
      overflow: hidden;
      .ant-btn-primary {
        background: #99be4d;
        border: none;
        box-shadow: unset;
        text-shadow: unset;
        margin-bottom: 22px;
        // line-height: 40px;
      }
      /deep/.ant-select-selection__rendered {
        line-height: 18px;
      }
      .ant-input {
        width: 142px;
        height: 20px;
      }
      /deep/.ant-select-selection--single {
        // width: 150px;
        height: 20px;
        line-height: 20px;
      }
    }
    .middlesection {
      height: 450px;
      overflow-y: scroll;
      overflow-x: scroll;

      .mainPart {
        width: 23%;
        float: left;
        margin-left: 15px;
        margin-top: 20px;
        .firstBox {
          height: 67px;
          border: 1px solid black;
          overflow-y: scroll;
          overflow-x: scroll;
          border-bottom: none;
          background-color: rgb(213, 170, 170);
        }
        .firstBottom {
          height: 110px;
          overflow-y: scroll;
          overflow-x: scroll;
          border: 1px solid black;
          border-top: none;
          .firstVoice {
            border: 1px solid rgb(213, 170, 170);
          }
          .firstVideo {
            border: 1px solid rgb(213, 170, 170);
          }
        }
      }
    }
    .footer-btn {
      height: 80px;
      overflow-x: scroll;
      .btn {
        float: right;
        .ant-btn-dashed {
          background-color: #3f4a5b;
          border-color: unset;
          border-style: unset;
          color: #fff;
        }
        .ant-btn-danger {
          width: 60px;
          height: 32px;
          background-color: #a7d054;
          color: #fff;
          border-color: unset;
        }
        .ant-btn-primary {
          width: 69px;
          height: 30px;
          background-color: #0095da;
          color: #fff;
        }
      }
    }
  }
}
</style>

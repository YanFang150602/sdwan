import { adminNameLists } from 'apis/administration';
import { CfTableForm } from 'apis/Configuration';
import { DeviceGroups } from 'apis/workFlows';

import { DeviceCheck } from 'apis/workFlows';
import {
  ADM_NAME_LIST,
  TABLE_DEVICE_FORM,
  // DEVICE_FORM,
  DEVICEGROUP_FORM
} from '@/store/mutation-types';
export default {
  //home页面下拉组织名称列表
  async getNameList({ commit }) {
    const { result } = await adminNameLists();
    const adminNameList = [];
    result.organizations.forEach(item => {
      adminNameList.push(item.name);
    });
    commit(ADM_NAME_LIST, { adminNameList });
  },

  //home页根据设备获取组织名称列表
  async getNameListDevice({ commit }, name) {
    const { result } = await DeviceCheck(name);
    const adminNameList = [];
    adminNameList.push(result.orgName);
    commit(ADM_NAME_LIST, { adminNameList });
  },

  // zwj#########################################################################################
  async TableForm({ commit }, { organization, offset, limit }) {
    const { result } = await CfTableForm({
      organization,
      offset,
      limit
    });

    commit(TABLE_DEVICE_FORM, { result, organization });
  },
  // async Tabledevice({ commit }, { deep, orgname, offset, limit }) {
  //   const { result } = await devicesTableForm(deep, orgname, offset, limit);
  //   commit(DEVICE_FORM, { result, organization: orgname });
  // },
  async DeviceGroups({ commit }, { organization, offset, limit }) {
    const { result } = await DeviceGroups({ organization, offset, limit });
    commit(DEVICEGROUP_FORM, result);
  }
};

import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const schedulerForm = param =>
  $http.get('/controller/sdwan/v1/config/schedulers', param);

// schedulerMaps创建
export const schedulerAdd = param =>
  $http.post('/controller/sdwan/v1/config/schedulers', param);

// qosProfile删除
export const schedulerDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/schedulers', param);

// qosProfile编辑
export const schedulerEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/schedulers', param);

// 获取选择器数据
export const seleteList = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/config/query/drop-profiles-name?deviceName=${deviceName}&orgName=${orgName}`
  );

// // 新增弹框Organization数据获取
// export const devicesOrg = () =>
//   $http.get('/controller/sdwan/v1/organizations/organization/name');

import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const schedulerMapsForm = param =>
  $http.get('/controller/sdwan/v1/config/scheduler-maps', param);

// schedulerMaps创建
export const schedulerMapsAdd = param =>
  $http.post('/controller/sdwan/v1/config/scheduler-maps', param);

// qosProfile创建删除
export const schedulerMapsDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/scheduler-maps', param);

// qosProfile编辑
export const schedulerMapsEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/scheduler-maps', param);

// 获取选择器数据
export const seleteList = (deviceName, orgName) =>
  $http.get(
    `/controller/sdwan/v1/config/query/schedulers-name?deviceName=${deviceName}&orgName=${orgName}`
  );

// // 新增弹框Organization数据获取
// export const devicesOrg = () =>
//   $http.get('/controller/sdwan/v1/organizations/organization/name');

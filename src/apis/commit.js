import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
//commit组织下拉框
export const commitOrg = param =>
  $http.get('/controller/sdwan/v1/organizations/organization/name', param);

//Select Template下拉框的值
export const selectTemplate = param =>
  $http.get('/controller/sdwan/v1/template/template/metadata', param);

// 列表的数据
export const commitForm = param =>
  $http.get('/controller/sdwan/v1/template/template/device', param);

//确定按钮
export const commitOk = param =>
  $http.post('/controller/sdwan/v1/template/template/commit', param);

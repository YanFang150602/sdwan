import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const branchForm = param =>
  $http.get('/controller/sdwan/v1/branchSdwanProfile', param);

//  branch创建
export const branchAdd = param =>
  $http.post('/controller/sdwan/v1/branchSdwanProfile/create', param);

// // branch删除;
export const branchDelete = param =>
  $http.post('/controller/sdwan/v1/branchSdwanProfile/delete', param);

// branch编辑
export const branchEdit = param =>
  $http.post('/controller/sdwan/v1/branchSdwanProfile/modify', param);

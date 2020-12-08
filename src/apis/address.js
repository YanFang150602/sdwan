import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const addressForm = param =>
  $http.get('/controller/sdwan/v1/config/addresses', param);

// address创建
export const addressAdd = param =>
  $http.post('/controller/sdwan/v1/config/addresses', param);

// address创建删除;
export const addressDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/addresses', param);

// address编辑
export const addressEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/addresses', param);

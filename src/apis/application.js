import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const applicationForm = param =>
  $http.get('/controller/sdwan/v1/config/applications', param);

//  application创建
export const applicationAdd = param =>
  $http.post('/controller/sdwan/v1/config/applications', param);

// application删除;
export const applicationDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/applications', param);

// application编辑
export const applicationEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/applications', param);

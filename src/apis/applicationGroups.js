import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const appGroupsForm = param =>
  $http.get('/controller/sdwan/v1/config/application-groups', param);

// 新增Group
export const GroupAdd = param =>
  $http.post('/controller/sdwan/v1/config/application-groups', param);

// 编辑
export const GroupEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/application-groups', param);
// 单个信息查询
export const GroupCheck = params =>
  $http.get('/controller/sdwan/v1/config/query/application-groups', params);

//删除;
export const appGroupsDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/application-groups', param);

// // address编辑
// export const addressEdit = (name, param) =>
//   $http.post(`/controller/sdwan/v1/address/modify/${name}`, param);

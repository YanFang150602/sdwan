import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const FilterForm = param =>
  $http.get('/controller/sdwan/v1/config/application-filters', param);

// 新增filter
export const FilterAdd = params =>
  $http.post('/controller/sdwan/v1/config/application-filters', params);

// 删除;
export const FilterDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/application-filters', param);

//单个查询
export const FilterCheck = param =>
  $http.get('/controller/sdwan/v1/config/query/application-filters', param);

// 编辑
export const FilterEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/application-filters', param);

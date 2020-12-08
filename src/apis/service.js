import { $http } from '@/utils/axios';

// 获取列表
export const ServiceList = param =>
  $http.get('/controller/sdwan/v1/config/services', param);

// 新增service
export const ServiceAdd = params =>
  $http.post('/controller/sdwan/v1/config/services', params);

// 修改service
export const ServiceEdit = params =>
  $http.post('/controller/sdwan/v1/config/modify/services', params);

// 删除service
export const ServiceDelete = params =>
  $http.post('/controller/sdwan/v1/config/delete/services', params);

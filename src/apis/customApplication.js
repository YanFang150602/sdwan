import { $http } from '@/utils/axios';

// 新增filter
export const FilterAdd = params =>
  $http.post(
    '/controller/sdwan/v1/template/template/application-filters',
    params
  );

// 新增service
export const ServiceAdd = params =>
  $http.post('/controller/sdwan/v1/template/template/services', params);

// 获取predefined application列表
export const predefinedApplication = () =>
  $http.get('/controller/sdwan/v1/template/template/application-prede');

// 新增Group
export const GroupAdd = params =>
  $http.post('/controller/sdwan/v1/config/application-groups', params);

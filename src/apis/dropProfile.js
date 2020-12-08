import { $http } from '@/utils/axios';

// 获取列表
export const qosProfilesList = param =>
  $http.get('/controller/sdwan/v1/config/drop-profiles', param);

// 修改接口
export const changeQosProfiles = param =>
  $http.post(`/controller/sdwan/v1/config/modify/drop-profiles`, param);

// 新增数据
export const addQosProfiles = param =>
  $http.post('/controller/sdwan/v1/config/drop-profiles', param);

// 删除数据
export const deleteQosProfiles = param =>
  $http.post('/controller/sdwan/v1/config/delete/drop-profiles', param);

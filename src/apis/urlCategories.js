import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const urlCategoriesForm = param =>
  $http.get('/controller/sdwan/v1/config/url-categories', param);

// urlCategories创建
export const urlCategoriesAdd = param =>
  $http.post('/controller/sdwan/v1/config/url-categories', param);

// urlCategories删除;
export const urlCategoriesDelete = param =>
  $http.post('/controller/sdwan/v1/config/delete/url-categories', param);

// urlCategories编辑
export const urlCategoriesEdit = param =>
  $http.post('/controller/sdwan/v1/config/modify/url-categories', param);

// urlCategories新增弹框中的下拉框
export const urlCategoriesSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/url-reputations-name', param);

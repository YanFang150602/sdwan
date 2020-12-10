import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const steeringForm = param =>
  $http.get('/controller/sdwan/v1/template/template/app-list', param);

// applicationSteering列表删除;
export const steeringDelete = param =>
  $http.post('/controller/sdwan/v1/template/template/app-delete', param);

//applicationSteering组织下拉框
export const steeringOrg = param =>
  $http.get('/controller/sdwan/v1/organizations/organization/name', param);

// SourceZones下拉框数据
export const SourceZonesSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/zones-name', param);

//WAN Circuit下拉框的数据
export const WANCircuitSelect = param =>
  $http.get('/controller/sdwan/v1/template/template/network', param);

//Custom Applications下拉框数据
export const ApplicationSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/applications-name', param);
// //Custom Applications Filters下拉框数据
export const FiltersSelect = param =>
  $http.get(
    '/controller/sdwan/v1/config/query/application-filters-name',
    param
  );
//Custom Applications Groups下拉框数据
export const GroupsSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/application-groups-name', param);

//Custom URL Categories 下拉框数据
export const CategoriesSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/url-categories-name', param);
//Custom Service下拉框数据
export const ServiceSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/services-name', param);
// 左侧五个下拉框
export const LeftSelectAll = param =>
  $http.get('/controller/sdwan/v1/config/query/predefined-app-name-all', param);

// Source Address下拉框接口
export const SourceAddressSelect = param =>
  $http.get('/controller/sdwan/v1/config/query/addresses-name', param);

// 四个方框的数据
export const BoxInformationList = param =>
  $http.get('/controller/sdwan/v1/template/template/app-samples', param);

// 新增中的创建
export const steeringCreate = (param, isAdd) => {
  if (isAdd)
    return $http.post('/controller/sdwan/v1/template/template/app', param);
  $http.post('/controller/sdwan/v1/template/template/app-modify', param);
};

// 点击列表查询
export const steeringListCheck = param =>
  $http.get('/controller/sdwan/v1/template/template/app', param);

// 部署接口
export const steeringDeploy = param =>
  $http.post('/controller/sdwan/v1/template/template/app-deploy', param);

//Predefined Application下拉框数据
//Predefined Application Filters下拉框数据
//Predefined Application Groups下拉框数据
//Predefined URL Categories下拉框数据
//Predefined Service下拉框数据

// address创建
// export const addressAdd = param =>
//   $http.post('/controller/sdwan/v1/address', param);

// // address编辑
// export const addressEdit = (name, param) =>
//   $http.post(`/controller/sdwan/v1/address/modify/${name}`, param);

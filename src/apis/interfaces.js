import { $http } from '@/utils/axios';
// ---------------ethernet------------------
/**
 * @desc 获取ethernet列表
 * @param {Object}  //
 */

export const ethernetList = (deviceName, offset, limit) =>
  $http.get(
    `/controller/sdwan/v1/interface/vni/${deviceName}?offset=${offset}&limit=${limit}`
  );

// 查询单条数据
export const ethernetData = (deviceName, name) =>
  $http.get(`/controller/sdwan/v1/vni/${deviceName}?name=${name}`);

// 修改接口
export const changeEthernet = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/vni/modify/${deviceName}`, param);

// ---------------Pseudo------------------
// 获取Pseudo列表
export const pseudoList = (deviceName, offset, limit) =>
  $http.get(
    `/controller/sdwan/v1/interface/ptvi/${deviceName}?offset=${offset}&limit=${limit}`
  );

// 查询选择器数据 getPtviParent
export const getPtviParent = deviceName =>
  $http.get(
    `/controller/sdwan/v1/config/query/ptvi-parent?deviceName=${deviceName}`
  );
// 查询单条数据
export const PseudoData = (deviceName, name) =>
  $http.get(`/controller/sdwan/v1/ptvi/${deviceName}?name=${name}`);

// 修改数据
export const changePseudo = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/ptvi/modify/${deviceName}`, param);

// 新增数据
export const addPseudo = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/ptvi/${deviceName}`, param);

// 删除数据
export const deletePseudo = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/ptvi/delete/${deviceName}`, param);

// ---------------Tunnel------------------
// 获取Pseudo列表
export const tunnelList = (deviceName, offset, limit) =>
  $http.get(
    `/controller/sdwan/v1/interface/tvi/${deviceName}?offset=${offset}&limit=${limit}`
  );

// 查询单条数据
export const TunnelData = (deviceName, name) =>
  $http.get(`/controller/sdwan/v1/tvi/${deviceName}?name=${name}`);

// 新增数据
export const addTunnel = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/tvi/${deviceName}`, param);

// 查询新增Routing Instance的数据
export const routingData = deviceName =>
  $http.get(
    `/controller/sdwan/v1/config/query/routing-instance-name?deviceName=${deviceName}`
  );

// 修改数据
export const changeTunnel = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/tvi/modify/${deviceName}`, param);

// 删除数据
export const deleteTunnel = (deviceName, param) =>
  $http.post(`/controller/sdwan/v1/tvi/delete/${deviceName}`, param);

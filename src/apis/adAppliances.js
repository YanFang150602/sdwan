import { $http } from '@/utils/axios';
// /**
//  * @desc 获取设备列表
//  */
// 获取列表
export const adDeviceForm = param =>
  $http.get('/controller/sdwan/v1/device/device/status', param);

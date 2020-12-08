import { $http } from '@/utils/axios';

/**
 * @desc 验证码
 */
export const verification = () => $http.post('/verification-code');

/**
 * @desc 登录
 * @param {Object}
 */
export const login = param => $http.post('/login-verification-standard', param);

/**
 * @desc 获取用户信息
 * @param {String}
 */
export const getUserInfo = id =>
  $http.get(`/controller/sdwan/v1/tenant/modify/${id}`);

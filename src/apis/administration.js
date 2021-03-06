import { $http } from '@/utils/axios';
/**
 * @desc 获取组织名称
 * @param {Number} offset
 * @param {Number} limit
 */

export const adminNameLists = () =>
  $http.get('/controller/sdwan/v1/organizations/organization/name');

/**
 * @desc 获取组织名称
 * @param {Object}
 */

export const adminList = param =>
  $http.get('/controller/sdwan/v1/organizations', param);

/**
 * @desc 获取组织导航树信息
 * @param {Object}
 */
export const adminTreeList = () =>
  $http.get('/controller/sdwan/v1/organizations/organization/nav-tree');

/**
 * @desc 获取组织全局id
 */
export const adminId = () =>
  $http.get('/controller/sdwan/v1/organizations/organization/id');

/**
 * @desc 路由实例id获取
 */
export const adminRouerId = () =>
  $http.get('/controller/sdwan/v1/organizations/organization/vrf?count=10');

/**
 * @desc 组织列表添加
 * @param {Object}
 */
export const adminAdd = param =>
  $http.post('/controller/sdwan/v1/organizations', param);

/**
 * @desc 组织列表添加
 * @param {Object}
 */
export const adminRightAdd = param =>
  $http.post('/controller/sdwan/v1/roles', param);

/**
 * @desc 组织角色列表
 */
export const admRightList = () =>
  $http.get('/controller/sdwan/v1/roles/role/id');

/**
 * @desc 组织权限列查询
 * @param {String}
 */
export const adminRight = param =>
  $http.get(`/controller/sdwan/v1/roles/modify/${param}`);

/**
 * @desc 组织编辑
 * @param {String} name
 * @param {Object} param
 */

export const adminedit = (name, param) =>
  $http.post(`/controller/sdwan/v1/organizations/modify/${name}`, param);

/**
 * @desc 组织删除
 * @param {Object}
 */
export const adminDel = param =>
  $http.post('/controller/sdwan/v1/organizations/organization/delete/', param);

/**
 * @desc 组织查询
 * @param {String}
 */
export const adminSearch = param =>
  $http.get(`/controller/sdwan/v1/organizations/modify/${param}`);

/**
 * @desc 组织用户查询
 * @param {Object}
 */

export const adminUsersLists = param =>
  $http.get('/controller/sdwan/v1/tenant', param);

/**
 * @desc 查询权限对应的个性化页面
 * @param {String}
 */

export const rolePage = param =>
  $http.get(`/controller/sdwan/v1/roles/role/page?role=${param}`);

/**
 * @desc 组织用户创建
 * @param {Object}
 */

export const adminUserAdd = param =>
  $http.post('/controller/sdwan/v1/tenant', param);

/**
 * @desc 组织用户删除
 * @param {Object}
 */

export const adminUserDel = param =>
  $http.post('/controller/sdwan/v1/tenant/tenant/delete', param);

/**
 * @desc 组织用户修改
 * @param {Object} param
 * @param {String} name
 */

export const adminUserEdt = (name, param) =>
  $http.post(`/controller/sdwan/v1/tenant/modify/${name}`, param);

//##############################################################################
/**
 * @desc 组织用户修改
 * @param {Object} param
 * @param {String} name
 */

export const templateList = param =>
  $http.get('/controller/sdwan/v1/template', param);

/**
 * @desc 组织用户修改
 * @param {String} orgname
 * @param {String} deviceType
 */

export const spokeSeach = ({ orgname, deviceType }) =>
  $http.get('/controller/sdwan/v1/device/device/type', {
    orgname,
    deviceType
  });

/**
 * @desc 组织用户修改
 * @param {String} orgname
 * @param {String} deviceType
 */

export const spokeList = ({ offset, limit, orgname }) =>
  $http.get('/controller/sdwan/v1/spokegroup', {
    offset,
    limit,
    orgname
  });

/**
 * @desc 控制器获取
 * @param {String} organization
 */

export const controllerWrap = ({ organization }) =>
  $http.get('/controller/sdwan/v1/organizations/organization/ctl', {
    organization
  });

/**
 * @desc 模板创建
 * @param {Object} param
 */

export const templateAdd = param =>
  $http.post('/controller/sdwan/v1/template', param);

/**
 * @desc 模板删除
 * @param {Object} param
 */

export const templateDel = param =>
  $http.post('/controller/sdwan/v1/template/template/delete', param);

/**
 * @desc 模板查询
 * @param {String} param
 */

export const templateSearch = param =>
  $http.get(`/controller/sdwan/v1/template/modify/${param}`);

/**
 * @desc 模板修改
 * @param {String} param
 */

export const templateEdt = (name, param) =>
  $http.post(`/controller/sdwan/v1/template/modify/${name}`, param);

/**
 * @desc 模板Network Name
 * @param {Object} param
 */

export const networkName = param =>
  $http.get('/controller/sdwan/v1/template/template/network', param);

/**
 * @desc 模板部署
 * @param {Object} param
 */

export const templateCrt = param =>
  $http.post('/controller/sdwan/v1/template/template/deploy', param);

/**
 * @desc 模板networkname新建
 * @param {Object} param
 */

export const netWrokNameCre = param =>
  $http.post('/controller/sdwan/v1/template/template/network', param);

/**
 * @desc 模板networkname Transport Domain查询
 */

export const TraDomain = () =>
  $http.get('/controller/sdwan/v1/template/template/domains');

/**
 * @param {Object} 组织名
 * @desc 模板server porpfile 下拉内容
 */

export const profile = param =>
  $http.get('/controller/sdwan/v1/template/template/dhcpProfile', param);

/**
 * @desc 租户密码修改
 * @param {Object} param
 */

export const passWordEdt = param =>
  $http.post('/controller/sdwan/v1/tenant/tenant/password', param);

/**
 * @desc 任务进度
 * @param {Object} param
 */

export const taskNotice = param =>
  $http.get('/controller/sdwan/v1/organizations/organization/task', param);

<template>
  <div>
    <a-tabs default-active-key="6">
      <a-tab-pane key="1" tab="NTP Servers (0)">
        <div class="tableSub" data-text="NTP Servers">
          <div class="ntpTable">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Reachability via</span>
                  </th>
                  <th>
                    <span>IP Address/FQDN</span>
                  </th>
                  <th style="width:142px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>

                  <td class="addBtn"><button>+</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Syslog Servers (0)" force-render>
        <div class="tableSub" data-text="Syslog Servers">
          <div class="syslogTable">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Reachability via</span>
                  </th>
                  <th>
                    <span>IP Address/FQDN</span>
                  </th>
                  <th style="width:142px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>

                  <td class="addBtn"><button>+</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="TACACS+ Servers (0)" force-render>
        <div class="tableSub" data-text="TACACS+ Servers">
          <div class="tacTable">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Reachability via</span>
                  </th>
                  <th>
                    <span>IP Address/FQDN</span>
                  </th>
                  <th>
                    <span>Authentication Key</span>
                  </th>
                  <th>
                    <span>Actions</span>
                  </th>
                  <th style="width:75px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td class="addBtn"><button>+</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="RADIUS Servers (0)" force-render>
        <div class="tableSub" data-text="RADIUS Servers">
          <div class="radTable">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Reachability via</span>
                  </th>
                  <th>
                    <span>IP Address/FQDN</span>
                  </th>
                  <th>
                    <span>Authentication Key</span>
                  </th>
                  <th>
                    <span>Actions</span>
                  </th>
                  <th style="width:75px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td class="addBtn"><button>+</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="5" tab="SNMP Managers (0)" force-render>
        <div class="tableSub" data-text="SNMP Managers">
          <div class="snmpInfo">
            <a-row>
              <a-col :span="2">Versions</a-col>
              <a-col :span="22">
                <a-checkbox-group>
                  <a-checkbox value="v1">v1</a-checkbox>
                  <a-checkbox value="v2c">v2c</a-checkbox>
                  <a-checkbox value="v3">v3</a-checkbox>
                </a-checkbox-group>
              </a-col>
            </a-row>
            <a-row :style="{ padding: '5px 0' }">
              <a-col :span="2">Community</a-col>
              <a-col :span="22"><input type="text"/></a-col>
            </a-row>
            <a-row>
              <a-col :span="10"
                >User Name<label style="padding-left:45px"
                  ><a-icon type="setting"/>
                  <input
                    style="width:160px;margin-left:3px"
                    type="text"/></label
              ></a-col>
              <a-col :span="14"
                >Password<label style="padding-left:55px"
                  ><a-icon type="setting"/>
                  <input
                    style="width:160px;margin-left:3px"
                    type="password"/></label
              ></a-col>
            </a-row>
          </div>
          <div class="snmpTable" style="margin-top:22px">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Reachability via</span>
                  </th>
                  <th>
                    <span>IP Address</span>
                  </th>
                  <th style="width:142px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>

                  <td class="addBtn"><button>+</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="6" tab="LDAP Servers (0)" force-render>
        <div class="tableSub" data-text="LDAP Servers">
          <div class="ldapTable">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>Reachability via</span>
                  </th>
                  <th>
                    <span>IP Addresses</span>
                  </th>
                  <th>
                    <span>Domain Name</span>
                  </th>
                  <th>
                    <span>Base DN</span>
                  </th>
                  <th>
                    <span>Bind DN</span>
                  </th>
                  <th>
                    <span>Bind Password</span>
                  </th>
                  <th style="width:75px"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select>
                      <option selected>--Select--</option>
                    </select>
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td>
                    <a-icon type="setting" />
                    <input type="text" />
                  </td>
                  <td class="addBtn"><button>+</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
/deep/.ant-tabs-nav {
  border-bottom: 1px solid #456880;
  .ant-tabs-tab {
    background: transparent !important;
    color: #fff !important;
    font-size: 12px;
    padding: 0 !important;
    width: auto !important;
    margin-right: 16px !important;
    padding-bottom: 8px !important;
  }
  .ant-tabs-ink-bar {
    border-bottom: 3px solid #a7d054;
  }
}
.ntpTable,
.syslogTable,
.tacTable,
.radTable,
.snmpTable,
.ldapTable {
  height: 220px;
  background: #fff;
  th {
    width: 535px;
  }
}
.tacTable,
.radTable {
  th {
    width: 285px;
  }
}
.ldapTable {
  th {
    width: 190px;
  }
}
.snmpInfo {
  .ant-col {
    color: #fff;
    font-size: 12px;
    .ant-checkbox-wrapper {
      color: #fff;
      font-size: 12px;
      width: 95px;
      margin-right: 16px;
    }
    input {
      border: 1px solid #b0c7d5;
      padding: 0px 3px;
      height: 20px;
      border-radius: 4px;
      color: #0f2c3e;
      font-size: 12px;
      line-height: 18px;
      width: 285px;
    }
  }
}
</style>

<template>
  <div>
    <a-modal v-model="visible" title="Confirm Delete" on-ok="handleOk" :maskClosable="false">
      <template slot="footer">
        <a-button
          :loading="loading"
          key="submit"
          type="primary"
          @click="handleOk"
          style="baclGround:#a7d054"
        >Yes</a-button>
        <a-button key="back" type="danger" @click="handleCancel">No</a-button>
      </template>
      <p>Are you sure want to delete the selected record(s)?</p>
    </a-modal>
  </div>
</template>
<script>
import { ServiceDelete } from 'apis/scheduler';
import { mapState } from 'vuex';
export default {
  props: ['DeleName'],
  data() {
    return {
      loading: false,
      visible: false,
      dele: {
        name: '',
        deviceName: '',
        orgName: ''
      }
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName'])
  },
  methods: {
    showModalDelete() {
      this.visible = true;
    },
    async handleOk() {
      this.loading = true;
      // setTimeout(() => {
      //   this.loading = false;
      // }, 3000);
      console.log(this.DeleName);
      this.dele.name = this.DeleName;
      this.dele.deviceName = this.deviceName;
      this.dele.orgName = this.organization;
      const res = await ServiceDelete(this.dele);
      console.log(res);
      this.loading = false;
      if (res.message === 'Success') {
        this.visible = false;
        this.$message.success('删除成功');
        this.$parent.tableForm();
      } else {
        this.$message.error(res.message);
      }
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.ant-modal-content {
  max-height: 325px;
  .ant-modal-header {
    height: 36px;
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    padding: 3px;
    background-color: #ffffff;
    height: 100px;
    p {
      margin-left: 20px;
      margin-top: 20px;
    }
  }
  .ant-modal-footer {
    background-color: #e9f4fc;
    height: 50px;
  }
}
/deep/.ant-modal-title {
  font-size: 12px;
  margin-left: -12px;
}
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
}
/deep/.ant-btn-danger {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
}
/deep/.ant-modal-title {
  font-size: 12px;
}
</style>

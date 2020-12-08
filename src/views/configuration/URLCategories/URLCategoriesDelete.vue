<template>
  <div>
    <a-modal v-model="visible" title="Confirm Delete" on-ok="handleOk">
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :loading="loading"
          style="baclGround:#a7d054"
          >Yes</a-button
        >
        <a-button key="back" @click="handleCancel">No</a-button>
      </template>
      <p>Are you sure want to delete the selected record(s)?</p>
    </a-modal>
  </div>
</template>
<script>
import { urlCategoriesDelete } from 'apis/urlCategories';
import { mapState } from 'vuex';

export default {
  props: ['URLCategoriesDelete'],
  data() {
    return {
      visible: false,
      loading: false
    };
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  methods: {
    showModalDelete() {
      this.visible = true;
    },
    async handleOk() {
      this.loading = true;
      // setTimeout(() => {
      //   this.visible = false;
      //   this.loading = false;
      // }, 3000);
      const res = await urlCategoriesDelete({
        name: this.URLCategoriesDelete.name,
        objectName: this.deviceName,
        objectType: this.objectType,
        orgName: this.organization
      });
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

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
}
/deep/button[data-v-36f0eb6c]:nth-child(2) {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
}
</style>

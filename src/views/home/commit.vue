<template>
  <div>
    <a-modal
      v-drag
      v-model="visible"
      title="Commit"
      on-ok="handleOk"
      width="865px"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :loading="loading"
          >Ok</a-button
        >
        <a-button key="back" @click="handleCancel">Cancel</a-button>
      </template>
      <a-form-model
        :model="form"
        ref="ruleForm"
        :rules="rules"
        @validate="validate"
      >
        <div class="title">
          <a-row>
            <a-col :span="8">
              <a-form-model-item>
                <a-form-model-item label="Organization" prop="name">
                  <a-select
                    v-model="form.region"
                    placeholder="please select your zone"
                  >
                    <a-select-option value="shanghai">Zone one</a-select-option>
                    <a-select-option value="beijing">Zone two</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item>
                <a-form-model-item>
                  <a-form-model-item>
                    <a-radio-group v-model="form.resource">
                      <a-radio value="1">Template</a-radio>
                      <a-radio value="2">Service Template</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-form-model-item>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-modal>
    <!-- 表单验证悬浮提示框 -->
    <div
      v-show="formTips.flag"
      class="form-tips"
      :style="formTips.positionStyle"
    >
      {{ formTips.tipText }}
    </div>
  </div>
</template>
<script>
// import { addressAdd } from 'apis/address';
import { mapState } from 'vuex';
import { name, select } from '@/validate/common';
import tip from '@/mixins/tip';

export default {
  mixins: [tip],
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        description: '',
        name: '',
        objectName: '',
        objectType: '',
        orgName: '',
        tags: [],
        type: '',
        value: ''
      },
      rules: {
        name: [{ validator: name }],
        type: [{ validator: select }],
        value: [{ validator: name }]
      }
    };
  },
  directives: {
    // 拖拽自定义指令
    drag(el) {
      // console.log('移动', el);
      // 将ant-modal的position改为静态，使拖拽框按照电脑屏幕定位
      // el.children[1].children[0].style.position = 'static';
      // 获取到ant-modal-content元素
      let targetEl = el.children[1].children[0].children[1];
      // targetEl.style.top = '100px';
      targetEl.onmousedown = function(e) {
        // 点下鼠标的位置
        let startX = e.pageX;
        let startY = e.pageY;
        // 点下鼠标的元素的位置
        let offsetX = targetEl.offsetLeft;
        let offsetY = targetEl.offsetTop;
        document.onmousemove = function(e) {
          // 计算出元素的left 和 top 值
          let dx = offsetX + (e.pageX - startX);
          let dy = offsetY + (e.pageY - startY);
          // // 进行拖拽范围的限制(不能超出屏幕)
          // dx = Math.max(0, dx);
          // dy = Math.max(0, dy);
          // let scrollWidth = window.innerWidth - targetEl.offsetWidth;
          // let scrollHeight = window.innerHeight - targetEl.offsetHeight;
          // dx = Math.min(scrollWidth, dx);
          // dy = Math.min(scrollHeight, dy);
          // 设置元素的left和top值，实现拖拽
          targetEl.style.left = dx + 'px';
          targetEl.style.top = dy + 'px';
        };
        // 鼠标弹起，取消鼠标移动事件
        targetEl.onmouseup = function() {
          document.onmousemove = null;
        };
      };
    }
  },
  computed: {
    ...mapState(['organization', 'deviceName', 'objectType'])
  },
  methods: {
    showModalAdd() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);

      // this.$refs.ruleForm.validate(async (valid, res) => {
      //   console.log(res);
      //   if (valid) {
      //     const res = await addressAdd(this.form);
      //     console.log(res);
      //     if (res.message === 'Success') {
      //       this.visible = false;
      //       this.$message.success('创建成功');
      //       this.$parent.tableForm();
      //       this.clear();
      //     } else {
      //       this.$message.error(res.message);
      //     }
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });
    },
    handleCancel() {
      this.visible = false;
      // this.clear();
      // this.$refs.ruleForm.resetFields();
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      console.log(value);
      this.form.tags = value;
      console.log(this.form.tags);
    }
  }
};
</script>
<style lang="scss">
.ant-form-item-required {
  &::before {
    display: none;
  }
  &::after {
    content: '*' !important;
    color: #f5222d !important;
    font-size: 18px !important;
    margin-left: 4px !important;
    display: inline-block !important;
  }
}
</style>
<style lang="scss" scoped>
// label样式
/deep/.ant-modal-title {
  font-size: 12px;
  margin-left: -12px;
}
/deep/.ant-form label {
  font-size: 12px;
}
/deep/.ant-modal-close-x {
  line-height: 36px;
  width: 40px;
}
// -----------------------
/deep/.ant-form-explain {
  display: none !important;
}
/deep/.ant-form-item-label > label::after {
  display: none;
}
// 弹框的样式
/deep/.ant-modal-content {
  max-height: 1000px;
  .ant-modal-header {
    height: 31px;
    background-color: #e9f4fc;
    .ant-modal-title {
      line-height: 8px;
    }
  }
  .ant-modal-body {
    height: 193px;
    padding: 3px;
    background-color: #36536b;
  }
  .ant-modal-footer {
    height: 50px;
    background-color: #e9f4fc;
  }
}
.title {
  /deep/.ant-radio-wrapper {
    color: #f9f9f9;
  }
  /deep/.ant-form-item-label > label {
    color: #f9f9f9;
  }
  /deep/.ant-form-item {
    padding: 0;
    width: 270px;
    // margin-bottom: 0;
    // margin: auto;
    .ant-form-item-label {
      line-height: 19px;
    }
    .ant-form-item-control {
      line-height: 19px;
    }
    .ant-select-selection--single {
      width: 270px;
      height: 20px;
    }
    .ant-select-selection__rendered {
      line-height: 20px;
    }
  }
}

// 按钮
/deep/.ant-btn-primary {
  width: 70px;
  height: 30px;
  background-color: #a7d054;
  border: none;
  font-size: 12px;
}
/deep/.ant-btn:nth-child(2) {
  width: 70px;
  height: 30px;
  background-color: #3f4a5b;
  border: none;
  color: #ffffff;
  font-size: 12px;
}
</style>

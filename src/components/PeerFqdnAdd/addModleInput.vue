<template>
  <a-row class="add-item" type="flex" justify="space-between" align="middle">
    <a-col class="body-input" :span="2"
      ><input @change="selectChange" :checked="itemdata.checked" type="checkbox"
    /></a-col>
    <a-col @click="show" class="body-txt" :span="22">
      <a-input
        type="text"
        :class="this.rule ? action : ''"
        v-show="visible"
        v-model="peerId"
        @mouseenter="error"
        @mouseleave="leave"
        @mousemove="updateXY"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
      </a-input>
      <span v-show="!visible">{{ peerId }}</span>
      <!-- 表单验证悬浮提示框 -->
      <div
        v-show="formTips.flag"
        class="form-tips"
        :style="formTips.positionStyle"
      >
        {{ formTips.tipText }}
      </div>
    </a-col>
  </a-row>
</template>

<script>
import common from '@/mixins/common';
export default {
  props: {
    itemdata: Object,
    selectData: Array,
    inputType: String
  },
  mixins: [common],
  data() {
    return {
      visible: true,
      peerId: '',
      rule: false // rule为true不满足正则验证
    };
  },
  created() {
    console.log(this.itemdata, '341');
    if (this.itemdata.value) {
      this.visible = false;
      this.peerId = this.itemdata.value;
    }
  },
  methods: {
    show(e) {
      e.stopPropagation();
      this.visible = true;
    },
    error() {
      if (this.rule) {
        this.enter(`Invalid ${this.inputType}/Prefix Length`, true);
        this.rule = false;
      }
    },
    handleChange(value) {
      console.log(this.itemdata, '输入框数据');
      console.log(this.visible, 333);
      if (value)
        this.$emit('changedata', {
          id: this.itemdata.id,
          value: this.peerId,
          rule: this.rule
        });
    },

    handleBlur() {
      console.log(this.peerId, '测试数据');
      console.log(this.inputType, '输入框类型1');
      if (this.peerId && this.inputType) {
        let rule = '';
        if (this.inputType === 'ipv4') {
          rule = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(\d|[1-2]\d|3[0-2]))?$/;
        } else if (this.inputType === 'ipv6') {
          rule = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
        }
        const la = rule.test(this.peerId);
        console.log(la, 5554);
        if (la) {
          this.visible = false;
          this.rule = false;
        } else {
          this.rule = true;
          this.handleChange(this.peerId);
        }
      } else {
        if (this.peerId) {
          this.visible = false;
        } else {
          console.log(123);
          this.$emit('remove');
        }
      }
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    selectChange() {
      this.$emit('selectchange', this.itemdata.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-item {
  height: 22px;
  line-height: 22px;
  .body-input {
    text-align: center;
  }
  .body-txt {
    border-left: 1px solid #97acbe;
    padding: 0 2px;
    line-height: 22px;
    input {
      width: 100%;
      height: 20px;
      // border: 1px solid #b0c7d5;
      border-radius: 4px;
      box-sizing: border-box;
      // background-color: #fff ;
    }
    input:focus {
      // box-shadow: none;
      // border: 1px solid #b0c7d5;
      // border-color: #fff !important;
    }
  }
}
.action {
  border: 1px solid red;
}
.add-item:nth-child(2n + 1) {
  background: #e9eef4;
}
</style>

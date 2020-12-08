export default {
  data() {
    return {
      message: {}, //表单提示信息
      // 表单提示悬浮框
      formTips: {
        flag: false,
        tipText: '',
        x: 0,
        y: 0,
        positionStyle: { top: '20px', left: '20px' }
      }
    };
  },
  methods: {
    //验证表单提示信息
    validate(field, valid, message) {
      if (valid) {
        this.message[field] = '';
      } else {
        this.message[field] = message;
      }
    },
    enter(field) {
      if (this.message[field]) {
        this.formTips.tipText = this.message[field];
        this.formTips.flag = true;
      }
    },
    leave() {
      this.formTips.flag = false;
    },
    updateXY(event) {
      this.x = event.pageX;
      this.y = event.pageY;
      this.formTips.positionStyle = {
        top: this.y + 14 + 'px',
        left: this.x - 2 + 'px'
      };
    },
    guid() {
      return Number(
        Math.random()
          .toString()
          .substr(3, 3) + Date.now()
      ).toString(36);
    }
  }
};

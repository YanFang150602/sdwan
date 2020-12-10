import Pagination from 'components/Pagination';
export default {
  data() {
    return {
      // 分页控制
      offset: 0,
      pageSize: 20,
      totalCount: 0,
      keyworks: '', //搜索关键字
      tableData: [], //表格数据源
      visible: false, //弹出层开关
      loading: false, //提交加载图标
      modalTitle: '', //表单标题
      modalType: 'add', //表单编辑or新建
      message: {}, //表单提示信息
      // 表单提示悬浮框
      formTips: {
        flag: false,
        tipText: '',
        x: 0,
        y: 0,
        positionStyle: { top: '20px', left: '20px' }
      },
      delIds: []
    };
  },
  methods: {
    // 分页查询
    pageChange(pageIndex) {
      this.offset = (pageIndex - 1) * this.pageSize;
      this.lists();
    },
    pageSizeChange(pageSize) {
      this.offset = 0;
      this.pageSize = pageSize;
      this.lists();
    },
    selectAll(selection) {
      this.delIds = [];
      selection.map(item => {
        this.delIds.push(item.name);
      });
    },
    // 搜索
    search(data) {
      // 转换全小写,实现模糊匹配
      let field = '';
      switch (this.$route.name) {
        case 'Organizations':
          field = 'orgName';
          break;
        case 'Templates':
          field = 'templateName';
          break;
        default:
          field = 'name';
      }

      const keyword = data.trim().toLowerCase();
      const list = this.tableData.filter(item =>
        item[field].toLowerCase().includes(keyword)
      );

      this.totalCount = list.length;
      this.tableData = list;
    },
    cancelSearch() {
      this.offset = 0;
      this.lists();
    },
    //验证表单提示信息
    validate(field, valid, message) {
      if (valid) {
        this.message[field] = '';
      } else {
        this.message[field] = message;
      }
    },
    enter(field, type) {
      if (this.message[field]) {
        this.formTips.tipText = this.message[field];
        this.formTips.flag = true;
      }
      if (type && field) {
        this.formTips.tipText = field;
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
    // 修改 formData select 默认提交值
    selectInitial(val, type) {
      if (type === 'show') {
        val ? val : (val = '--Select--');
      }
      if (type === 'submit') {
        val && val != '--Select--' ? val : (val = null);
      }
      return val;
    },
    guid() {
      return Number(
        Math.random()
          .toString()
          .substr(3, 3) + Date.now()
      ).toString(36);
    }
  },
  components: {
    Pagination
  }
};

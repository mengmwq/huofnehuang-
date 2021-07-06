<template>
  <div>
    <!-- <div class="formTitle">
    <div class="title">添加出库</div>
  </div> -->
    <el-card>
      <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}">
        <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
          <template slot-scope="scope">

            <div v-if="header.prop == 'channel'">
              {{scope.row.channel | stockChannelFilter}}
            </div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-row type="flex" class="mt20" justify="end">
      <el-button type="default" size="small" @click="goBack">取消</el-button>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </el-row>
  </div>
</template>
<script>
  import { Org } from "@/model/Org";
  import Api from "@/api/index";
  import ValidForm from "@/utils/ValidForm";

  export default {
    name: "StorageAdd",
    components: {
    },
    props: [],
    data: function() {
      return {
        isShowTree: false,
        dialogVisible: false,

        listData: [],
        tableHeader: [{
          prop: 'warehouseName',
          label: '库名',
          width: '120',
          show: true
        }, {
          prop: 'houseName',
          label: '仓名',
          width: '120',
          show: true
        },{
          prop: 'cabinetName',
          label: '柜名',
          width: '120',
          show: true
        }, {
          prop: 'grideName',
          label: '位名',
          width: '120',
          show: true
        }, {
          prop: 'projectCode',
          label: '项目编号',
          width: '120',
          show: true
        }, {
          prop: 'projectName',
          label: '项目名称',
          width: '120',
          show: true
        }, {
          prop: 'boxSn',
          label: '包装箱号',
          width: '120',
          show: true
        }, {
          prop: 'specialPrecautions',
          label: '特殊注意事项',
          width: '120',
          show: true
        }, {
          prop: 'number',
          label: '数量',
          width: '120',
          show: true
        }, {
          prop: 'insidePackageCount',
          label: '箱内件数',
          width: '120',
          show: true
        }, {
          prop: 'weight',
          label: '毛重(kg)',
          width: '120',
          show: true
        }, {
          prop: 'volume',
          label: '体积(m³)',
          width: '120',
          show: true
        }, {
          prop: 'channel',
          label: '出入库途径',
          width: '120',
          show: true
        }],
        rules: {
          roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
          orgId: [
            { required: true, message: "请选择隶属机构", trigger: "change" }
          ],
          username: [
            { required: true, message: "请输入登录账号", trigger: "blur" }
          ],
          realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
          mobile: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            { pattern: ValidForm.mobileReg, message: "请正确输入手机号码" }
          ],
          type: [
            { required: true, message: "请选择证件类型", trigger: "change" }
          ],
          identityCard: [
            { required: true, message: "请输入证件号", trigger: "change" },
            {
              pattern: ValidForm.identityCardReg,
              message: "请正确输入证件号码!",
              trigger: "change"
            }
          ],
          email: [
            {
              pattern: ValidForm.emailReg,
              message: "请正确输入电子邮件!",
              trigger: "change"
            }
          ]
        }
      };
    },
    computed: {
    },
    mounted() {
      //   this.$store.dispatch('selectAllRole')
      //   const curOrg = new Org();
      this.listData = this.$store.state.stock.stockOutIds
    },
    methods: {
      goBack(){
        history.go(-1)
      },
      /**
       * 手动出库的提交
       * */
      submit () {
        if (this.listData.length ==0) {
          this.$notify.warning({
            title: '提示',
            message: '请在库存清单页面勾选要出库的记录之后在进行出库操作'
          })
          return
        }
        let param = {
          ids: []
        }
        this.listData.forEach(function (item) {
          param.ids.push(item.id)
        })
        Api.manualExportStocak(param).then((res) => {
          if (res) {
            this.$notify.success({
              title: '提示',
              message: '出库提交成功'
            })
            this.$router.push({path: '/router/storage'})
          }
        })
      },
      /**
       * 关闭浮窗
       */
      closeDialog: function() {
        this.$emit("closeEditDialog", false);
      }
    }
  };
</script>
<style lang="scss">
  .el-timeline {
    margin:0;
    padding:0;
  }
</style>

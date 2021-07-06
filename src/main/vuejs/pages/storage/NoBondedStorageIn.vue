<template>
  <!--添加货物-->
  <el-dialog title="入库操作" :before-close="closeDialog" :visible.sync="isShowDialog" width="60%">
    <el-table
      class="page-table mb10"
      :data="goodsInfo"
      stripe
      highlight-current-row
      show-summary
      :summary-method="getSummaries"
      :cell-style="{color:'#333'}"
    >
      <template v-for="(header, index) in tableHeader">
        <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :min-width="header.width"
          :fixed="header.fixed"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
        <div v-if="header.prop == 'inStorageNumber'" >
                 <el-input-number
              v-model.trim="scope.row.inStorageNumber"
              style="width:150px;"
              :min="1"
              step-strictly
            ></el-input-number>
              </div>
             <div v-else>{{scope.row[header.prop]}}</div>
         </template>
        </el-table-column>
      </template>
    </el-table>
    <el-form label-width="140px" :model="editForm" :rules="rules" ref="editForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请单号：" prop="applicationForm">
            <el-input
              v-model="editForm.applicationForm"
              maxlength="50"
              placeholder="(非报关/报关)"
              style="width: 100%;"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="业务单证编号：" prop="businessSheet">
            <el-input v-model="editForm.businessSheet" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="数量：" prop="initialNumber">
            <el-input-number
              v-model.trim="editForm.initialNumber"
              style="width:150px;"
              maxlength="19"
              :min="1"
              :max="maxCount"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出入库单号：" prop="cargoMovingCode">
            <el-input v-model="editForm.cargoMovingCode" maxlength="50" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金二核注清单号:" prop="entryId">
            <el-input v-model="editForm.entryId" maxlength="18" placeholder style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row></el-row>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="confirm('editForm')">确 认</el-button>
        <el-button type="default" size="small" @click="closeDialog('editForm')">取 消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import Api from "@/api/index";

export default {
  name: "NoBondedStorageIn",
  components: {},
  props: {
    goodsInfo: {
      type: Array
    },
    isShowDialog: {
      type: Boolean
    }
  },
  data: function() {
    return {
      tableHeader: [
        {
          prop: "name",
          label: "商品名称",
          width: "120",
          show: true
        },

        {
          prop: "initialNumber",
          label: "数量",
          width: "120",
          show: true
        },
        {
          prop: "materialCode",
          label: "料号",
          width: "120",
          fixed: "left",
          show: true
        },
        {
          prop: "inStorageNumber",
          label: "入库数量",
          width: "120",
          show: true
        },
      ],
     
      editForm: {
        cargoMovingCode: "",
        applicationForm: "",
        entryId: "",
        businessSheet: ""
      },
      rules: {
        cargoMovingCode: [
          { required: true, message: "请输入出入库单号", trigger: "blur" }
        ],
        applicationForm: [
          { required: true, message: "请输入申请单号", trigger: "blur" }
        ],
        entryId: [{ required: true, message: "请输入金二核注清单号", trigger: "blur" }],
        
      }
    };
  },
  computed: {},
  mounted() {
   
  },
  methods: {
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总数';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
           
            this.maxCount = sums[index]
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
    handleGoodsCount(){
       const goodsInfo  = JSON.parse(JSON.stringify(this.goodsInfo))
       const editForm = this.editForm
       goodsInfo.map(item=>{
          delete item.attached
          item.cargoMovingCode=editForm.cargoMovingCode
          item.applicationForm=editForm.applicationForm
          item.entryId=editForm.entryId
          item.businessSheet=editForm.businessSheet
          if(item.inStorageNumber){
              item.initialNumber = item.inStorageNumber
          }
          return item;
       })
       return goodsInfo
    },
    /**
     * 提交
     */
    confirm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this.handleGoodsCount();
          Api.WarehousingNotBonded(params).then(res => {
             this.$notify.success({
                  title: "提示",
                  message: "入库提交成功"
                });
               this.$emit('changeDialog')
            });
        } else {
          return false;
        }
      });
    },
  
    /**
     * 关闭浮窗
     */
    closeDialog: function(formName) {
      this.$emit("closeDialog");
    }
  }
};
</script>

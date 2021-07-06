<template>
  <div class="pd20">
    <el-form class="pd20" label-width="140px" :model="editForm" :rules="rules" ref="editForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户名称：" prop="customerName">
            <el-select
              filterable
              clearable
              remote
              :remote-method="getCustomerList"
              v-model="editForm.customerName"
              placeholder="请选择客户"
              style="width: 100%;"
            >
              <el-option
                v-for="(item,index) in customerList"
                @click.native="handleSelectedCustomer(item)"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户需求：" prop="customerDemand">
            <el-input v-model.trim="editForm.customerDemand" :maxlength="11" placeholder="请输入客户电话"></el-input>
          </el-form-item>
           <el-form-item label="执行方式：" prop="executionMode">
            <el-select
              filterable
              clearable
              v-model="editForm.executionMode"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="(item,index) in executionModeList"
                :key="index"
                :label="item.cnInfo"
                :value="item.intValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动时间：" prop="visitDate">
            <el-date-picker v-model="editForm.visitDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="沟通情况：" prop="departmentName">
            <el-input
              v-model.trim="editForm.departmentName"
              :maxlength="30"
              placeholder="初次见面，沟通简述"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目体量：">
            <el-input v-model="editForm.cost" maxlength="10">
              <template slot="prepend">￥</template>
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="内部对接人：" prop="personName">
            <el-select
              filterable
              clearable
              remote
              :remote-method="getCustomerList"
              v-model="editForm.personName"
              placeholder="可搜索，默认关联所有人员"
              style="width: 100%;"
              class="ml10"
            >
              <el-option
                v-for="(item,index) in customerList"
                @click.native="handleSelectedCustomer(item)"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          
        </el-col>
      </el-row>
      <el-form-item label="项目具体需求：" prop="description">
        <el-input
          v-model.trim="editForm.description"
          type="textarea"
          :maxlength="500"
          show-word-limit
          placeholder="情况简述"
        ></el-input>
      </el-form-item>
      <el-form-item label="汇报简述：" prop="description">
        <el-input
          v-model.trim="editForm.description"
          type="textarea"
          :maxlength="500"
          show-word-limit
          placeholder="情况简述"
        ></el-input>
      </el-form-item>
      <el-form-item label="跨部门审批：">
        <el-radio-group v-model="radio2">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是
            <el-select
              filterable
              clearable
              remote
              :remote-method="getCustomerList"
              v-model="editForm.personName"
              placeholder="可搜索，默认关联所有人员"
              style="width: 100%;"
              class="ml10"
            >
              <el-option
                v-for="(item,index) in customerList"
                @click.native="handleSelectedCustomer(item)"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="tar">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm('editForm')">确认</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import Api from "@/api/index";
import ValidForm from "@/utils/ValidForm"
export default {
  computed:{
    executionModeList(){
      return [
        {
          intValue:0,
          cnInfo:'公开竞标'
        }
      ]
    },
  },
  data: function() {
    return {
      editForm: {
        departmentName:'',
        positionName:'',
        visitDate:null,
        cost:null,
        customerName: "",
        customerId: "",
        mobile:'',
        description:'',

      },
      customerList: [], //客户列表
      rules: {
        departmentName: [
          { required: true, message: "请输入客户所属部门", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" }
        ],
        positionName: [
          { required: true, message: "请输入客户岗位", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          // { pattern: ValidForm.mobileReg, message: "请输入正确的手机号" }
        ],

        visitDate: [
          {
            required: true,
            message: "请选择拜访日期",
            trigger: ["change", "blur"]
          }
        ],
        description: [
          { required: true, message: "请输入情况简述", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    this.getCustomerList();
  },
  methods: {
    getCustomerList(query = "") {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        const params = {
          pageNum: 1,
          pageSize: 10,
          name: query
        };
        Api.customerList(params).then(res => {
          this.customerList = res.records;
        });
      }, 200);
    },
    handleSelectedCustomer(item) {
      console.log(item,'customer')
      this.editForm.customerId = item.id;
      this.editForm.mobile = item.tel;
    },
    cancel() {
      const curPath = this.$route.curPath
      let path = ''
      if(curPath==='/router/addCustomerVisits'){
        path = "/router/customerVisits"
      }else if(curPath==='/router/addMarketDepartment'){
        path = "/router/marketDepartment"
      }
      this.$router.push({
          path: path
        });
    },
    /**
     * 确认保存 ： 新增或编辑
     */
    confirm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const editForm = this.editForm;

          let fn = editForm.id ? "updateUser" : "insertUser";

          Api[fn](editForm)
            .then(res => {
              if (res) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `人员【${editForm.customerName}】添加成功`
                });
                this.cancel();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `人员【${editForm.customerName}】添加失败`
                });
              }
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    }
  }
};
</script>

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
          <el-form-item label="客户电话：" prop="mobile">
            <el-input v-model.trim="editForm.mobile" :maxlength="11" placeholder="请输入客户电话"></el-input>
          </el-form-item>
          <el-form-item label="拜访日期：" prop="visitDate">
            <el-date-picker v-model="editForm.visitDate" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户部门：" prop="departmentName">
            <el-input
              v-model.trim="editForm.departmentName"
              :maxlength="30"
              placeholder="请输入客户所属部门"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户职位：" prop="positionName">
            <el-input v-model.trim="editForm.positionName" :maxlength="30" placeholder="请输入客户职位"></el-input>
          </el-form-item>
          <el-form-item label="费用申请：">
            <el-input v-model="editForm.cost" maxlength="10">
              <template slot="prepend">￥</template>
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="情况简述：" prop="description">
        <el-input
          v-model.trim="editForm.description"
          type="textarea"
          :maxlength="200"
          show-word-limit
          placeholder="情况简述"
        ></el-input>
      </el-form-item>
      <el-form-item label="跨部门审批：">
        <el-radio-group v-model="radio2">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">
            是
            <el-select
              filterable
              clearable
              remote
              :remote-method="getCustomerList"
              v-model="editForm.customerName"
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
          { required: true, message: "请输入客户职位", trigger: "blur" }
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
      this.$router.push({
        path: "/router/customerVisits"
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

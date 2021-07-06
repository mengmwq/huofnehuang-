<template>
  <el-dialog
   title="移库" :visible.sync="isShowDialog"
             :close-on-click-modal="canClick"
             :before-close="closeDialog" width="40%">
    <el-form
      label-width="100px"
      :model="editForm"
      :rules="rules"
      ref="editForm"
      class="demo-form-inline"
      @click.native="isShowTree=false"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称：">{{operateStock.projectName}}</el-form-item>
        </el-col>
      </el-row>

      <!--<el-form-item label="移出时间：">-->
        <!--<el-date-picker v-model="editForm.moveDate" type="datetime" placeholder="选择日期"></el-date-picker>-->
      <!--</el-form-item>-->

      <el-form-item label="原库位：">
          {{operateStock.warehouseName}} - {{operateStock.houseName}} - {{operateStock.cabinetName}} - {{operateStock.grideName}}
      </el-form-item>
      <el-form-item label="新仓库位置">
        <el-select v-model="editForm.kuId" clearable placeholder="请选择库" size="medium" style="width: 110px;" >
          <el-option v-for="(item, index) in kuList" :key="index" :label="item.name" :value="item.id" @click.native="selectKu(item)">
          </el-option>
        </el-select>
        <el-select v-model="editForm.cangId" clearable placeholder="请选择仓" size="medium" style="width: 110px;">
          <el-option v-for="(item, index) in cangList" :key="index" :label="item.name" :value="item.id" @click.native="selectCang(item)">
          </el-option>
        </el-select>
        <el-select  v-model="editForm.guiId" clearable placeholder="请选择柜" size="medium" style="width: 110px;">
          <el-option v-for="(item, index) in guiList" :key="index" :label="item.name" :value="item.id" @click.native="selectGui(item)">
          </el-option>
        </el-select>
        <el-select v-model="editForm.grideIdAfter" clearable placeholder="请选择位" size="medium" style="width: 110px;">
          <el-option v-for="(item, index) in weiList" :key="index" :label="item.name" :value="item.id"
                      @click.native="selectWei(item)">
          </el-option>
        </el-select>
        <el-row>
          <el-col :span="4" >
            <p>仓位信息：</p>
          </el-col>
          <el-col :span="20">
            <p v-if="stockInfos">仓位名称：[{{stockInfos.name}}] &nbsp;&nbsp;&nbsp;   尺寸：[{{stockInfos.length}} x {{stockInfos.wide}} x {{stockInfos.high}}]</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model.trim="editForm.remarks" :rows="3" show-word-limit maxlength="300" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" size="small" @click="closeDialog">取 消</el-button>
      <el-button type="primary" size="small" @click="confirm('editForm')">确 认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Api from "@/api/index";
import ValidForm from "@/utils/ValidForm";

export default {
  name: "StorageMove",
  components: {},
  data: function() {
    return {
      canClick: false,
      dialogVisible: false,
      stockInfos: '',
      editForm: {
        stockId: ''
      },
      operateStock: {},
      kuList: [],
      cangList: [],
      guiList: [],
      weiList: [],
      rules: {
      }
    };
  },
  props: {
    isShowDialog: Boolean,
    stockInfo: Object
  },
  watch: {
    stockInfo: function (item) {
      this.editForm.stockId = item.id
      this.operateStock = item
    }
  },
  computed: {},
  mounted() {
    // 库列表
    Api.selectWarehouseInfoList({}).then((res) => {
      if (res) {
        this.kuList = res
      }
    })
  },
  methods: {
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Api.changeGride(this.editForm).then((res) => {
            if (res) {
              this.$notify.success({
                title: '提示',
                message: '移库成功'
              })
              //this.$router.push({path: '/router/storage'})
              this.$emit('closeDialog')
            }
          })

        } else {
          return false;
        }
      });
    },

    /**
     * 点击库加载仓列表
     * */
    selectKu (item) {
      this.stockInfos = item
      this.$set(item, 'kuName', item.name)
      Api.queryHouseInfoListByWarehouseId({
        id: item.id,
        code: item.code
      }).then((res) => {
        if (res) {
          this.cangList = res
        }
      })
    },
    /**
     * 点击仓加载柜列表
     * */
    selectCang (item) {
      this.stockInfos = item
      this.$set(item, 'cangName', item.name)
      Api.queryCabinetInfoListByHouseId({
        id: item.id,
        code: item.code
      }).then((res) => {
        if (res) {
          this.guiList = res
        }
      })

    },
    /**
     * 点击柜加载位列表
     * */
    selectGui (item) {
      this.stockInfos = item
      this.$set(item, 'guiName', item.name)
      Api.queryEmptyGrideListByCabinetId({
        id: item.id,
        code: item.code
      }).then((res) => {
        if (res) {
          this.weiList = res
        }
      })
    },
    /**
     * 点击位加载位信息
     * */
    selectWei (item) {
      this.stockInfos = item
      this.$set(item, 'weiName', item.name)
    },

    /**
     * 关闭浮窗
     */
    closeDialog: function() {
      this.$emit("closeDialog", false);
    }
  }
};
</script>

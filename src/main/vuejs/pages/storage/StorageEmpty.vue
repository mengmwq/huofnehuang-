<template>
  <el-dialog
   title="可用位置" :visible.sync="isShowDialog"
             :close-on-click-modal="canClick"
             :before-close="closeDialog" width="70%">
      <el-row>
          <el-col :span="16">
            <el-select v-model="warehouseId" clearable placeholder="请选择库" size="medium" style="width: 110px;" >
              <el-option v-for="(item, index) in kuList" :key="index" :label="item.name" :value="item.id" @click.native="selectKu(item)">
              </el-option>
            </el-select>
            <el-select v-model="houseId" clearable placeholder="请选择仓" size="medium" style="width: 110px;">
              <el-option v-for="(item, index) in cangList" :key="index" :label="item.name" :value="item.id" @click.native="selectCang(item)">
              </el-option>
            </el-select>
            <el-select v-model="cabinetId" clearable placeholder="请选择柜" size="medium" style="width: 110px;">
              <el-option v-for="(item, index) in guiList" :key="index" :label="item.name" :value="item.id" @click.native="selectGui(item)">
              </el-option>
            </el-select>
            <el-select v-model="grideId" clearable placeholder="请选择位" size="medium" style="width: 110px;">
              <el-option v-for="(item, index) in weiList" :key="index" :label="item.name" :value="item.id"
                         @click.native="selectWei(item)">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
                <el-alert
                title="【红色区块】代表不可用位置"
                type="error"
                close-text="知道了">
            </el-alert>
          </el-col>
      </el-row>


    <span></span>
    <el-row class="mt20" :gutter="20">
         <el-col :span="8" >
                <div class="border">
                    <h3 class="tac"><strong>{{stockName}}</strong></h3>
                    <el-row>
                        <el-col :span="8" v-for="(item,index) in storeList" :key="index" :class="item.status === '2' ? 'error' : ''">
                            <div class="locationItem" :class="{'bg-gray':item.delFlag=='0','bg-green':item.delFlag=='1','border-left-none':index%3==0}">{{item.name}}</div>
                        </el-col>
                    </el-row>
                </div>
         </el-col>
    </el-row>
    <!--<el-row type="flex" class="mt20"  justify="center">
        <el-pagination
        background
        layout="prev, pager, next"
        :total="2">
        </el-pagination>
    </el-row>-->
  </el-dialog>
</template>
<script>
import Api from "@/api/index";

export default {
  name: "StorageEmpty",
  components: {},
  props: ["isShowDialog"],
  data: function() {
    return {
      canClick: false,
      warehouseId: '',
      houseId: '',
      cabinetId: '',
      grideId: '',
      kuList: [],
      cangList: [],
      guiList: [],
      weiList: [],
      stockName: '',


      storageList:[],  //仓库
      storagePositionList:[], //仓位
      storeList:[]
    }
  },
  computed: {},
  mounted() {
    // 库列表
    Api.selectWarehouseInfoList({}).then((res) => {
      if (res) {
        this.kuList = res
        this.storeList = res
      }
    })
  },
  methods: {
    /**
     * 点击库加载仓列表
     * */
    selectKu (item) {
      // alert(1)
      this.stockName = item.name
      Api.queryHouseInfoListByWarehouseId({
        id: item.id,
        code: item.code
      }).then((res) => {
        if (res) {
          this.cangList = res
          this.storeList = res
        }
      })

    },
    /**
     * 点击仓加载柜列表
     * */
    selectCang (item) {
      this.stockName = item.name
      Api.queryCabinetInfoListByHouseId({
        id: item.id,
        code: item.code
      }).then((res) => {
        if (res) {
          this.guiList = res
          this.storeList = res
        }
      })

    },
    /**
     * 点击柜加载位列表
     * */
    selectGui (item) {
      this.stockName = item.name
      Api.queryAllGrideListByCabinetId({
        id: item.id,
        code: item.code
      }).then((res) => {
        if (res) {
          this.weiList = res
          this.storeList = res
        }
      })


    },
    /**
     * 点击位加载位信息
     * */
    selectWei (item) {

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
<style lang="scss">
.locationItem {
    text-align:center;
    border-left:1px solid #ccc;
    border-top:1px solid #ccc;
    border-collapse: collapse;
    padding:5px;
}
.border-left-none {
    border-left:none;
}
  .error{
    background-color: #fef0f0;
    color: #F56C6C;
  }
</style>


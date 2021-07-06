<template>
  <div>
    <el-row class="sub-header m10" >
      <el-col :span="4" class="sub-title">包装箱信息</el-col>
      <el-col :span="20" class="text-right" v-if="operateFlag === 'pro-add' || operateFlag === 'pro-detail-edit'">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="packDialogVisible = true;operate='add'" v-if="stateId!='045'">新增包装箱</el-button>
      </el-col>
      <el-col :span="20" class="text-right" v-if="operateFlag === 'stock-in'">
          <template v-if="isStockIn">
            <el-select filterable v-model="stockInForm.warehouseId" clearable placeholder="请选择库" size="medium" style="width: 140px;" >
              <el-option v-for="(item, index) in kuList" :key="index" :label="item.name" :value="item.id" @click.native="selectKu(item)">
              </el-option>
            </el-select>   
            <el-select filterable v-model="stockInForm.houseId" clearable placeholder="请选择仓" size="medium" style="width: 140px;">
              <el-option v-for="(item, index) in cangList" :key="index" :label="item.name" :value="item.id" @click.native="selectCang(item)">
              </el-option>
            </el-select>
            <el-select filterable v-model="stockInForm.cabinetId" clearable placeholder="请选择柜" size="medium" style="width: 140px;">
              <el-option v-for="(item, index) in guiList" :key="index" :label="item.name" :value="item.id" @click.native="selectGui(item)">
              </el-option>
            </el-select>
            <el-select filterable v-model="stockInForm.grideId" clearable placeholder="请选择位" size="medium" style="width: 140px;">
              <el-option v-for="(item, index) in weiList" :key="index" :label="item.name" :value="item.id"
                        :disabled="item.disabled" @click.native="selectWei(item)">
              </el-option>
            </el-select>
            <el-button type="primary" size="small" @click="saveStockIn">确认</el-button>
            <el-button type="default" size="small" @click="cancelStockIn">取消</el-button>
          </template>
           <el-button v-else type="primary" size="small" @click="stockIn">入库</el-button>
      </el-col>
    </el-row>
    <el-table ref="multipleTable" :data="packagingInfos" show-summary :summary-method="getSummaries"  max-height="400" style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" v-if="operateFlag === 'stock-in'">
        <!-- <template slot-scope="scope">
           <el-checkbox :label="scope.row"></el-checkbox>
        </template> -->
      </el-table-column>
      <el-table-column prop="packageBoxSn" label="包装箱号"></el-table-column>
      <el-table-column prop="insidePackageCount" label="箱内件数"></el-table-column>
      <el-table-column prop="weight" label="毛重(kg)" width="120"></el-table-column>
      <el-table-column prop="billingWeight" label="计费重量"></el-table-column>
      <el-table-column prop="volumeWeight" label="体积重量"></el-table-column>
      <el-table-column prop="packageType" label="包装类型">
        <template slot-scope="scope">
          {{scope.row.packageType | packagingTypeFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" width="220" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="入库位置" width="500" v-if="operateFlag === 'stock-in'">
        <template slot-scope="scope">
          <el-select filterable v-model="scope.row.warehouseId" clearable placeholder="请选择库" size="medium" style="width: 100px;" >
            <el-option v-for="(item, index) in kuList" :key="index" :label="item.name" :value="item.id" @click.native="selectKu(item)">
            </el-option>
          </el-select>
          <el-select filterable v-model="scope.row.houseId" clearable placeholder="请选择仓" size="medium" style="width: 100px;">
            <el-option v-for="(item, index) in cangList" :key="index" :label="item.name" :value="item.id" @click.native="selectCang(item)">
            </el-option>
          </el-select>
          <el-select filterable v-model="scope.row.cabinetId" clearable placeholder="请选择柜" size="medium" style="width: 100px;">
            <el-option v-for="(item, index) in guiList" :key="index" :label="item.name" :value="item.id" @click.native="selectGui(item)">
            </el-option>
          </el-select>
          <el-select filterable v-model="scope.row.grideId" clearable placeholder="请选择位" size="medium" style="width: 100px;">
            <el-option v-for="(item, index) in weiList" :key="index" :label="item.name" :value="item.id"
                       :disabled="item.disabled" @click.native="selectWei(item)">
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="入库位置" width="400" v-if="operateFlag === 'stock-in'|| operateFlag === 'stock-in-record'">
        <template slot-scope="scope">
          {{scope.row.warehouseName}}-->{{scope.row.houseName}}-->{{scope.row.cabinetName}}-->{{scope.row.grideName}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" :width="160"  v-if="operateFlag === 'pro-add' || operateFlag === 'pro-detail-edit'">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
          <el-button type="primary" size="small" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增包装信息-->
    <el-dialog
      :title="operate==='edit'? '编辑包装箱':'新增包装信息'"
      :visible.sync="packDialogVisible"
      :close-on-click-modal="canClick"
      @close="clearForm"
      size="tiny" top="12vh" width="50%">
      <div>
        <el-form :model="packageForm" ref="packageForm" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="包装箱号:" prop="packageBoxSn">
                <el-input v-model="packageForm.packageBoxSn"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="箱内件数:" prop="insidePackageCount">
                <el-input v-model="packageForm.insidePackageCount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="数量:" prop="count">
                <el-input v-model="packageForm.count"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="包装类型:">
                <el-select v-model="packageForm.packageType" clearable placeholder="请选择包装类型" size="medium" style="width:100%">
                  <el-option v-for="(item, index) in packageTypes"
                             :key="index"
                             :label="item.cnInfo"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="毛重（KG）:" prop="weight">
                <el-input v-model="packageForm.weight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            
          </el-row> -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="体积重量:" prop="volumeWeight">
                <el-input style="width: 100px;" placeholder="长" v-model="packageForm.length" @blur="calcVolumeWeight()"></el-input> x
                <el-input style="width: 100px;" placeholder="宽" v-model="packageForm.width" @blur="calcVolumeWeight()"></el-input> x
                <el-input style="width: 100px;" placeholder="高" v-model="packageForm.height" @blur="calcVolumeWeight()"></el-input> / 6000 =
                <el-input style="width: 100px;" placeholder="计算数据" disabled v-model="packageForm.volumeWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="计费重量(KG):" prop="billingWeight">
                <el-input placeholder="不输入的时候自动保存计算的数据" v-model="packageForm.billingWeight"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" prop="remarks">
                <el-input v-model="packageForm.remarks" type="textarea" :rows="2" maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="text-center" style="margin-top: 20px">
            <el-button type="primary" size="small" @click="cancelAddPackage('packageForm')">取 消</el-button>
            <el-button type="primary" size="small" @click="addPackage('packageForm')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Api from '@/api/index'
    import ValidForm from '@/utils/ValidForm'
    export default {
        name: 'AddPackage',
        data () {
          return {
            canClick: false,
            query: {
              isSelf: '0', // 0：外来箱1：自有箱
              isBudget: '0', // 0 否 1是
              pageNum: 1,
              pageSize: 500
            },
            //stateId:'',
            operate: '',
            currentIndex: 0,
            sels:[],
            isStockIn:false,
            //入库操作 
            stockInForm:{
              warehouseId:null,
              warehouseName:null,
              houseId:null, 
              houseName:null, 
              cabinetId:null,  
              cabinetName:null,  
              grideId:null,
              grideName:null,
            },
            stockInfo: {},
            total: 0,
            proCode: '',
            // 包装信息参数
            packageForm: {
              packageBoxSn: '',
              insidePackageCount: '',
              count: '',
              weight: '',
              length: '',
              width: '',
              height: '',
              volumeWeight: '',
              billingWeight: '',
              remarks: ''
            },
            packDialogVisible: false,
            // 包装类型
            packageTypes: [],
            // 包装列表数据
            packagingInfos: [],
            rules: {
              'packageBoxSn': [
                { required: true, message: '请填写包装箱号', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9]{1,23}$/, message: '请输入数字或者字母' },
              ],
              'insidePackageCount': [
                { required: false, message: '' ,trigger: 'blur' },
                { pattern: /^[0-9]{1,}$/, message: '请输入数字类型' },
              ],
              'count': [
                { required: false, message: '' ,trigger: 'blur' },
                { pattern: /^[0-9]{1,}$/, message: '请输入数字类型' },
              ],
              'weight': [
                { required: true, message: '请输入毛重' ,trigger: 'blur' },
                { pattern:ValidForm.floatNumReg, message: '请正确输入毛重（小数点保留2位）!' },
              ],
              'billingWeight': [
                { required: false, message: '' ,trigger: 'blur' },
                { pattern: ValidForm.floatNumReg, message: '请正确输入计费重量（小数点保留2位）!' },
              ],
              volumeWeight: [
                { required: true, message: '请输入尺寸', trigger: 'blur' }
              ],
              remarks: [
                { required: false, message: '', trigger: 'blur' }
              ]
            },
            kuList: [],
            cangList: [],
            guiList: [],
            weiList: [],
            selectedWeiList: []
          }
        },
        props: {
          packagingInfoReqs: Array,
          operateFlag: String,
          projectCode: String,
          stateId: String
        },
        watch: {
          packagingInfoReqs: function (newValue) {
            this.packagingInfos = newValue
          },
          projectCode: function (newValue) {
            this.proCode = newValue
            if (this.proCode) {
              if (this.operateFlag === 'pro-detail-edit') {
                this.loadPackageList()
              }
            }
          },
          stateId:function(value){
          	this.stateId=value
          },
          packagingInfos: function (newValue) {
            if (this.operateFlag !== 'pro-detail-edit') {
              this.$emit('update:packagingInfoReqs', newValue)
            }
          },
          stockInfo: function (newValue) {
            this.$emit('update:stockInfos', newValue)

          },
          operateFlag: function (value) {
            if (value === 'stock-in') {
              this.loadStockInfo()
            }
          }
        },
        mounted () {
          // 获取字典信息
          if (sessionStorage.getItem('dists')) {
            let distsObj = JSON.parse(sessionStorage.getItem('dists'))
            if (distsObj.PackageType) {
              this.packageTypes = distsObj.PackageType.children
            }
          }
          this.loadStockInfo()
        },
        methods: {
          getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计：';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value)) && (column.property =='weight' || column.property =='billingWeight' || column.property =='volumeWeight')){
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                    sums[index] = sums[index].toFixed(2)
                } else {
                    sums[index] = '';
                }
                });

                return sums;
            },
          handleSelectionChange (val) {
          this.sels = val
        },
          saveStockIn(){
              let selected  = this.sels;
              let stockInForm = this.stockInForm
              if(!stockInForm.warehouseId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择库信息！'
                })
                return;
              }
              if(!stockInForm.houseId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择仓信息！'
                })
                return;
              }
              if(!stockInForm.cabinetId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择柜信息！'
                })
                return;
              }
              if(!stockInForm.grideId){
                   this.$notify.warning({
                  title: '提示',
                  message: '请选择位信息！'
                })
                return;
              }
              //已选中的ID
              //const aSelectedId = selected.map(item=>item.id)
             
              this.packagingInfos.map(sItem=>{
                
                if(selected.some(item=>item.id===sItem.id)){
                      sItem.warehouseId = stockInForm.warehouseId
                      sItem.warehouseName = stockInForm.warehouseName
                      sItem.houseId = stockInForm.houseId
                      sItem.houseName = stockInForm.houseName
                      sItem.cabinetId = stockInForm.cabinetId
                      sItem.cabinetName = stockInForm.cabinetName
                      sItem.grideId = stockInForm.grideId
                      sItem.grideName = stockInForm.grideName
                      return sItem;
                  }
                 
            })
             this.cancelStockIn()
             
              
          },
          
          cancelStockIn(){
            this.isStockIn = false
            this.$refs.multipleTable.clearSelection();
            this.clearStockIn()
          },
          //入库操作
          stockIn(){
              const selected = this.sels
              if(selected.length==0){
                 this.$notify.warning({
                  title: '提示',
                  message: '请至少 选择一条入库记录！'
                })
                  return ;
              }
              const stockIned = selected.some(item=>item.grideId)
              if(stockIned){
                 this.$notify.warning({
                  title: '提示',
                  message: '选中的记录中包含已入库信息！'
                })
                  return ;
              }
              this.isStockIn = true
          },
          //清除入库FORM
          clearStockIn(){
            this.stockInForm={
              warehouseId:null,
              houseId:null, 
              cabinetId:null,  
              grideId:null,
            }
          },
          clearForm () {
            this.packageForm =  {
              packageBoxSn: '',
                insidePackageCount: '',
                count: '',
                weight: '',
                length: '',
                width: '',
                height: '',
                volumeWeight: '',
                billingWeight: '',
                remarks: ''
            }
          },
          /**
           * 正整数校验
           * */
          checkNum (value) {
            var reg = /^[1-9]\d*$/;
            return reg.test(value)
          },
          calcVolumeWeight () {
            if (this.packageForm.length) {
              if (!this.checkNum(this.packageForm.length)) {
                this.$notify.warning({
                  title: '提示',
                  message: '长度请输入正整数'
                })
                return
              }
            }
            if (this.packageForm.width) {
              if (!this.checkNum(this.packageForm.width)) {
                this.$notify.warning({
                  title: '提示',
                  message: '宽度请输入正整数'
                })
                return
              }
            }
            if (this.packageForm.height) {
              if (!this.checkNum(this.packageForm.height)) {
                this.$notify.warning({
                  title: '提示',
                  message: '高度请输入正整数'
                })
                return
              }
            }
            if (this.packageForm.length && this.packageForm.width && this.packageForm.height) {
              // 体积重量
              let value = parseInt(this.packageForm.length) * parseInt(this.packageForm.width) * parseInt(this.packageForm.height)
              this.packageForm.volumeWeight = Math.ceil( value/ 6000)
            }
          },
          /**
           * 包装信息列表
           * */
          loadPackageList () {
            this.query.projectCode = this.proCode
            Api.packageList(this.query).then((res) => {
              if (res) {
                this.packagingInfos = res.records
                this.total = res.total
              }
            })
          },
          /**
           * 添加包装箱信息
           * */
          addPackage (formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                /**
                               * 判断添加的包装箱号是否已经添加过了
                 * */
                if (this.operate === 'add') {
                  if (this.packagingInfos.length > 1) {
                    let _this = this
                    let flag = false
                    let paskSn = ''
                    for (let i = 0; i < this.packagingInfos.length; i++) {
                      let item = this.packagingInfos[i]
                      if (item.packageBoxSn == _this.packageForm.packageBoxSn) {
                        flag = true
                        paskSn = item.packageBoxSn
                        break
                      }
                    }
                    if (flag) {
                      this.$notify.warning({
                        title: '提示',
                        message: '您已经添加了箱号为【' + paskSn +  '】的包装箱数据，不能重复添加'
                      })
                      return
                    }
                  }
                }

                if (!this.packageForm.length) {
                  this.$notify.warning({
                    title: '提示',
                    message: '请输入长度'
                  })
                  return
                }
                if (!this.packageForm.width) {
                  this.$notify.warning({
                    title: '提示',
                    message: '请输入宽度'
                  })
                  return
                }
                if (!this.packageForm.height) {
                  this.$notify.warning({
                    title: '提示',
                    message: '请输入高度'
                  })
                  return
                }
                if (this.packageForm.length && this.packageForm.width && this.packageForm.height) {
                  // 体积重量
                    let value = parseInt(this.packageForm.length) * parseInt(this.packageForm.width) * parseInt(this.packageForm.height)
                    this.packageForm.volumeWeight = Math.ceil( value/ 6000)

                }
                // 如果计费重量不填写，则计费重量保存体积重量的值
                if (!this.packageForm.billingWeight) {
                  if (this.packageForm.weight) {
                    if (!this.packageForm.volumeWeight) {
                      this.packageForm.billingWeight = this.packageForm.weight
                    } else {
                      if (parseFloat(this.packageForm.weight) > parseFloat(this.packageForm.volumeWeight)) {
                        this.packageForm.billingWeight = this.packageForm.weight
                      } else {
                        this.packageForm.billingWeight = this.packageForm.volumeWeight
                      }
                    }
                  } else {
                    if (this.packageForm.volumeWeight) {
                      this.packageForm.billingWeight = this.packageForm.volumeWeight
                    }
                  }
                }
                this.packageForm.billingWeight = Math.ceil(parseInt(this.packageForm.billingWeight))
                // 项目详情页面进入进来，添加的时候要调接口添加
                if (this.operateFlag === 'pro-detail-edit') {
                  if ( this.operate === 'add') {
	                  this.packageForm.projectCode = this.proCode
	                  Api.addPackage(this.packageForm).then((res) => {
	                    if (res) {
	                      this.$notify.success({
	                        title: '提示',
	                        message: '添加成功'
	                      })
	                      this.packDialogVisible = false
	                      this.loadPackageList()
	                    }
	                  })
                  }else{
                    this.packageForm.projectCode = this.proCode
	                Api.updatePackage(this.packageForm).then((res) => {
	                  if (res) {
	                    this.$notify.success({
	                      title: '提示',
	                      message: '修改成功'
	                    })
	                    this.packDialogVisible = false
	                    this.loadPackageList()
	                  }
	                })
                  }
                } else {
                  // 创建项目的时候添加，组装参数
                  if ( this.operate === 'edit') {
                    this.packagingInfos.splice(this.currentIndex, 1)
                    this.packagingInfos.push(this.packageForm)
                  } else {
                    this.packagingInfos.push(this.packageForm)
                  }

                }
                this.packDialogVisible = false
                this.packageForm = {
                  packageBoxSn: '',
                  insidePackageCount: '',
                  count: '',
                  weight: '',
                  length: '',
                  width: '',
                  height: '',
                  volumeWeight: '',
                  billingWeight: '',
                  remarks: ''
                }
              } else {
                return false
              }
            })
          },
          edit (item, index) {
            this.packageForm = item
            this.operate = 'edit'
            this.currentIndex = index
            this.packDialogVisible = true
          },
          /**
           * 删除包装箱数据
           * */
          deleteItem (index, item) {
            // 项目详情页面进入进来，删除的时候要调接口添加
            if (this.operateFlag === 'pro-detail-edit') {
              this.$confirm('您确定要删除【' + item.packageBoxSn + '】吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                Api.deletePackage({id: item.id}).then((res) => {
                  if (res) {
                    this.$notify.success({
                      title: '提示',
                      message: '删除成功'
                    })
                    this.loadPackageList()
                  } else {
                    this.$notify.warning({
                      title: '提示',
                      message: '删除失败'
                    })
                  }
                })
              })
            } else {

              this.$confirm('您确定要删除【' + item.packageBoxSn + '】吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 创建项目的时候删除，相当于删除参数
                this.packagingInfos.splice(index, 1)
              })


            }
          },
          /**
           * 取消添加包装箱
           * */
          cancelAddPackage (formName) {
            if(this.operate!=='edit'){
              this.$refs[formName].resetFields()
            }
            this.packDialogVisible = false
          },
          /**
           * 获取库列表
           * */
          loadStockInfo () {
            // 库列表
            Api.selectWarehouseInfoList({}).then((res) => {
              if (res) {
                this.kuList = res
              }
            })

          },
          /**
           * 点击库加载仓列表
           * */
          selectKu (item) {
            
            this.stockInfo = item
            this.stockInForm.warehouseName = item.name
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
            this.stockInfo = item
            this.stockInForm.houseName = item.name
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
            this.stockInfo = item
            this.stockInForm.cabinetName = item.name
            Api.queryAllGrideListByCabinetId({
            //Api.queryEmptyGrideListByCabinetId({
              id: item.id,
              code: item.code
            }).then((res) => {
              if (res) {
                this.weiList = res
                let _this = this
                let index = 0
                for (let i = 0; i < this.weiList.length; i++) {
                  if ( this.selectedWeiList.length > 0) {
                    for (let j = 0; j < this.selectedWeiList.length; j++) {
                      let item = this.weiList[i]
                      let item1 = this.selectedWeiList[j]
                      if (item.id === item1.id) {
                        index = i
                        break
                      }
                    }
                    _this.$set(this.weiList[index], 'disabled', true)
                  }
                }
              }
            })

          },
          /**
           * 点击位加载位信息
           * */
          selectWei (item) {
            this.stockInForm.grideName = item.name
            this.stockInfo = item
            this.selectedWeiList.push(item)

          },
          handleSizeChange (val) {
            this.query.pageSize = val
            this.loadPackageList()
          },
          handleCurrentChange (val) {
            this.query.pageNum = val
            this.loadPackageList()
          }
        }
    }
</script>

<template>
  <el-dialog
 title="详细资料" :visible.sync="isShowDialog"
           :close-on-click-modal="canClick"
           :before-close = "closeDialog" top="7vh" width="70%">
      <el-tabs type="border-card">
        <!--<el-tab-pane label="基本信息">-->
          <table class="tableProfit" v-if="profit">
          <tr>
              <th>姓名</th>
              <td>{{profit.name?profit.name:''}}</td>
              <td :rowspan="6" :colspan="2" class="pr">
                 <dl class="imgBox">
                     <dt>
                         个人相册
                     </dt>
                     <dd class="imgAlbum">
                       <el-carousel v-if="profit.fileList"  :interval="4000" type="card" height="150px">
                         <el-carousel-item v-for="(url, index) in profit.fileList" :key="index">
                           <img :src="url.url" alt="" width="" height="100%" @click="open(url.url)"/>
                         </el-carousel-item>
                       </el-carousel>

                       <el-carousel v-else :interval="4000" height="150px">
                         <el-carousel-item>
                           <h3>无照片</h3>
                         </el-carousel-item>
                       </el-carousel>

                     </dd>
                 </dl>
              </td>
          </tr>
          <tr>
              <th>性别</th>
              <td>{{getDictsKeyName(profit,'Sex',profit.sex)}}</td>
              <!-- <td>{{profit.attached.Sex?profit.attached.Sex[profit.sex].cnInfo:''}}</td> -->
          </tr>
          <tr>
              <th>出生日期</th>
              <td>{{getFormatTime(profit.birthday)}}</td>
          </tr>
          <tr>
              <th>学历</th>
              <td>{{profit.address}}</td>
          </tr>
          <tr>
              <th>证件类型</th>
              <td>{{getDictsKeyName(profit,'CardType',profit.cardType)}}</td>
          </tr>
          <tr>
              <th>国家/地区</th>
              <td>{{profit.address}}</td>
          </tr>

          <tr>
              <th>邮箱</th>
              <td>{{profit.email}}</td>
              <th>特殊身份</th>
              <td>{{getDictsKeyName(profit,'SpecialType',profit.specialType)}}</td>
              <!-- <td>{{profit.attached.SpecialType?profit.attached.SpecialType[1].cnInfo:''}}</td> -->
          </tr>
          <tr>
              <th>身高</th>
              <td>{{profit.height}}</td>
              <th>信仰</th>
              <td>{{profit.belief}}</td>
          </tr>
          <tr>
              <th>体重</th>
              <td>{{profit.weight}}</td>
              <th>紧急联系人</th>
              <td>{{profit.urgentName}}</td>
          </tr>
          <tr>
              <th>病史</th>
              <td>{{profit.healthHistory}}</td>
              <th>紧急联系电话</th>
              <td>{{profit.urgentMobile}}</td>
          </tr>
          <tr>
              <th>工作单位</th>
              <td>{{profit.workUnit}}</td>
              <th>地址</th>
              <td>{{profit.address}}</td>
          </tr>
          <tr>
              <th>职业</th>
              <td>{{profit.occupation}}</td>
              <th>学员次数</th>
              <td>{{profit.stuCount}}</td>
          </tr>
          <tr>
              <th>职务 </th>
              <td>{{profit.address}}</td>
              <th>义工次数</th>
              <td>{{profit.volCount}}</td>
          </tr>
      </table>

          <el-table class="page-table" :data="records && records.result" stripe highlight-current-row  :cell-style="{color:'#333'}" max-height="260">
            <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable" :min-width="header.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="header.prop == 'createdAt'">
                  {{getFormatTime(scope.row.createdAt)}}
                </div>
                <div v-else-if="header.prop == 'detailType'">
                  {{getDictsKeyName(scope.row,'DetailType',scope.row.detailType)}}
                </div>
                <div v-else-if="header.prop == 'checkStatus'">
                  {{getDictsKeyName(scope.row,'CheckStatus',scope.row.checkStatus)}}
                </div>
                <div v-else>{{scope.row[header.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>

        <el-row type="flex" class="page-box" justify="center">
          <el-pagination
            :total="this.records.totalCount"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :page-size="searchForm.pageSize">
          </el-pagination>
        </el-row>

        <!--</el-tab-pane>-->
        <!--<el-tab-pane label="用户活动信息">-->

        <!--</el-tab-pane>-->
      </el-tabs>

      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="info" class="cancel-btn-big" @click="closeDialog">取消</el-button>-->
        <!--&lt;!&ndash;<el-button type="success" class="confirm-btn-big" @click="confirm('editForm')">确认</el-button>&ndash;&gt;-->
      <!--</div>-->
</el-dialog>
</template>



<script>
  import {Org}  from '@/model/Org'
  import Api from '@/api/index'
  import ValidForm  from '@/utils/ValidForm'
  import Util  from '@/utils/'
  export default {
    name: 'UserAdd',
    components: {},
    props: ['isShowDialog', 'editForm','contacterId'],
    data: function () {
      return {
        canClick: false,
        searchForm:{
          pageNumber:1,
          pageSize:5,
        },
        records:[],
        profit:null,
        isShowTree:false,
        dialogVisible: false,
        defaultProps: {
          children: "childrenOrgs",
          label: "name"
        },
        tableHeader: [{
          prop: 'actTitle',
          label: '活动名称',
          width: '120',
          sortable:true,
          show: true
        }, {
          prop: 'createdAt',
          label: '活动时间',
          width: '100',
          show: true,
          sortable:true,
        },{
          prop: 'detailType',
          label: '身份',
          width: '90',
          show: true,
          sortable:true,
        }, {
          prop: 'checkStatus',
          label: '状态',
          width: '80',
          show: true,
          sortable:true,
        }, {
          prop: 'teamName',
          label: '岗位/班级',
          width: '80',
          show: true,
          sortable:false,
        }, {
          prop: 'remark',
          label: '备注',
          width: '100',
          show: true
        }]
      }
    },
    computed: {
        customerTypeList() {
          return []
          //return this.$store.state.dictionary.dists.UserType.children;
        },
        roleList(){
          return []
          //return this.$store.state.role.roleList;
        },
        orgList(){
          return this.$store.state.organization.allOrganizationInfo;
        }
    },
    mounted () {
      const contacterId = this.contacterId


      /**
       * 根据ContacterId查询用户活动信息
       */
      if(this.editForm.hasCard){
        console.log(this.editForm.hasCard,'hasCard');
        this.getUserActListByContacterId(contacterId)
      }else {
        this.records.pageNumber = this.searchForm.pageNumber;
        this.records.pageSize = this.searchForm.pageSize;
        this.records.totalCount = 0;
      }

      /**
       * 根据ContacterId查询用户基本信息
       */
      this.getUserDetailByContacterId(contacterId)

    },
    methods: {

      open(url) {
        this.$alert('<img src='+url+'  width="100%"/>', '', {
          dangerouslyUseHTMLString: true,
          showConfirmButton:false
        });
      },

      /**
       * 表格分页当前页变动时候触发的事件
       */
      handleCurrentChange(val) {
        const contacterId = this.contacterId
        this.searchForm.pageNumber = val;
        this.getUserActListByContacterId(contacterId)
      },


      /**
     * 通过出生日期获取年龄
     */
    getAgeByBirthday(birthday){
      return Util.getAgeByBirthday(birthday)
    },
      /**
       * 获取日期
       */
      getFormatTime(time){
        return Util.getFormatTime(time,'yyyy-MM-dd')
      },
       /**
       * 获取字典名称
       */
      getDictsKeyName(row,key,val){
        return Util.getDictsKeyName(row,key,val)
      },
      /**
       * 根据ContacterId查询用户活动信息
       */
      getUserActListByContacterId(ContacterId){
          const params = {
            contacterId: ContacterId,
            pageNumber:this.searchForm.pageNumber,
            pageSize:this.searchForm.pageSize
          }
          Api.getUserActListInfoByContacterId(params).then(res=>{
              if(res){
                console.log(res.data,'daa')
                   this.records = res.data
              }
          })
      },
      /**
       * 根据ContacterId查询用户基本信息
       */
      getUserDetailByContacterId(ContacterId){
        const params = {
            contacterId: ContacterId
          }
          Api.getUserDetailByContacterId(params).then(res=>{
              if(res){
                  this.profit = res.data
                  // 相册数据回显 albumRealUrl
                if (this.profit.albumRealUrl) {
                  var fileList = []
                  this.profit.albumRealUrl.split(';').forEach(item => {
                    fileList.push({
                      url: item,
                    })
                  })
                  this.profit.fileList = fileList;
                  console.log(this.profit.fileList);
                }
              }
          })
      },

      handleCheckChange(){

      },
      selectOrg(){
        this.isShowTree = true
        event.stopPropagation();
      },
      getCustomer: function () {
        Api.getCustomer({orgId: this.editRow.id}).then((res) => {
          if (res) {
            this.customerValue = res.data

            console.log('data',res.data)
          }
        })
      },
      /**
       * 确认保存 ： 新增或编辑
       */
      // confirm(formName){
      //     this.$refs[formName].validate((valid) => {
      //       if (valid) {
      //           const editForm  = this.editForm;
      //
      //           let fn = editForm.id ? 'updateUser' : 'insertUser'
      //
      //           Api[fn](editForm).then(res=>{
      //               if(res){
      //                   this.$message({
      //                   showClose: true,
      //                   type: 'success',
      //                   message:`人员【${editForm.name}】添加成功`
      //                 });
      //                 this.closeDialog();
      //               }else{
      //                 this.$message({
      //                   showClose: true,
      //                   type: 'error',
      //                   message:`人员【${editForm.name}】添加失败`
      //                 });
      //               }
      //           }).catch(err=>{
      //           })
      //       } else {
      //       //   this.$message({
      //       //     showClose: true,
      //       //     type: 'error',
      //       //     message:`${this.dialogTitle}验证失败！`
      //       //   });
      //         return false;
      //       }
      //     });
      // },
      /**
       * 关闭浮窗
       */
      closeDialog: function () {
        this.$emit('closeEditDialog', false)
      },




    }
  }




</script>


<style>
  .el-message-box{
    width: 600px;
  }
</style>

<style lang="scss" scoped>
.tableRecord,.tableProfit{
    border-collapse: collapse;
    width:100%;
}
.tableProfit{
    .imgAlbum{
       position: absolute;
       top:0;
       width:94%;
       /*height:150px;*/
       overflow: auto;
    }
    .imgBox{
        height:165px;
        margin:0;
        padding:0;
        dt {
            position: absolute;
            top:0;
            left:0;
            width:20px;
            padding-top:40px;
            height:122px;
            text-align:center;
            border-right:1px solid #eee;
        }
    }
    th {
        text-align: center;
    }

    td,th {
        min-width: 215px;
        height:18px;
        border:1px solid #eee;
        padding:3px;
    }
}
.scrollRecord{
       max-height: 200px;
       overflow: auto;
    }
.tableRecord{
    margin-top:10px;
    th {
      text-align: center;
    }
    td,th {
        border:1px solid #eee;
        padding:3px;

    }

}
.tree-box{
  position: relative;
  .tree-body {
    position: absolute;
    width:100%;
    left:0;
    top:40px;
    border:1px solid #eee;
    z-index: 99

  }

}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

dd {
  display: block;
  margin-inline-start: 21px;
}



</style>

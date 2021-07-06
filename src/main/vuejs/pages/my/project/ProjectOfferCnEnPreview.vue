<template>
   
    <div v-if="form" class="printBg">
        <div class="text-center pd20">
            <img v-if="form.offerExtend.org" :src="'http://cdn.m56.cn/'+form.offerExtend.org+'.png'" alt="">
        </div>
        <!-- <div class="printTitle">
            <div class="left">
                
                 申请日期：{{form.applyDate | DateFormat}}
            </div>
            <div class="center">
                <h2 class="text-center">
                   {{$route.query.targetType | approvalTargetTypeFilter}}
                </h2>
                
            </div>
            <div class="right">
                
                <img width="77" src="http://cdn.m56.cn/qrcode" alt="">
                <span>用钉钉扫码</span>
            </div>
        </div> -->
        <table class="printTable">
            <tbody>
                <tr>
                    <th>致敬</th>
                    <td>
                         {{form.offerExtend.receiver}}
                    </td>
                    <th>项目</th>
                    <td>
                        {{form.projectName}}
                    </td>
                </tr>
                 
                <tr>
                    <th>日期</th>
                    <td>
                       {{form.offerExtend.offerDate | dateFormat}}
                    </td>
                    <th>编号</th>
                    <td>
                        {{form.customName}}
                    </td>
                </tr>
               <tr>
                    <th>报价人</th>
                    <td>
                         {{form.offerExtend.offerPerson}}
                    </td>
                    <th>敬启者</th>
                    <td>
                        {{form.targetId}}
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="printTable">
          <thead>
            <tr class="bgPink">
                <th  style="background:red;">报价明细</th>
                <th>金额（）</th>
            </tr>
          </thead>
        
          <tbody>
              <tr v-for="(item, index) in form.offerDetaileds" :key="index">
                  <th>{{index + 1}}、{{item.cnDetailed}}</th>
                  <td>{{item.quotationAmount}}</td>
              </tr>
              <tr>
                  <th>小计：</th>
                  <td>{{form.total}}</td>
              </tr>
               <tr>
                  <th>税费：</th>
                  <td>{{form.offerExtend.taxFee}}</td>
              </tr>
              <tr>
                  <th align="right">含税合计:</th>
                  <td>{{form.allFee}}</td>
              </tr>
          </tbody>
          <tfoot  class="bgPink">
              <tr>
                  <th>实际成交价格:</th>
                  <td></td>
              </tr>
          </tfoot>
        </table>
       <table class="printTable">
           <tr >
               <td class="bgPink">报价明细内容:</td>
           </tr>
            <tr>
               <td>
                   <div v-html="form.offerExtend.extOfferProject"></div>
               </td>
           </tr>
            <tr>
               <td class="bgPink">额外报价项目:</td>
           </tr>
            <tr>
               <td>
                    <div v-html="form.offerExtend.offerDetailContent"></div>
               </td>
           </tr>
            <tr>
               <td class="bgPink" >备注:</td>
           </tr>
            <tr>
               <td>
                   <div v-html="form.offerExtend.remark"></div>
               </td>
           </tr>
        </table>
        
    </div>
</template>

<script>

import Api from '@/api/index'

export default {
   
    name: "ProjectOfferCnEnPreview",
    // 制作打印模版组件时，props区域尽量保留。
   
    props: {
        // 查询条件
        searchQuery:{
             type: Object,
        },
        form:{
            type:Object,
        },
        lang:{
            type:String,
        },
       targetId:{
           type:String,
       },
        // 每页多少行
        onePageRow: {
            type: Number,
            default: 10
        },
        // 是否插入空白行
        blankLines: {
            type: Boolean,
            default: true
        },

        getChineseNumber: Function // 求数字的中文写法，从easyPrint组件传入
    },
    
    data() {
        return {
           //info:null,
           //form:null,
           listData:[],
           
        };
    },
     watch: {
        info: function (value) {
          this.form = value
          let total = 0
          this.form.offerDetaileds.forEach(function(item){
            total += parseFloat(item.quotationAmount)

          })

          this.form.total = total
          if (this.form.offerExtend.taxFee) {
            this.form.allFee = this.form.offerExtend.taxFee + total
          } else {
            this.form.allFee = total
          }
        }
      },
    mounted(){
        
       
    },

    computed: {
        pages() {
            // 求当前数据能打印的页数
            var pages_ = Math.ceil(
                this.tableData.detail.length / this.onePageRow
            ); // 向上取整数
            return pages_ <= 0 ? 1 : pages_;
        },
        chineseTotal() {
            // 计算中文合计，如果忘记传入
            return this.getChineseNumber != null
                ? this.getChineseNumber(this.tableData.total_amount)
                : "您还没有传入getChineseNumber";
        }
    },

    methods: {
       
    }
};
</script>
<style lang="scss">

.printBg{
    background:red;
}
.printTitle {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .right,.center{
        display: flex;
        flex-direction: column;
    }
}
.printTable,.subTable {
    
    border-collapse: collapse;
    width:100%;
    th,td {
        border:1px solid #ccc;
        padding:5px;
        height:30px;
    }
    .approvalItem {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .left {
            display: flex;
            flex-direction: column; 
        }
    
    }
}
.subTable td {
    text-align: center;
}
.bgPink {
    background:#9C89BB;
}
    
</style>

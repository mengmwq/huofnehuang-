<template>
    <div v-if="tableDetails">
        
        <div class="printTitle">
            <div class="left">
                 <!-- 火凤凰(北京)国际艺术品物流有限公司 -->
                 申请日期：2019-06-27
            </div>
            <div class="center">
                <h2 class="text-center">付款审批</h2>
                
            </div>
            <div class="right">
                <i class="qrcode"></i>
                <span>用钉钉扫码</span>
            </div>
        </div>
        <table class="printTable">
            <tbody>
                <tr>
                    <th>审批编号</th>
                    <td colspan="9">
                        {{tableDetails.targetId}}
                    </td>
                </tr>
                <tr>
                    <th>申请人</th>
                    <td colspan="9">
                        {{tableDetails.targetId}}
                    </td>
                </tr>
                <tr>
                    <th>申请人部门</th>
                    <td colspan="9">
                        {{tableDetails.targetId}}
                    </td>
                </tr>
                <tr>
                    <th>部门</th>
                    <td colspan="9">
                        {{tableDetails.targetId}}
                    </td>
                </tr>
                 <tr>
                    <th>项目编号</th>
                    <td colspan="9">
                        {{tableDetails.projectCode}}
                    </td>
                </tr>
                 <tr>
                    <th>项目负责人</th>
                    <td colspan="9">
                        {{tableDetails.targetId}}
                    </td>
                </tr>
                <tr>
                    <td>序号</td>
                    <td>付款内容</td>
                    <td>公司名称</td>
                    <td>开户银行</td>
                    <td>账号</td>
                    <td>付款金额(元)</td>
                    <td>币种</td>
                    <td>费用类别</td>
                    <td>明细</td>
                    <td>是否已开票</td>
                </tr>
                <tr>
                    <th>合计：</th>
                    <td colspan="9"></td>
                </tr>
                 <tr>
                    <th>图片</th>
                    <td colspan="9"></td>
                </tr>
                 <tr>
                    <th>附件</th>
                    <td colspan="9"></td>
                </tr>
                <tr>
                     <th rowspan="9">审批流程</th>
                </tr>
                 <tr>
                    <td colspan="9">
                        <div class="approvalItem">
                            <div class="left">
                                <div class="reason">
                                    发票审核无误。

                                </div>
                                <div class="approvalPerson">
                                    张冉 已同意 
                                </div>
                            </div>
                            <div class="right">
                                    2019-06-28 16:12:35
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="9"></td>
                </tr>
                <tr>
                    <td colspan="9"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "PaymentPrint",
    // 制作打印模版组件时，props区域尽量保留。
    props: {
        // 查询条件
        searchQuery:{
             type: Object,
        },
        tableDetails:{
            type: Object,
        }, 
        // 接受的打印数据
        tableData: {
            type: Object,
            default() {
                return {
                    id: 998,
                    companyName: "大连合一软件",
                    createDate: "2018年12月27日",
                    currentTime:'2018年',
                    operator:'孙泽龙',
                    grossTonnageTotal:1500,
                    fullDraftTotal:450,
                    detail: [
                        {
                            datetime: "2018-12-10",   // 日期
                            shipName: "瓦格朗",    // 船名
                            shipLength: 188,     // 船长
                            fullDraft: 150,      // 吃水
                            shipType: "大型船舶",   // 船艇类型
                            jobType: "靠泊",   // 作业类型
                            startAddr:'大连',       //起始地
                            endAddr:'美国',        //目的地
                            longTeng:'11',           //龙腾
                            superZone:'11',          //超区
                            nightNavigation:'11',           //夜航
                            nightShift:'1',            //夜班
                            restDay:'12',            //休息日
                            holiday:'12',            //节假日
                            difficultTask:'12',            //困难任务

                        },
                        {
                            datetime: "2018-12-10",   // 日期
                            shipName: "瓦格朗",    // 船名
                            shipLength: 188,     // 船长
                            fullDraft: 150,      // 吃水
                            shipType: "大型船舶",   // 船艇类型
                            jobType: "靠泊",   // 作业类型
                            startAddr:'大连',       //起始地
                            endAddr:'美国',        //目的地
                            longTeng:'11',           //龙腾
                            superZone:'11',          //超区
                            nightNavigation:'11',           //夜航
                            nightShift:'1',            //夜班
                            restDay:'12',            //休息日
                            holiday:'12',            //节假日
                            difficultTask:'12',            //困难任务

                        },
                        
                    ]
                };
            }
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
           
        };
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
.printTitle {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .right,.center{
        display: flex;
        flex-direction: column;
    }
}
.printTable {
    
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

    
</style>

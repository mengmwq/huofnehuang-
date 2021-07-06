<template>
  <div>
    <el-row type="flex" :gutter="20">
      <el-col :span="7">
        <div  class="border">
          <!-- <div class="title">机构树</div> -->
          <div class="orgTree">
            <p class="title">文件架构</p>
            <!--<el-tree
              :data="data2"
              show-checkbox
              node-key="id"
              :props="defaultProps">
              check-change="handleClick"
            </el-tree>-->
            <el-tree
              :data="treeData"
              show-checkbox
              node-key="orgId"
              ref="orgTree"
              :props="{label: 'orgName', children: 'childrens'}"
              :check-strictly="true"
              default-expand-all
              highlight-current
              @check-change="handleClick"
              @node-click="nodeClick">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="17" class="orgCont">
        <el-row :gutter="20" class="m10">
          <el-col :span="4">
            <el-button type="primary" size="medium" v-showBtn data-authorityType="upload-btn" @click="openUploadDialog">+ 上传文件</el-button>
          </el-col>
          <el-col :span="20" class="text-right">

            <el-select v-model="query.type" clearable placeholder="文件类型" size="medium" style="width:170px">
              <el-option
                label="证件"
                value="001">
              </el-option>
              <el-option
                label="文件"
                value="002">
              </el-option>

            </el-select>
            <el-input size="medium" clearable placeholder="请输入文件名称" icon="search" v-model="query.fileName" @keyup.enter.native="loadData" style="width: 290px;"></el-input>
            <el-button type="primary" size="medium" @click="loadData"  class="btnTop">查询</el-button>
          </el-col>
        </el-row>
        <!-- table -->
        <el-table class="page-table" :data="listData" stripe highlight-current-row :cell-style="{color:'#333'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                           :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="header.prop == 'updateDt'">
                {{scope.row.updateDt | timeFormat}}
              </div>
              <div v-else-if="header.prop == 'size'">
                <span v-if="scope.row.size">{{scope.row.size}}KB</span>
                <span v-else></span>
              </div>
              <div v-else-if="header.prop == 'type'">
                {{getDictsKeyName(scope.row,'FileType',scope.row.type)}}
              </div>
              <div v-else>{{scope.row[header.prop]}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="deleteItem(scope.row)">删除</el-button>
              <!-- <el-button type="primary" size="mini" v-if="scope.row.key" @click="downLoadItem(scope.row)">下载</el-button> -->
              <template v-if="scope.row.key">
                  <span>
                      <el-button type="primary"  size="mini" v-if="scope.row.key.indexOf('jpg')!=-1 || scope.row.key.indexOf('png')!=-1" @click="previewImg(scope.row)">预览图片</el-button>
                    <el-button type="primary"  size="mini" @click="openHref(scope.row)" v-else-if="scope.row.key.indexOf('pdf')!=-1 || scope.row.key.indexOf('PDF')!=-1">预览PDF</el-button>
                    <el-button type="primary"  size="mini"  v-else @click="downLoadItem(scope.row)">下载文件</el-button>
                  </span>
                </template>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" class="page-box" justify="end">
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>

          <el-button type="primary" size="small" @click="exportExcel">导出excel</el-button>
        </el-row>
      </el-col>
    </el-row>
     <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg"  />
    <file-upload v-show="isShowDialog" :isShowDialog="isShowDialog" :orgId="orgId" @closeDialog="closeDialog"></file-upload>
  </div>
</template>

<script>
 import Api from '@/api/index'
 import FileUpload from './FileUpload'
  import ImgPreview from '@/components/common/ImgPreview'
 import * as filters from '@/filters/filter'
 import Util from '@/utils/'
 export default {
   components: {
     'file-upload': FileUpload,ImgPreview
   },
   data () {
     return {
        isShowDialogImg:false,
        pictures:null,
        query: {
          pageSize: 10,
          pageNum: 1,
          fileName:'',
          type:''
        },
        orgId: '',
        orgName: '',
        isShowDialog:false,
        form: {},
        treeData: [],
        listLoading: false,
        listData: [],
        total: 20,
        multipleSelection: [],
        tableHeader: [
          {
            prop: 'fileName',
            label: '文件名',
            width: '150',
            align: 'center',
            show: true
          }, {
            prop: 'description',
            label: '文件描述',
            width: '250',
            align: 'center',
            show: true
          }, {
            prop: 'type',
            label: '文件类型',
            align: 'center',
            show: true
          }, {
            prop: 'size',
            label: '文件大小',
            align: 'center',
            show: true
          }, {
            prop: 'orgName',
            label: '目录',
            align: 'center',
            show: true
          }, {
            prop: 'updateDt',
            label: '修改日期',
            align: 'center',
            show: true
          }, {
            prop: 'ctUName',
            label: '创建人',
            align: 'center',
            show: true
          }],

      }
    },
    mounted () {
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })
     this.loadData()
    },
    methods: {
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        //除图片外，直接打开新页查看；
        openHref(row){
          Api.getUrl(row.key).then(data => {
            if (data) {
              window.open(data)
            }
          })
        },
        //图片预览
        previewImg(row){
          let img = ''
          Api.getUrl(row.key).then(data => {
            if (data) {
              img = data
              this.pictures = []
              this.pictures.push(img)
              console.log(this.pictures,'poo')
              this.isShowDialogImg = true
            }
          })

        },
         //获取数据字典名称通过KEY
      getDictsKeyName(row,key,value){
        return Util.getDictsKeyName(row,key,value)
      },
      openUploadDialog () {
        if (!this.orgId) {
          this.$notify.warning({
            title: '提示',
            message: '请选择部门'
          })
          return;
        }
        this.isShowDialog = true
      },
      closeDialog () {
        this.isShowDialog = false
        this.loadData()
      },
     loadData (pageNum=1) {
        if(typeof pageNum =='object'){
          this.query.pageNum =1
        }else{
          this.query.pageNum =pageNum
        }
        this.listLoading = true
        Api.filePageAll(this.query).then(data => {
          if(data){
            this.listData = data.records;
            this.total = data.total
            let _this = this

            this.listData.forEach(function (item) {

              //item.typeStr = filters.taskTypeFilter(item.type)
             //_this.$set(item, 'typeF', filters.fileType(item.type))
              //item.statesStr = filters.taskStatesFilter(item.states)

            })

          }
        })
        this.listLoading = false
      },
      handleClick(data, checked, node){
        if(checked == true){
          this.form.orgId = data.orgId;
          this.orgId = data.orgId;
          this.orgName = data.orgName
          this.$refs.orgTree.setCheckedNodes([data]);
        }
      },
      nodeClick(data, checked, node){
        this.form.orgId = data.orgId
        this.orgId = data.orgId
        this.orgName = data.orgName
        this.$refs.orgTree.setCheckedNodes([data]);
      },

      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData(val)
      },
      /***删除**/
      deleteItem (item) {
        this.$confirm('您确定要删除['+item.fileName+']的信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteFile(param).then(() => {
            this.$notify.success({
              title: '提示',
              message: '删除成功'
            })
            this.loadData()
          }).catch(() => {
            this.$notify.warning({
              title: '提示',
              message: '删除失败'
            })
          })
        })
      },

      downLoadItem (item) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          Api.getUrl(item.key).then(data => {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = item.key;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          });
        } else {
          //window.location.href = data;
          let key = item.key
          if (key) {
            Api.downloadFile(key).then((res) => {
              if (res) {
                if (window.navigator.msSaveOrOpenBlob) {
                  navigator.msSaveBlob(res, item.key)
                } else {
                  /*var link = document.createElement('a')
                  link.href = window.URL.createObjectURL(res)
                  link.download = key
                  link.click()
                  window.URL.revokeObjectURL(link.href)*/
                  const elink = document.createElement('a')
                  elink.download = key
                  elink.style.display = 'none'
                  elink.href = URL.createObjectURL(res)
                  document.body.appendChild(elink)
                  elink.click()
                  URL.revokeObjectURL(elink.href) // 释放URL 对象
                  document.body.removeChild(elink)
                }
              }
            });
          }
        }
      },
      exportExcel () {
        if (this.listData.length > 0) {
          let param = {
            tableHead: this.tableHeader,
            data: this.listData
          }
          Api.downloadExcel(param).then((res) => {
            if (res) {
              let reader = new FileReader()
              reader.readAsDataURL(res)
              reader.onload = (e) => {
                let a = document.createElement('a')
                a.download = '文件架构列表数据.xlsx'
                a.href = e.target.result
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
 .title{
   background: #323743;
   color: #fff;
   text-align: center;
   padding: 8px 0;
 }
</style>

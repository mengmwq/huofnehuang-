<template>
  <div>
    <el-form :model="form" label-width="130px" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="指派人：" prop="producer">
                <el-input v-model="form.producer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="指派时间：" prop="time">
                <el-date-picker v-model="form.time" value-format="yyyy-MM-dd hh:mm:ss" type="datetime" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="备注：">
                <el-input style="width:100%;" show-word-limit type="textarea" v-model="form.remarks"></el-input>
              </el-form-item>
            </el-col>
            
          </el-row>
         <div class="text-center">
            <el-button type="primary" @click="confirmSubmitFile">确 认</el-button>
          </div>
        </el-form>
  </div>
</template>


<script>
  import Api from '@/api/index'
  import moment from 'moment'
  export default {
    components: {
    
    },
    data () {
      return {
        rules: {
          producer:[
              { required: true, message: '请输入指派人', trigger: 'change'},
          ],
          time:[
              { required: true, message: '请选择指派时间', trigger: 'change'},
          ],
        },
        JobDialog: false,
        isShowDialogImg:false,
        pictures:null,
        isShowDialog:false,
        
        hasCallBack: true,
        callBackName: 'onSubmit',
        form: {
          producer:'',  //项目编号
          time:'',   //临时附件key
          remarks:''   //描述
        },
        query: {
           pageSize: 10,
           pageNum: 1,
          // keyword: '',
          // type: '',
          // caId: '',
           projectCode:''
        },

        tableHeader: [{
          prop: 'name',
          label: '附件名称',
          width: '120',
          show: true
        }, {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          show: true
        }, {
          prop: 'ctUName',
          label: '上传人',
          width: '150',
          align: 'center',
          show: true
        }, {
          prop: 'createDt',
          label: '上传时间',
          align: 'center',
          show: true
        }],
        /** 表格数据 */
        listData: [],
        projectInfo:null,
        /** 总数据数 */
        total: 0,
        /** 表格 loading */
        listLoading: false,
        multipleSelection: [],
        fileList: [],
        props: {
          projectCode: String
        },

      }
    },
    mounted () {
      this.query.projectCode = this.$route.query.id
      this.form.projectCode = this.$route.query.id
      this.getFileMakeInfo()


    },
    methods: {
      /**
       * 删除（停用）信息
       * */
      deleteItem (item) {
        this.$confirm('您确定要删除【' + item.name + '】吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: item.id,
          }
          Api.deleteProjectAttachment(param).then((data) => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '项目附件删除成功'
              })
              this.loadData()

            } else {
              this.$notify.warning({
                title: '提示',
                message: '项目附件删除失败'
              })
            }
          })

        })
      },
      //关闭图片预览；
        closeDialogImg(){
            this.isShowDialogImg = false
        },
        // 判断是否图片
        isHasImg(key){
           const aFileType = ['.jpg','.jpeg','.png']
            return aFileType.some(item=>key.toLowerCase().lastIndexOf(item)!=-1)
        },
        //文件预览处理
        showFileDetails(key){
          let img = ''
          Api.getUrl(key).then(data => {
            if (data) {
              if(this.isHasImg(key)){
                //图片预览处理；
                 img = data
                  this.pictures = []
                  this.pictures.push(img)
                  this.isShowDialogImg = true
              }else{
                //除图片的其他文件；
                   window.open(data)
              }
            }
          })

        },
      closeDialog () {
        this.isShowDialog = false
        this.loadData()
      },
      getFileMakeInfo () {
        this.listLoading = true
        let param = {bidId: this.$route.query.id}
    
        Api.getBidFileByBidId(param).then(data => {
           if(data){
             data.time = moment(data.time).format('YYYY-MM-DD HH:mm:ss')
             this.form = data
           }
            this.listLoading = false
        })
        this.listLoading = false
      },
      /**
       * 加载项目附件
       */
      loadData () {
        this.listLoading = true
        Api.projectAccessoryList(this.query).then(data => {
          if (data) {
            this.listData = data.records
            this.total = data.total
            this.listLoading = false
          }
        })
      },
      downLoadItem (item) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          Api.getUrl(item.attachmentUrlKey).then(data => {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = item.attachmentUrlKey;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          });
        } else {
          //window.location.href = data;
          let key = item.attachmentUrlKey
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
      /**
       * 提交
       * */
      onSubmit (form) {
        this.confirm(form)
      },
      confirmSubmitFile(){
        let params = this.form
          params.id = this.$route.query.id;
          params.stateId = '005'  //文件制作中
          
          Api.updateBidProject(params).then(data => {
            if (data) {
              this.$notify.success({
                title: '提示',
                message: '已确认文件制作'
              })
              // 重新渲染页面数据
              //this.loadData()
            }
          })
      },
      /** 确认添加 */
      confirm: function (form) {
        //子组件form 提交过来的参数
       /* description: "4545uuuuuuuuuuuuuuuu"
        fileName: "45464"
        key: "FvBcW2i1nwSnyzgb7uS4q1Op7mN6"
        size: "7.9"
        type: "001"*/
        this.form.attachmentUrlKey = form.key
        this.form.name = form.fileName
        this.form.remarks = form.description
        this.form.type = form.type
        Api.projectAccessoryAdd(this.form).then(data => {
          if (data) {
            this.$notify.success({
              title: '提示',
              message: '添加附件成功'
            })
            this.closeDialog()
          }
        })
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      downloadFile(item) {

          if (!!window.ActiveXObject || "ActiveXObject" in window) {
            Api.getUrl(item.attachmentUrlKey).then(data => {
              var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
              save_link.href = data;
              save_link.download = item.attachmentUrlKey;
              var event = document.createEvent('MouseEvents');
              event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
              save_link.dispatchEvent(event);
            });
          } else {
            //window.location.href = data;
            if (item.attachmentUrlKey) {
              let key = item.attachmentUrlKey
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
      batchDownload () {
        if (this.multipleSelection.length === 0) {
          this.$notify.warning({
            title: '提示',
            message: '请勾选下载项'
          })
          return
        }
      },
      tableStatusChange (val) {
        this.tableStatus = val
      },
      handleSizeChange (val) {
        this.query.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.query.pageNum = val
        this.loadData()
      }
    }
  }
</script>

<style scoped>

</style>


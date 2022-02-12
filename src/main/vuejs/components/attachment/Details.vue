<template>
  <div>
    <!-- table -->
    <el-table
      class="page-table"
      :data="attachmentInfo"
      stripe
      highlight-current-row
      v-loading="listLoading"
      :cell-style="{color:'#333'}"
    >
      <template v-for="(header, index) in tableHeader">
        <el-table-column
          v-if="header.show"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          :sortable="header.sortable"
          :align="header.align"
          :min-width="header.width"
          :column-key="header.prop"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="header.prop === 'createDt'">{{scope.row.createDt | timeFormat}}</div>
            <div v-else>{{scope.row[header.prop]}}</div>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.attachmentUrlKey">
            <el-button
              type="primary"
              size="mini"
              @click="showFileDetails(scope.row.attachmentUrlKey)"
              v-if="isHasImg(scope.row.attachmentUrlKey)"
            >预览图片</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="showFileDetails(scope.row.attachmentUrlKey)"
              v-else-if="scope.row.attachmentUrlKey.indexOf('pdf')!=-1 || scope.row.attachmentUrlKey.indexOf('PDF')!=-1"
            >预览PDF</el-button>
            <el-button
              type="primary"
              size="mini"
              v-else
              @click="showFileDetails(scope.row.attachmentUrlKey)"
            >下载文件</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <ImgPreview
      :pictures="pictures"
      :isShowDialog="isShowDialogImg"
      :isFullscreen="false"
      v-if="isShowDialogImg"
      @closeDialog="closeDialogImg"
    />
  </div>
</template>


<script>
import Api from "@/api/index";
import ImgPreview from "@/components/common/ImgPreview";
export default {
  props: {
    attachmentInfo:{
       type:Array 
    },
  },
  components: {
    ImgPreview
  },
  data() {
    return {
      isShowDialogImg: false,
      pictures: [],
      isShowDialog: false,

      tableHeader: [
        {
          prop: "name",
          label: "附件名称",
          width: "120",
          show: true
        },
        {
          prop: 'description',
          label: '文件描述',
          width: '200',
          show: true
        },
        // {
        //   prop: "ctUName",
        //   label: "上传人",
        //   width: "150",
        //   show: true
        // },
        {
          prop: "createDt",
          label: "上传时间",
          show: true
        }
      ],
      /** 表格数据 */
      //listData: [],

      /** 总数据数 */
      total: 0,
      /** 表格 loading */
      listLoading: false,
    };
  },
  methods: {
   
    //关闭图片预览；
    closeDialogImg() {
      this.isShowDialogImg = false;
    },
    // 判断是否图片
    isHasImg(key) {
      const aFileType = [".jpg", ".jpeg", ".png"];
      return aFileType.some(item => key.toLowerCase().lastIndexOf(item) != -1);
    },
    //文件预览处理
    showFileDetails(key) {
      let img = "";
      Api.getUrl(key).then(data => {
        if (data) {
          console.log(`data`, data)
          if (this.isHasImg(key)) {
            //图片预览处理；
            img = data;
            this.pictures = [];
            this.pictures.push(img);
            this.isShowDialogImg = true;
          } else {
            //除图片的其他文件；
            window.open(data);
          }
        }
      });
    },
    closeDialog() {
      this.isShowDialog = false;
    },
    downloadFile(item) {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        Api.getUrl(item.attachmentUrlKey).then(data => {
          var save_link = document.createElementNS(
            "http://www.w3.org/1999/xhtml",
            "a"
          );
          save_link.href = data;
          save_link.download = item.attachmentUrlKey;
          var event = document.createEvent("MouseEvents");
          event.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          );
          save_link.dispatchEvent(event);
        });
      } else {
        //window.location.href = data;
        if (item.attachmentUrlKey) {
          let key = item.attachmentUrlKey;
          Api.downloadFile(key).then(res => {
            if (res) {
              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(res, item.key);
              } else {
                /*var link = document.createElement('a')
                    link.href = window.URL.createObjectURL(res)
                    link.download = key
                    link.click()
                    window.URL.revokeObjectURL(link.href)*/
                const elink = document.createElement("a");
                elink.download = key;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(res);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              }
            }
          });
        }
      }
    },
   
  }
};
</script>


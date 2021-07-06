<template>
  <div>
    <el-row class="mb10">
      <el-col :span="24" class="text-left">
        <el-button type="primary" size="small">文件上传</el-button>
      </el-col>
    </el-row>
    <el-table class="page-table" :data="fileData" stripe highlight-current-row :cell-style="{color:'#333'}"
              @selection-change="handleSelectionChange1">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="fileName" label="文件名称"></el-table-column>
      <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="">查看</el-button>
          <el-button type="primary" size="mini" @click="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'FileSubmitTable',
    data () {
      return {
        fileData: [],
        multipleSelection: []
      }
    },
    props: {},
    watch: {},
    mounted() {},
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
    }
  }
</script>

<style scoped>

</style>

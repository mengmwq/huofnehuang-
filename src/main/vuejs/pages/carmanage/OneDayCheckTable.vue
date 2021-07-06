<template>
  <div>
    <el-table class="page-table" :data="listData1" stripe highlight-current-row :cell-style="{color:'#333'}"
    >
      <el-table-column v-for="(header, index) in tableHeader" v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                       :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="header.prop == 'option'">
            <span v-if="tag === 'print'"> {{ scope.row.option? '是': '否'}}</span>
            <el-switch v-else
              style="display: block"
              v-model="scope.row.option"
              active-color="#13ce66"
              inactive-color="#aaa"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </div>
          <div v-else>{{scope.row[header.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "OneDayCheckTable",
    data () {
      return {
        //定义表格
        tableHeader: [{
          prop: 'no',
          label: '序号',
          width: '60',
          align: 'center',
          show: true
        }, {
          prop: 'project',
          label: '检查项目',
          width: '400',
          align: 'center',
          show: true
        }, {
          prop: 'option',
          label: '选项',
          align: 'center',
          show: true
        }],
        listData1: []
      }
    },
    props: {
      listData: {
        type: Array,
        default: []
      },
      tag: String
    },
    watch: {
      listData: function (value) {
        this.listData1 = value
      },
      listData1: function (value) {
        this.$emit('update:listData', value)
      }
    }
  }
</script>

<style scoped>

</style>

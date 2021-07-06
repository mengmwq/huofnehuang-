<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="orgId"
      ref="orgTree"
      default-expand-all
      highlight-current
      :props="{label: 'orgName', children: 'childrens'}"
      :default-checked-keys="checkedKeys"
      :check-strictly="true"
      @check-change="handleClick"
      @node-click="nodeClick">
    </el-tree>
  </div>
</template>

<script>
  import Api from '@/api/index'
  export default {
    name: "OrgTree",
    data () {
      return {
        treeData: [],
        checkedKeys: [],
        orgName: ''
      }
    },
    props: {
      tag: String,
      orgIds: Array,
      orgId: String,
      isMuti: Boolean
    },
    watch: {
      orgIds: function (value) {
        this.checkedKeys = value
      },
      orgId: function (value) {
        this.checkedKeys = []
        if (value) {
          this.checkedKeys.push(value)
        }

      }
    },
    mounted () {
      // 组织机构
      Api.getTreeFormOrgInfo().then(data => {
        this.treeData = data
      })
    },
    methods: {
      handleClick(data, checked, node){
        if(checked == true){
          this.orgId = data.orgId;
          this.orgName = data.orgName
          if (this.tag === 'supplier') {
            let arr = [data]
            this.$emit('update:orgId', arr)
          } else {
            this.$emit('update:orgId', data.orgId)
          }
          this.$refs.orgTree.setCheckedNodes([data]);
        }
      },
      nodeClick(data, checked, node){
        this.orgId = data.orgId
        this.orgName = data.orgName
        if (this.tag === 'supplier') {
          let arr = [data]
          this.$emit('update:orgId', arr)
        } else {
          this.$emit('update:orgId', data.orgId)
        }
        this.$refs.orgTree.setCheckedNodes([data]);
      },
    }
  }
</script>

<style scoped>

</style>

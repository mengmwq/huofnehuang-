<template>
  <el-tree
    :data="orgInfoList"
    :props="defaultProps"
    :expand-on-click-node="false"
    :filter-node-method="filterNode"
    ref="orgTree"
    node-key="id"
    default-expand-all
    highlight-current
    @node-click="nodeClick">
    </el-tree>
</template>
<script>
import Api from "@/api/index";
export default {
  props:['orgId'],
  data() {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      userInfo:userInfo,
      searchTreeName: "",
      orgInfoList: [],
      defaultProps: {
        children: 'childrens',
        label: 'orgName'
      },
    };
  },
  mounted() {
    this.getOrganizationInfoList()
  },
  methods: {
    /**
       * 树节点过滤查询
       */
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1;
      },
    closeDialog(){
        this.$emit('closeDialog')
    },
    /**
       * 节点点击事件
       */
      nodeClick (data) {
        this.$emit('dataChange',data)
      },
    /**
       * 获取机构树
       */
      getOrganizationInfoList () {
        const params = {
          root:this.orgId
        }
        Api.getTreeFormOrgInfo(params).then((res) => {
          if (res) {
            this.orgInfoList = res
          }
        })
      },
  }
};
</script>

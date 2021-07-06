<template>
  <div class="border">
        <div class="orgTree">
          <div class="searchBox" style="padding-left:10px;padding-right:10px;">
            <el-input placeholder="请输入关键字查询" @focus.native="stopDefault" @click.native="stopDefault"    prefix-icon=" el-icon-search" v-model="searchTreeName">
            </el-input>
          </div>
          <el-tree
            :data="orgInfoList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="orgTree"
            node-key="id"
            :default-expand-all="true"
            highlight-current
            @node-click="nodeClick">
          </el-tree>
        </div>
      </div>
</template>
<script>
import Api from '@/api/index'
export default {
  props: {
    isShowDialog: Boolean
  },
  watch: {
    searchTreeName (val) {
      this.$refs.orgTree.filter(val)
    }
  },
  data () {
    const userInfo = JSON.parse(sessionStorage.getItem('jwt'))
    return {
      userInfo: userInfo,
      searchTreeName: '',
      orgInfoList: [],
      
      defaultProps: {
        children: 'childrens',
        label: 'orgName'
      }
    }
  },
  mounted () {
    this.getOrgDataInfo()
  },
  methods: {
    stopDefault (event) {
      event.stopPropagation()
      event.cancelBubble()
      return
    },
    /**
       * 树节点过滤查询
       */
    filterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    /**
       * 节点点击事件
       */
    nodeClick (data) {
      this.$emit('dataChange', data)
    },
    /**
       * 获取机构树
       */
    getOrgDataInfo () {
      const params = {
        orgId: this.userInfo.orgId
      }
      Api.getTreeFormOrgInfo(params).then((res) => {
        if (res) {
          this.orgInfoList = res
        }
      })
    }
  }
}
</script>

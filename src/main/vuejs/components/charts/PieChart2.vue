<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    option:{
       type: Object,
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      let option ={
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: true,
        series: [
          {
            name: '课程分页',
            type: 'pie',
            radius: [30, 70],
           color:['#9d5ba2','#535aa5','#fab048','#00A99D'],
            data: [
              {value:335, name:'天仁'},
                        {value:310, name:'尹礼'},
                        {value:234, name:'亲智'},
                        {value:135, name:'师信'},
                        {value:135, name:'地义'},
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      };
      this.chart.setOption(option)
    }
  }
}
</script>

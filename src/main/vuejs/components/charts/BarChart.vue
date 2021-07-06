<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    resources:{
      type:Array,
      default:function(){
         return []
      },
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

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
           type: 'value',
          show:false,

          axisLine: {show:false},
          axisTick: {
            alignWithLabel: false
          }
        }],
        yAxis: [{
          type: 'category',
          axisLine: {show:false},
           axisTick: {show:false}, 
           axisLabel: {show:true,textStyle: {color: '#fff'}},
           splitLine: {show:false},
          data:this.resources.map(item=>item.name).reverse(),
          
        }],
        series: [{
          name: '营收',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          //itemStyle:{normal:{color:'#C63830'}},
          itemStyle:{
            
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,//渐变色在下面修改，这里是透明度
                [{
                    offset: 0,
                    color: '#C1272D'
                  },
                  {
                    offset: 1,
                    color: '#F7B432'
                  }
                ]
              )
            },      
          },
          data: this.resources.map(item=>item.value).reverse(),
          label:{
              show:false, 
              formatter:'营收:{c}万元',
              position:"inside",
              textStyle:{
                color:"#fff"
              }
            },
          animationDuration
        }]
      })
    }
  }
}
</script>

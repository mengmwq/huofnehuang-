<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
   
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '370px'
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
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getTimeslotAmount(arr,i){
        let amount = 0;
        for(let j=0;j<arr.length;j++){
              if(i==arr[j].timeslot){
                return arr[j].timeslotAmount
              }
        }
        return amount 
    },
    //处理数据 
    handleData(arr){
       let newArr = []
       for(let i=0;i<24;i++){
            newArr.push(this.getTimeslotAmount(arr,i))
       }
       return newArr;
    },
    //初始化数据 
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      //学习次数
      
      let option =option = {
          // title: {
          //     text: '多雷达图'
          // },
          tooltip: {
              trigger: 'axis'
          },
          grid:{
            top: '0',
            left:'30%',
          },
          radar: [
              {
                  indicator: [
                      {text: '社会型(S)', max: 100},
                      {text: '艺术型(A)', max: 100},
                      {text: '研究型(I)', max: 100},
                      {text: '现实型(R)', max: 100},
                      {text: '常规型(C)', max: 100},
                      {text: '企业型(E)', max: 100},
                  ],
                  // center: ['25%','40%'],
                  radius: 80
              },
          ],
          series: [
              {
                  type: 'radar',
                  tooltip: {
                      trigger: 'item'
                  },
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data: [
                      {
                          value: [60,73,85,40,20,10],
                          
                      }
                  ]
              },
              
          ]
      };

      this.chart.setOption(option)
    }
  }
}
</script>

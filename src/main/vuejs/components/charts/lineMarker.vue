<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    resources:{
      type:Array,
      default:[],
    },
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
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    //console.log(this.resources.map(item=>item.timeslot+':00'))
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
       let  aStudyCount =[]
      if(this.resources){
         aStudyCount = this.handleData(this.resources)
      }
    
      this.chart.setOption({
        //backgroundColor: '#394056',
        title: {
          top: 20,
          text: '课程学习时段趋势统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#005AA2'
            }
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#005AA2'
            }
          },
          //data:this.resources.map(item=>item.timeslot+':00'),
          data: (function() {
            var list = [];
            for (let i = 0; i <= 23; i++) {
              let s = i;
              if(s<10){
                s = '0'+s+':00';  
              }else{
                s = s+':00';  
              }
            list.push(s);
            }
            return list;
          })(),
          nameGap: "24",
          
        }],
        yAxis: [{
          type: 'value',
          name: '',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#005AA2'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#005AA2'
            }
          }
        }],
        series: [{
          name: ' 学习次数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(100, 210, 194, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(100, 210, 194, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(100, 210, 194)',
              borderColor: 'rgba(100, 210, 194,0.27)',
              borderWidth: 12

            }
          },
          data:aStudyCount,
          //data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
        }]
      })
    }
  }
}
</script>

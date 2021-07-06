<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    option: {
      type: Object,
      default: function() {
        return {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            extraCssText:'z-index:9'
          },
          calculable: true,
          series: [
            {
              name: "",
              type: "pie",
              //radius: [30, 70],

              label: {
                normal: {
                  formatter: " {b} {d}% "
                }
              },
              data: [20,50],
              animationEasing: "cubicInOut",
              animationDuration: 2600
            }
          ]
        };
      }
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null,
      timer:null,
    };
  },
  mounted() {
   
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    clearInterval(this.timer)
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    /** 初始化图表 */
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption(this.option);
      let app = {
        currentIndex: -1
      }
      this.timer = setInterval(()=> {
          var dataLen = this.option.series[0].data.length;
          // 取消之前高亮的图形
          this.chart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: app.currentIndex
          });
          app.currentIndex = (app.currentIndex + 1) % dataLen;
          // 高亮当前图形
          this.chart.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: app.currentIndex
          });
          // 显示 tooltip
          this.chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: app.currentIndex
          });
      }, 1500);
    }
  }
};
</script>

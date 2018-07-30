<template>
    <div class="echart_box">
        <div id="barEchart" style="width:100%;height:300px;"></div>
    </div>
</template>
<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "barEchart",
  data() {
    return {
      barItemData: null,
      barItemName: null,
      newAddData: null,
      newAddName: null
    };
  },
  props: ["barData"],
  mounted() {
    this.initBarEchart();
  },
  watch: {
    barData() {
      if (this.barData.length > 1) {
        this.barItemData = this.barData[0];
        this.newAddData = this.barData[1];
        this.initBarEchart();
      } else {
        this.barItemData = this.barData[0];
        this.initBarEchart();
      }
    }
  },
  methods: {
    initBarEchart() {
      // 基于准备好的dom，初始化echarts实例

      this.newAddName = [];
      this.barItemName = [];
      let myChart = echarts.init(document.getElementById("barEchart"));
      if (this.barData.length > 1) {
        this.barItemData = this.barData[0];
        this.newAddData = this.barData[1];
        this.barItemData.forEach(ele => {
          this.barItemName.push(ele.name);
        });
        this.newAddData.forEach(ele => {
          this.newAddName.push(ele.name);
        });
      } else {
        this.barItemData = this.barData[0];
        this.barItemData.forEach(ele => {
          this.barItemName.push(ele.name);
        });
      }

      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "0%",
          containLabel: true,
          
        },
        color: ["#0b63a3", "#7a93a4"],
        xAxis: {
          data: this.barItemName,
          
        },
        yAxis: {},
        series: [
          {
            name: "总数",
            type: "bar",
            stack: "总量",
            barWidth: '60%',
            label: {
              normal: {
                show: true,
                // position: "insideRight"
                textStyle:{
                  // color:"#000",
                  fontSize:"13"
                }
              }
            },
            data: this.barItemData
          },
          {
            name: "增长",
            type: "bar",
            stack: "总量",
            barWidth: '60%',
            label: {
              // normal: {
              //   show: true,
              //   // position: "insideRight"
              //   position: "top",
              //   textStyle:{
              //     color:'#000',
              //   }
              // }
            },
            data: this.newAddData
          },
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// .echart_box{
//     width: 1100px;
//     margin: 0 auto;
// }
</style>


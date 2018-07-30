<template>
    <div class="echart_box">
        <div id="lineEchart" style="width:100%;height:300px;"></div>
    </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
    name : "lineEchart",
    data(){
        return {
            itemData :null,
            itemName:null,
        }
    },
    props:["lineData"],
    mounted(){
        this.initLineEchart()
    },
    watch:{
        lineData() {
            this.itemData = this.lineData
            this.initLineEchart();
        },
    },
    methods:{
        initLineEchart(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('lineEchart'))
                this.itemData = this.lineData
                this.itemName = [];
                if (this.itemData) {
                    this.itemData.forEach(ele => {
                        this.itemName.push(ele.name)
                    })
                }
            // 绘制图表
            myChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                // toolbox: {     //下载
                //     show: true,
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                xAxis:  {
                    type: 'category',
                    data: this.itemName,
                    boundaryGap: true //坐标轴两边留白
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} '
                    },
                    axisPointer: {
                        snap: true
                    }
                },

                series: [
                    {
                        name:'用户新增量',
                        type:'line',
                        // smooth: true,
                        data: this.itemData,
                        symbolSize: 10,
                     
                    }
                ]
            });
        },
    }
}
</script>
<style lang="scss" scoped>

</style>


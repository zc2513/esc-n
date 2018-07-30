<template>
    <div class="echart_box">
        <div  id="barLineEchart" style="width:100%;height:300px;"></div>
    </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
// require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
    name :"barAndLineEchart",
    data(){
        return {
            barItemData:null,
            barItemName:null,
            lineData :null,
            lineName:null
        }
    },
    props:["barAndLineData"],
    mounted(){
        this.initBarEchart()
    }, 
    watch : {
        barAndLineData(){
            this.barItemData = this.barAndLineData[1];
            this.lineData = this.barAndLineData[0]
            this.initBarEchart();  
        }
    },
    methods: {
        initBarEchart() {
        // 基于准备好的dom，初始化echarts实例
            this.barItemName = [];
            this.lineName = [];
        let myChart = echarts.init(document.getElementById('barLineEchart'))
            this.barItemData = this.barAndLineData[1];
            this.lineData = this.barAndLineData[0]
            this.barItemData.forEach(ele => { //金额处理
                this.barItemName.push(ele.name)
            });
            this.lineData.forEach(ele => {  //订单数量处理
                this.lineName.push(ele.name)
            });
        // 绘制图表
        myChart.setOption({
           tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            color:["#FF7F50","#9DD6F9"],
            toolbox: {
                feature: {
                    // dataView: {show: true, readOnly: false},
                    magicType: {show: false, type: ['line', 'bar']},
                    // restore: {show: true},
                    // saveAsImage: {show: true}
                }
            },
            legend: {
                data:['订单金额','订单数量']
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.lineName,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '数量',
                    // min: 0,
                    // max: "",
                    // interval: 50,
                    axisLabel: {
                        formatter: '{value} 个'
                    }
                },
                {
                    type: 'value',
                    name: '金额',
                    min: 0,
                    // max: "5",
                    // interval: 5,
                    axisLabel: {
                        formatter: '{value} 元 '
                    }
                }
            ],
            series: [
            
                {
                    barWidth:"50%",
                    name:'订单数量',
                    type:'bar',
                    data:this.lineData 
                },
                {
                    name:'订单金额',
                    type:'line',
                    yAxisIndex: 1,
                    data:this.barItemData
                }
            ] 
        });
        }
    }
}
</script>
<style lang="scss" scoped>
    // .echart_box{
    //     width: 1100px;
    //     margin: 0 auto;
    // }
</style>


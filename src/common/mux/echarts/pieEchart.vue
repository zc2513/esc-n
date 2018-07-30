<template>
    <div class="echart_box">
        <div id="pieEchart" style="width:100%;height:350px;"></div>
    </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
    name:"pieEchart",
    data(){
        return {
            itemData:null,
            itemName : null,
        }
    },
    props:["pieData"],
    created(){
        
    },
    mounted(){
        this.initPieEchart();    
    },
    watch : {
        pieData(){
            this.itemData = this.pieData
            this.initPieEchart();  
        },        
    },
    methods:{
        initPieEchart(){
            let pieEchart = echarts.init(document.getElementById("pieEchart"))
            this.itemName = [];
            this.itemData = this.pieData;
            this.itemData.forEach(ele => {
                this.itemName.push(ele.name);
            });
            pieEchart.setOption (
                {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
               color:["#4cb2d1","#df6d69","#5cb85c","#f0ad4e","#74c374","#f0433d","#f2b968","#5ab1ef","#77d3be"],
                legend: {
                    orient: 'vertical',
                    // x: 'center',
                    x: 'left',
                    // y:"bottom",
                    data:this.itemName
                },
                series: [
                    {
                        data: this.itemData,
                        type:'pie',
                        radius: ['0%', '80%'],
                        label: {
                            // normal: {
                            //     show:false,
                            //     position: 'center',
                            //     formatter: " {b}: {c} ({d}%)",
                            // },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '15',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        
                    },
                ]
            })
        },
    }
}
</script>
<style lang="scss" scoped>

</style>


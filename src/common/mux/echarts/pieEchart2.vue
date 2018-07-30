<template>
    <div class="echart_box">
        <div v-if="pieData2" id="pieEchart2" style="width:100%;height:350px;"></div>
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
    props:["pieData2"],
    mounted(){
        this.initPieEchart();    
    },
    watch : {
        pieData2(){
            this.itemData = this.pieData2
            this.initPieEchart();  
        },        
    },
    methods:{
        initPieEchart(){
           
            let pieEchart = echarts.init(document.getElementById("pieEchart2"))
                this.itemName = [];
                this.itemData = this.pieData2;
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
                     x: 'left',
                    // y:"bottom",
                    data:this.itemName
                },
                series: [
                    {
                        data: this.itemData,
                        type:'pie',
                        radius: ['0', '80%'],
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
                            // normal: {
                            //     // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            //     formatter: '{b|{b}：}{c}  {per|{d}%}  ',
                            //     // backgroundColor: '#eee',
                            //     // borderColor: '#aaa',
                            //     // borderWidth: 1,
                            //     // borderRadius: 4,
                            //     // shadowBlur:3,
                            //     // shadowOffsetX: 2,
                            //     // shadowOffsetY: 2,
                            //     shadowColor: '#999',
                            //     padding: [0, 20],
                            //     rich: {
                            //         a: {
                            //             color: '#999',
                            //             lineHeight: 22,
                            //             align: 'center'
                            //         },
                            //         abg: {
                            //             backgroundColor: '#333',
                            //             width: '100%',
                            //             align: 'right',
                            //             height: 22,
                            //             borderRadius: [4, 4, 0, 0]
                            //         },
                            //         hr: {
                            //             borderColor: '#aaa',
                            //             width: '100%',
                            //             borderWidth: 0.5,
                            //             height: 0
                            //         },
                            //         b: {
                            //             fontSize: 16,
                            //             lineHeight: 33
                            //         },
                            //         per: {
                            //             color: '#eee',
                            //             backgroundColor: '#334455',
                            //             padding: [2, 4],
                            //             borderRadius: 2
                            //         }
                            //     }
                            // }
                        },
                        
                    },
                ]
            })
        },
    }
}
</script>



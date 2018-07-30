<template>
        <div>
            <slid :message='systemNavData'></slid> 
        </div>  
</template>
<script>
import slid from '../mux/sliderNavComponent'
export default {
    name:"system",
    data(){
        return{
            systemNavData:[],//左侧栏导航数据
        }
    },
    components:{
        slid
    },
    created(){
        this.getData();
    },
    mounted(){
        // Vm.$on('leftSliderEvent',msg=>{
        //         this.systemNavData=msg
        //         console.log(555,this.systemNavData)
        // })   
    },
    destroyed(){
        sessionStorage.removeItem("sliderChecked");
    },
    methods:{
        getData() {//页面切换左侧的数据获取与展示  
         this.systemNavData = JSON.parse(localStorage.getItem('sliderData'));
        },
    }
}
</script>
<style>
</style>


<template>
    <div>
        <div class="header">
            header
        </div>
        <div class="container">
            <div class="aside">
                aside
            </div>
            <div class="main">
                main
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        name:'home',
    }
</script>

<style lang='scss' scoped>
    .header{
        height: 4vh;
        width: 100%;
        background-color: #e2e2e2;
    }
    .container{
        height: 96vh;
        .aside{
            float: left;
            width: 10%;
            height: 100%;
            overflow: hidden;
            background-color: #ccc;
        }
        .main{
            float: right;
            width: 90%;
            height: 100%;
            overflow-y: auto;
            background-color: #eee;
        }
    }
</style>
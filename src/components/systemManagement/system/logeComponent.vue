<template>
    <div class="main_box">
      <div class="xzgl_title">
      日志管理
      </div>
      <div class="table_box">
          <div class="query_box">
              <ul>
                <li class="user_query">
                  <label for="order">操作菜单:</label>
                  <div class="select_content clearfix">  
                    <el-select size="small" v-model="chaxun.mName" placeholder="请选择" clearable>
                        <el-option
                            v-for="item in options"
                            :key="item.key"
                            :label="item.label"
                            :value="item.value"
                            >
                        </el-option>
                    </el-select>
                  </div>
                </li>
                <li class="user_query">
                  <label for="name">用户名称:</label>
                  <el-input size="small" id="name" type="text" v-model='chaxun.username' :clearable='chaxun.username?true:false'></el-input>
                </li>
                <li class="user_query">
                  <label for="linkUrl">URl:</label>
                  <el-input size="small" id="linkUrl" type="text" v-model='chaxun.url' :clearable='chaxun.url?true:false'></el-input>
                </li>
                <li class="user_query" style="width:540px;height:32px;line-height:32px;margin-top: 15px;">
                  <label for="date">操作时间:</label>
                  <!-- <el-input size="small" id="date" type="text" v-model='chaxun.startTime'></el-input> -->
                  <!-- <el-date-picker v-model="chaxun.startTime" align="right" size="small" type="date" placeholder="选择日期" :picker-options="pickerOptions1"  value-format='yyyy-MM-dd' @change='timeChange'></el-date-picker> -->
                  <timeSelect @getSelectTime="getSelectTime" @setEndTime="getEndTime"></timeSelect>
                </li>                
                <li class="btn"><el-button size="small" @click="chaxunData">查询</el-button></li>
              </ul>
          </div>
          <div class="table_content">
              <!-- 表格 -->
              <!-- <publicTable :msg='tableDatas' @pageSend='rxd'></publicTable> -->
              <el-table
                :data="tableData" border size='small' style="width: 100%">
                <el-table-column prop="mName" label="操作菜单" width="200"></el-table-column>
                <el-table-column prop="username" label="用户名称" width=""></el-table-column>
                <el-table-column prop="url" label="URL" width="350"></el-table-column>
                <el-table-column prop="userAgent" label="用户动作" width="120"></el-table-column>
                <el-table-column prop="ip" label="IP地址" width=""></el-table-column>
                <el-table-column prop="basePath" label="浏览器" width=""></el-table-column>
                <el-table-column prop="spendTime" label="操作时间"></el-table-column>
                <el-table-column prop="startTime" label="响应时间"></el-table-column>
            </el-table>
            <div class="page_btn" >
                <div class="block">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage3"
                        :page-size="8"
                        layout="total , prev, pager, next, jumper"
                        :total=this.pageNum>
                    </el-pagination>               
                </div>                    
            </div>
          </div>
      </div>
    </div> 
</template>
<script>
import publicTable from '../../mux/tableComponent' 
export default {
    name:'log',
    components: {
      publicTable
    },
    data() {
        return {
            pageNum:0,
            currentPage3:1,
            tableData:[],
            options: [],
            chaxun:{
                mName:'',
                username:'',
                url:'',
                startTime:'',
                endTime:''
            },
            checkList: [],
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            }
        }
    },
  created(){
      this.initData();
      this.list();
  },
  methods: {
      initData(){//初始化页面
          this.$http.post('/upms/log/list').then(res=>{
              let data = res.data.data.list;
            //   console.log(res)
              this.pageNum = res.data.data.total;
              if(res.data.code == 200 && res.data.message == "SUCCESS"){
                  this.pageData == res.data.data.total;
                  data.forEach((ele,i) => {
                    if(i<8){
                        this.tableData.push({
                            mName:ele.mName,
                            username:ele.username,
                            url:ele.url,
                            userAgent:ele.userAgent,
                            ip:ele.ip,
                            basePath:ele.basePath,
                            spendTime:new Date(ele.spendTime).toLocaleString(),
                            startTime:new Date(ele.startTime).toLocaleString()
                        });
                    }
                });
              }
          }).catch(error=>{
              console.log('服务请求失败');
          })
      },
      getSelectTime(time){
        if(time){
            this.chaxun.startTime = time;
        }else {
            this.chaxun.startTime = null
        }
    },
    getEndTime(time){
      if (time) {
          this.chaxun.endTime = time;    
      }else {
          this.chaxun.endTime = null;
      }
    },
      chaxunData(){//查询请求
          let data = this.chaxun;
          this.chaxun.page = 1;
          this.chaxun.size = 8;
          this.$http.post('/upms/log/listByParams',data).then(res=>{
              let data = res.data.data.list;
              this.tableData = [];
              if(res.data.code == 200 && res.data.message == "SUCCESS"){
                this.pageNum = res.data.data.total;
                this.currentPage3 = 1;
                data.forEach((ele,i) => {
                    if(i<8){
                        this.tableData.push({
                            mName:ele.mName,
                            username:ele.username,
                            url:ele.url,
                            userAgent:ele.userAgent,
                            ip:ele.ip,
                            basePath:ele.basePath,
                            spendTime:new Date(ele.spendTime).toLocaleString(),
                            startTime:new Date(ele.startTime).toLocaleString()
                        });
                    }
                });
              }
          }).catch(error=>{
              console.log('服务请求失败');
          })
      },
      list(){//获取菜单列表
          this.$http.post("/upms/permission/list").then(result => {
          this.list = result.data.data.list;
          let data = result.data.data.list;
          data.forEach((ele,i) => {
            this.options.push({
            key:ele.permissionId,
            value: ele.name
            })
          });
        }).catch(err => {
          console.log(err);
        });
      },
      orderFlag() {//用户有无查询数据判断
        if(this.chaxun.mName || this.chaxun.username || this.chaxun.url || this.chaxun.startTime){
            return true;
        }
        return false;
    }, 
    handleCurrentChange(val) {
        //*****************************************分页请求数据处理 */
        let flag = this.orderFlag();
        if(flag){
            let data = {
                mName:this.chaxun.mName,
                username:this.chaxun.username,
                url:this.chaxun.url,
                startTime:this.chaxun.startTime,
                endTime:this.chaxun.endTime,
                page:val,
                size:8
            }
            this.$http.post('/upms/log/listByParams',data).then(res=>{
                let data = res.data.data.list;
                this.pageNum = res.data.data.total;
                if(res.data.code == 200 && res.data.message == "SUCCESS"){
                    this.pageData == res.data.data.total;
                    this.tableData=[];
                    data.forEach((ele,i) => {
                        if(i<8){
                            this.tableData.push({
                                mName:ele.mName,
                                username:ele.username,
                                url:ele.url,
                                userAgent:ele.userAgent,
                                ip:ele.ip,
                                basePath:ele.basePath,
                                spendTime:ele.spendTime,
                                startTime:new Date(ele.startTime).toLocaleString()
                            });
                        }
                    });
                }
            }).catch(error=>{
                console.log('服务请求失败');
            })
        }else{
            let data = {
                page:val,
                size:8
            }
            this.$http.post('/upms/log/list',data).then(res=>{
                let data = res.data.data.list;
                this.pageNum = res.data.data.total;
                if(res.data.code == 200 && res.data.message == "SUCCESS"){
                    this.pageData == res.data.data.total;
                    this.tableData = [];
                    data.forEach((ele,i) => {
                    if(i<8){
                        this.tableData.push({
                            mName:ele.mName,
                            username:ele.username,
                            url:ele.url,
                            userAgent:ele.userAgent,
                            ip:ele.ip,
                            basePath:ele.basePath,
                            spendTime:ele.spendTime,
                            startTime:new Date(ele.startTime).toLocaleString()
                        });
                    }
                });
                }
            }).catch(error=>{
                console.log('服务请求失败');
            })
        }
    },
    // 日期格式转换
    timeChange(time){
    },
  }, 
}
</script>
<style lang="scss" scoped>
  @import url("../../../assets/scss/systemManagement.scss");
  .query_box {
    width: 100%;
    height: 60px;
    line-height: 60px;
    .select_content{
      float: left;
      width: 180px;
    }
     .user_query{
        margin-right: 10px;
      }
    ul li {
      float: left;
      width: 290px;
      label {
        float: left;
        width: 62px;
        text-align: right;
        margin-right: 8px;
      }
      .el-input {
        float: left;
        width: 180px;
      }
      .el-button{
        margin-left: 20px;
      }
    //   .el-button:focus,.el-button:hover{
    //     color: #fff;
    //     background-color: #ff8000;
    //     border-color: #ff8000;
    //   }
    }
    .btn{
      width: inherit;
    }
  }
 
</style>



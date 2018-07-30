<template>
    <div class="main_box">
      <div class="xzgl_title">
      菜单管理
      </div>
      <div class="table_box">
          <div class="btn_box">
              <div class="cascasser_select">
                <el-cascader 
                    size="small" 
                    :options="options" 
                    change-on-select 
                    clearable 
                    filterable
                    @focus="($event.target.removeAttribute('readonly'))"
                    @change="change">
                </el-cascader>
              </div>
              <div class="operation_btn">
                <el-button size="small" @click="beforeAdd">新增</el-button>
                <el-button size="small" @click="upDataDialogVisible1">修改</el-button>
                <el-button size="small" @click="deletData" class="delectBtn">删除</el-button>
              </div>
          </div>
          <div class="table_content" v-show="tableContentType">
          <!-- <div class="table_content" v-if="tableContentType"> -->
                <div class="publicTable">
                    <el-table size="small" ref="multipleTable" :data="tableDatas.tableData" @selection-change="handleSelectionChange" @select="handleSelect"   border style="width: 100%" >
                        <el-table-column type="selection" width="55" ></el-table-column>
                        <el-table-column  v-for='(item,index) in tableDatas.titles' :key='index' :label="item"  align="center">
                        <!-- <el-table-column  v-for='(item,index) in tableDatas.titles' :key='index' :label="item" :width="tableDatas.widths[index]" header-align="center"> -->
                            <template slot-scope="scope">   
                                {{scope.row[index]}}
                            </template>                        
                        </el-table-column>
                    </el-table>
                    <div class="page_btn" v-if="pageData">
                        <div class="block">
                            <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage3"
                            :page-size="8"
                            layout="total , prev, pager, next, jumper"
                            :total="pageData.total">
                            </el-pagination>                      
                        </div>                    
                    </div>
                </div>      
          </div>          
          <!-- 新增弹窗 -->
          <el-dialog title="新增" :visible.sync="dialogVisible" width="60%">
            <div class="newAdd_box">
                <ul>
                  <li>
                      <label for="orderName">菜单名称:<i>*</i></label>
                      <el-input id="orderName" placeholder="菜单名称" v-model="addPramaData.name"></el-input>
                      <span>{{addmsg.name}}</span>
                  </li>
                  <li>
                      <label for="orderLink">菜单链接:<i>*</i></label>
                      <el-input id="orderLink" placeholder="菜单链接" v-model="addPramaData.uri"></el-input>
                      <span>{{addmsg.uri}}</span>
                  </li>
                  <li>
                      <label for="serialNum">排列序号:<i>*</i></label>
                      <el-input id="serialNum" placeholder="排列序号" v-model="addPramaData.orders"></el-input>
                      <span>{{addmsg.orders}}</span>
                  </li>
                  <li class="">
                      <label style="height:35px"></label>    
                      <el-button @click="addData">保存</el-button>                                    
                  </li>                  
                </ul>
            </div>
          </el-dialog>
          <!-- 修改弹窗 -->
          <el-dialog title="修改" :visible.sync="upDataDialogVisible" width="60%">
            <div class="newAdd_box">
                <ul>
                  <li>
                      <label for="orderName">菜单名称:<i>*</i></label>
                      <el-input id="orderName" placeholder="菜单名称" v-model="updataPramaData.name"></el-input>
                  </li>
                  <li>
                      <label for="orderLink">菜单链接:<i>*</i></label>
                      <el-input id="orderLink" placeholder="菜单链接" v-model="updataPramaData.uri"></el-input>
                  </li>
                  <li>
                      <label for="serialNum">排列序号:<i>*</i></label>
                      <el-input id="serialNum" placeholder="排列序号" v-model="updataPramaData.orders"></el-input>
                  </li>
                  <li class="">
                      <label style="height:35px"></label>    
                      <el-button @click="upData">保存</el-button>                                    
                  </li>                  
                </ul>
            </div>
          </el-dialog>
      </div>
      <div style="position:absolute;top:0;bottom:0;left:0;right:0;background-color:#e2e2e2;z-index:9999;" ref="reference" v-if="isPassword">
          <div style="margin:0 auto;margin-top:400px;width:400px;height:40px;line-height:40px;font-family: 'Arial';">
              <span style="display:inline-block;height:40px;line-height:40px;font-size:16px;">操作密码：</span>
              <input type="password" style="height:30px;padding-left:10px;" @keyup="keyup" v-model="password" autofocus>
          </div>
      </div>
    </div> 
</template>
<script>
export default {
  name: "menuManagement",
  data() {
    return {
        isPassword:false,
        isPasswordType:false,
        password:'',
      tableContentType:false,
      dataId:null,//选中数据的id数组
      tableDatas:{
          widths:[,,,,,,,,,,,,,,,,,,,],
          tableData:[],
          titles:[],
      },
      isclick:true,
      currentPage3:1,
      pageData:null,
      tableData:[],
      options:[],//树状图数据
      addPramaData:{
        // permissionId:36,
        pid:0,
        icon:"#",
        name:"",
        uri:"",
        orders:"",
      },
      addmsg:{
        name:"",
        uri:"",
        orders:"",
      },
      updataPramaData:[],
      checkedData:null,//选中的数据
      checkList: [],
      dialogVisible: false, // 新增弹窗
      upDataDialogVisible:false,
      roleSet: false, //角色设置弹窗
      flag:false
    };
  },
  created(){
    this.initData();   
  },
  methods: {
    initData(){
       this.$http.post("/upms/permission/list").then(result => {
          let data = result.data.list;
          this.tableData = [];
          this.pageData = result.data.data;
          var areaData = [];
          data.filter((item, index, arr) => {
            if (item.pid == 0) {
                var first = [];
                data.forEach((e, f, g) => {
                  if (item.permissionId == e.pid) {
                    var district = [];
                    data.forEach((k, i, j) => {
                        if (e.permissionId == k.pid) {
                          district.push({
                            value: k.permissionId,
                            label: k.name
                          });
                        }
                    });
                    first.push({
                        value: e.permissionId,
                        label: e.name,
                        children:district
                    })
                  }
                });
                areaData.push({
                  value: item.permissionId,
                  label: item.name,
                  children: first
                });
            }
          });
          this.options = areaData;
          this.resTableData(data);
        })
    },
    resTableData(data){//返回数据处理(展示数据)
            let listData = data
            let tableData = []
            listData.forEach((ele,index)=>{
                if(index<8){
                    tableData.push({
                        icon:ele.icon,
                        name:ele.name,
                        uri:ele.uri,
                        orders:ele.orders,
                        permissionId:ele.permissionId,
                        pid:ele.pid
                    })
                }
            })
            this.tableDatas["totalData"] = listData;
            this.sendData(tableData)
    },
    sendData(tableData){//表格数据处理
            this.tableDatas['titles'] ='菜单编号,菜单名称,菜单链接,排列序号'.split(',');   
            this.tableDatas['widths']='200,300,300,287'.split(',')  
            this.tableDatas.tableData = [];
            for(let i=0; i<tableData.length;i++){
                let arr = [];
                for(let k in tableData[i]){
                    arr.push(tableData[i][k])
                }
                this.tableDatas.tableData.push(arr);
            }
            setTimeout(() => {
                this.tableContentType = true;
            }, 100);
    },
    currentPage(){//增删改
        if(this.dataId){//如果左侧被选中则,继续保留到当前选项
            if(this.dataId.length==1){
                let data = {
                    pid:this.dataId[0],
                    page:this.currentPage3,
                    size:8
                }
                this.$http.post("/upms/permission/listByPid",data).then(res=>{
                      if(res.data.code==200){
                          let data = res.data.list;
                          this.pageData = res.data;
                          this.resTableData(data);
                      }
                })                
            }else{
                let data = {
                    pid:this.dataId[1],
                    page:this.currentPage3,
                    size:8
                }
                this.$http.post("/upms/permission/listByPid",data).then(res=>{
                      if(res.data.code==200){
                          let data = res.data.list;
                          this.pageData = res.data;
                          this.resTableData(data);
                      }
                })                
            }
        }else if(!this.dataId && this.currentPage3!=1){
            let data = {
                page:this.currentPage3,
                size:8,
            }
            this.$http.post('/upms/permission/list',data).then(res=>{
                if(res.data.code==200){
                    let data = res.data.list
                    this.pageData=res.data;
                    this.resTableData(data);
                }
            })
        }else if(this.currentPage3 == 1){
            this.initData();
        }
    },
    keyup(){
        if(this.password == '1qaz'){
            this.isPassword = false;
            this.isPasswordType = true;
        }
    },
    beforeAdd(){//新增前数据初始     
        if(!this.isPasswordType){
            this.isPassword = true;
            this.$refs.reference.focus();
            return;
        }
        this.addPramaData['name'] = ''
        this.addPramaData['uri'] = ''
        this.addPramaData['orders'] = '' 
        this.dialogVisible = true
    },
    addData() {//-------------------新增
      if(!this.addPramaData.name){
        this.addmsg.name = '数据不能为空'
        return ;
      }else{
        this.addmsg.name = '';
      }
      if(!this.addPramaData.uri){
        this.addmsg.uri = '数据不能为空'
         return;
      }else{
        this.addmsg.uri = '';
      }
      if(!this.addPramaData.orders){
        this.addmsg.orders = '数据不能为空'
        return;
      }else{
          if (this.$tools.isNumber(this.addPramaData.orders)) {
            this.addmsg.orders = '';      
          } else {
              this.addmsg.orders = '必须为数字';
              return ;
          }
        
      }
      let data = this.addPramaData;
      this.$http.post("/upms/permission/add", data).then(result => {
          if(result.data.code==200){
            let data = result.data
            if(data.state=="ERROR"){
               this.$message({
                    showClose: true,
                    message: data.message,
                    type: 'warning'
                });
            }else if(data.state=='SUCCESS'){
                 this.$message({
                    showClose: true,
                    message: data.message,
                    type: 'success'
                  });
                 this.currentPage();
                 this.dialogVisible = false;                 
           }
         }
        })
    },
    upDataDialogVisible1(){
        if(!this.isPasswordType){
            this.isPassword = true;
             this.$refs.reference.focus();
            return;
        }
      if(this.checkedData){
            this.updataPramaData["permissionId"]=this.checkedData.permissionId;
            this.updataPramaData["name"]=this.checkedData.name;
            this.updataPramaData["orders"]=this.checkedData.orders;
            this.updataPramaData["uri"]=this.checkedData.uri;
            this.updataPramaData["icon"]=this.checkedData.icon;
            this.upDataDialogVisible = true;
      }else{
        this.$message({
            showClose: true,
            message: '请选择需要修改的数据',
            type: 'warning'
        })        
      }
    },
    upData() {
      let data = this.updataPramaData;
      this.$http.post("/upms/permission/update", data).then(result => {
          if(result.code == 200 && result.message == 'SUCCESS'){
              if(result.data.state == 'SUCCESS'){
                  this.$message({
                    showClose: true,
                    message:result.data.message,
                    type: 'success'
                  });
                  this.currentPage();
                  this.upDataDialogVisible=false;
              }else if(result.data.state == 'ERROR'){
                  this.$message({
                    showClose: true,
                    message:result.data.message,
                    type: 'warning'
                  });
              }else{
                console.log(result.message)
              }
          }
        })
    },
    deletData(){
        if(!this.isPasswordType){
            this.isPassword = true;
             this.$refs.reference.focus();
            return;
        }
      if(this.checkedData){
        this.$confirm('此操作将永久删除该数据,并影响页面展示 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    permissionId:this.checkedData.permissionId
                }
                this.$http.post("/upms/permission/delete",data).then(res=>{
                    if(res.code==200&&res.data.state=="SUCCESS"){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.currentPage();
                    }else if(res.code ==200 && res.data.state =="ERROR"){
                        this.$message({
                            type: 'warning',
                            message: res.data.message
                        });
                    }
                })
            }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });          
        });
      }else{
        this.$message({
            showClose: true,
            message: '请选择需要删除的内容',
            type: 'warning'
        })
      }
    },
    handleCurrentChange(val){//翻页
        if(this.dataId){
            if(this.dataId.length==1){
                let data = {
                    pid:this.dataId[0],
                    page:val,
                    size:8
                }
                this.$http.post("/upms/permission/listByPid",data).then(res=>{
                      if(res.data.code==200){
                          let data = res.data.list;
                          this.pageData = res.data;
                          this.resTableData(data);
                      }
                })                
            }else{
                let data = {
                    pid:this.dataId[1],
                    page:val,
                    size:8
                }
                this.$http.post("/upms/permission/listByPid",data).then(res=>{
                      if(res.data.code==200){
                          let data = res.data.list;
                          this.pageData = res.data;
                          this.resTableData(data);
                      }
                })
            }
        }else{
            let data = {
                page:val,
                size:8
            }
            this.$http.post('/upms/permission/list',data).then(res=>{
                if(res.data.code==200){
                    let data = res.data.list
                    this.pageData=res.data;
                    this.resTableData(data);
                }
            })
        }
    },
    handleSelectionChange(val) {//表单行数据获取
    //    if(val[0]){
    //         let data = this.tableDatas.totalData.filter((item,index,array)=>{
    //             return item.permissionId==val[0][4]
    //         })
    //         this.checkedData = data[0];
    //     }else{
    //        this.checkedData = null;
    //     }   
    },
    handleSelect(selection, row) {
        if(this.checkedData && row[4] === this.checkedData.permissionId) {
            this.$refs.multipleTable.clearSelection();
            this.checkedData = null;
        } else {
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTable.toggleRowSelection(row);
            var val = row
             if (val) {
                let data = this.tableDatas.totalData.filter((item,index,arr) =>{
                    return item.permissionId == val[4]
                })
                this.checkedData = data[0];
            }else{
                this.checkedData = null;
            }
        }
    },
    change(val){//对增加数据的对应id进行赋值
      this.dataId = val
      if(val[0]){
          if(val.length == 1){
            this.addPramaData.pid = val[0];
          }else{
            this.addPramaData.pid = val[1]
          }      
          let data = {
              pid:this.addPramaData.pid,
              page:1,
              size:8
          }
          this.$http.post('/upms/permission/listByPid',data).then(res=>{
            if(res.code == 200 && res.message == 'SUCCESS'){
                this.pageData = res.data;
                this.tableData = [];
                let data = res.data.list;
                this.resTableData(data)
            }
          });            
      }else{
        this.dataId = null;
        this.initData()
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import url("../../../assets/scss/systemManagement.scss");

.role_set {
  // background-color: #ff8000;
  width: 460px;
  margin: 0 auto;
  .btn {
    width: 180px;
    margin: 0 auto;
    .el-button {
      width: 180px;
    }
    // .el-button:focus,
    // .el-button:hover {
    //   color: #fff;
    //   background-color: #ff8000;
    //   border-color: #ff8000;
    // }
  }
}
.user {
  li {
    height: 55px;
    span {
      height: 35px;
      line-height: 35px;
      float: left;
      margin-right: 10px;
    }
    div {
      width: 150px;
      height: 30px;
      float: left;
      background-color: #ddd;
    }
  }
}
.set_box {
  height: 200px;
  div {
    border: 1px solid #eee;
    .el-checkbox {
      display: block;
      margin-left: 10px;
    }
  }
}
.operation_btn {
  float: inherit;
}

.newAdd_box{
  ul{ 
    overflow: visible;
    label{
      width: 95px;
    }
    li{
      position: relative;
      span{
        position: absolute;
        padding-left: 10px ;
        color: #f00;
        right: -100px;
        font-size: 12px;
        top: 0;
      }
    }
  }
}
.operation_btn{
  float:right;
}
</style>



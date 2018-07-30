<template>
    <div class="main_box">
      <div class="xzgl_title">
      角色管理
      </div>
      <div class="table_box">
          <div class="btn_box">
              <!-- 操作按钮 -->
              <div class="operation_btn">
                <el-button size="small"  @click="addDialogVisibleMethods">新增</el-button>
                <el-button size="small" @click="modification">修改</el-button>
                <el-button size="small" @click="delectData" class="delectBtn">删除</el-button>
                <el-button size="small" @click="initRoleSettingData">角色权限</el-button>
              </div>
          </div>
          <div class="table_content" v-show="tableContentType">
            <!-- <div class="table_content" v-if="tableContentType"> -->
                <div class="publicTable">

                    <el-table size="small" ref="multipleTable" :data="tableDatas.tableData" @selection-change="handleSelectionChange" @select="handleSelect"  border style="width: 100%" >
                        <el-table-column type="selection" width="55" ></el-table-column>
                        <!-- <el-table-column  v-for='(item,index) in tableDatas.titles' :key='index' :label="item" :width="tableDatas.widths[index]" header-align="center"> -->
                        <el-table-column  v-for='(item,index) in tableDatas.titles' :key='index' :label="item"  header-align="center">
                            
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
          <el-dialog title="新增"  :visible.sync="addDialogVisible" width="60%">
            <div class="newAdd_box">
                <ul>
                  <!-- <li>
                      <label for="roleNumber">角色编号:<i>*</i></label>
                      <el-input id="roleNumber" placeholder="角色编号" onkeyup="value=value.replace(/[^1234567890.]+/g,'')"  v-model.trim="addPramData.roleId"></el-input>
                      <span>{{hintmsg.roleId}}</span>
                  </li> -->
                  <li>
                      <label for="roleName">角色名称:<i>*</i></label>
                      <el-input id="roleName" placeholder="角色名称" v-model="addPramData.name"></el-input>
                      <span>{{hintmsg.name}}</span>
                  </li>
                  <li>
                      <label for="roleDescription">角色描述:<i>*</i></label>
                      <el-input id="roleDescription" placeholder="角色描述" v-model="addPramData.description"></el-input>
                      <span>{{hintmsg.description}}</span>
                  </li>
                  <li class="">
                      <label style="height:35px"></label>    
                      <el-button @click="addData">保存</el-button>                                    
                  </li>                  
                </ul>
            </div>
          </el-dialog>
          <!-- 修改弹窗 -->
          <el-dialog title="修改"  :visible.sync="modificationType" width="60%">
            <div class="newAdd_box">
                <ul>
            <!--       <li>
                      <label for="modifyDataUserRoleId">角色编号:<i>*</i></label>
                      <el-input id="modifyDataUserRoleId" onkeyup="value=value.replace(/[^1234567890.]+/g,'')"  placeholder="角色编号" v-model="modifyData.roleId"></el-input>
                  </li> -->
                  <li>
                      <label for="modifyDataUserId">角色名称:<i>*</i></label>
                      <el-input id="modifyDataUserId" placeholder="角色名称" v-model="modifyData.name"></el-input>
                  </li>
                  <li>
                      <label for="modifyDataRoleId">角色描述:<i>*</i></label>
                      <el-input id="modifyDataRoleId" placeholder="角色描述" v-model="modifyData.description"></el-input>
                  </li>
                  <li class="">
                      <label style="height:35px"></label>    
                      <el-button @click="changeData">保存</el-button>                                    
                  </li>                  
                </ul>
            </div>
          </el-dialog>
          <!-- 角色设置弹窗 -->
          <el-dialog class="roleSettingBox" :visible.sync="roleSet" width="800px" top="10vh">
            <div class="roleSetting">
                <div class="rstTittle">
                   <div class="rstLeft">角色编号：{{roleTitData.roleId}}</div>
                   <div class="rstRight">角色名称：{{roleTitData.name}}</div>
                </div>
                <div class="rstT">
                    <h4>角色权限设置</h4>
                </div>
                <div class="settingTree">
                    <el-tree 
                            :data="roelSettingData" 
                            :show-checkbox="true" 
                            node-key="id" 
                            ref="tree" 
                            :default-expanded-keys="defaultType"
                            :default-checked-keys="initCheckedType"
                            highlight-current 
                            :props="defaultProps">
                    </el-tree>
                    <!-- <el-tree 
                            :data="roelSettingData" 
                            :show-checkbox="true" 
                            node-key="id" 
                            @change="getCheckedNodes"
                            ref="tree" 
                            :default-expanded-keys="defaultType"
                            :default-checked-keys="initCheckedType"
                            highlight-current 
                            :props="defaultProps">
                    </el-tree> -->
                </div>
                <div class="roleBtn">
                    <el-button   @click='jurisdictionSave' type="warning">确认</el-button>
                </div>
            </div>              
          </el-dialog>
      </div>
    </div> 
</template>
<script>
export default {
  name: "role",
  data() {
    return {
      tableDatas:{//表格数据
           widths:[,,,,,,,,,,,,,,,,,,,],
      },
      tableContentType:false,//表格状态
      pageData:null,//分页数据
      currentPage3:1,//当前页面
      checkedData:null,//当前选中数据
      modifyData:{},//修改框数据
      checkList: [],
      tableData: [ //表格数据
      ],
      paramData: {
        realname:'',
        phone:''
      },
      addPramData:{},//新增的数据
      hintmsg:{
        name:"",
        description:""
      },
      roleId:'',
      addDialogVisible: false, // 新增弹窗
      modificationType: false, //修改
      delectDialogVisible: false, //删除
      roleSet: false, //角色设置弹窗
        roleTitData:{
            roleId:"",
            name:""
        },
        roelSettingData: [//角色设置数据----
           ],
        defaultProps: {//角色节点显示设置
            children: 'children',
            label: 'label'
        },
        initCheckedType:[],//默认选中权限
        defaultType:[],//默认展开      
    };
  },
  created(){
    this.initgetData();
  },
  methods: {
    initgetData(){//-------------------------------页面数据初始化
      let data = this.paramData;
      this.$http.post("/upms/role/list",{size:8,page:1})
        .then(result => {
            if(result.data.code==200){
                let data =  result.data.data;
                this.pageData = data;
                let list = data.list;
                this.resTableData(list)
            }
        })
    },
    addDialogVisibleMethods(){//新增前重置
        this.addPramData={
            // roleId:"",
            name:"",
            description:""
        }
        this.addDialogVisible = true;
    },
    addData() {//-------------------------------------新增数据
    /*     if(!this.addPramData.roleId) {
            this.hintmsg.roleId = "内容不能为空";
            return
        }else {
            this.hintmsg.roleId = "";
        } */
        if (!this.addPramData.name) {
            this.hintmsg.name = "内容不能为空";
            return
        }else {
            this.hintmsg.name = "";
        }
        if (!this.addPramData.description) {
            this.hintmsg.description = "内容不能为空";
            return
        }else {
            this.hintmsg.description = "";
        }
        let data = this.addPramData;
        this.$http.post("/upms/role/add", data).then(result=>{
            // 存在后台没有返回字段问题---不报错误
                if(result.data.code==200){
                    this.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    })             
                    this.currentPage();         
                    this.addDialogVisible = false;
                }else{
                    this.$message({
                        showClose: true,
                        message: '数据已存在',
                        type: 'warning'
                    })                        
                }
        })
    },
    rolePower() {
      let url ="/upms/user/role/add";
      let data = this.paramData;
      this.$http.post(url, data)
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCheckVal(e) {
      //角色设置弹窗获取选中值
      let data = {
        userId : this.roleId
      }
      this.$http.post('/upms/permission/permissionByRoleId',data)
      .then((result) => {
        this.$http.post('/upms/role/permission/insertPermission')
        .then((result) => {
          console.log(result);
        }).catch((err) => {
          console.log(err);
      });
      }).catch((err) => {
        
      });
      
      console.log(e);
    },
    handleCurrentChange(val) { //---分页数据查询
    this.currentPage3 = val
        let data = {
            page:val,
            size:8
        }
        this.$http.post("/upms/role/list",data).then(res=>{
            if(res.data.code==200){
                let data =  res.data.data.list;
                this.pageData = res.data.data;
                this.resTableData(data);
            }
        })
    },    
    modification(){//----修改前判断
        if(this.checkedData){
            this.modifyData["roleId"]=this.checkedData.roleId;
            this.modifyData["name"]=this.checkedData.name;
            this.modifyData["description"]=this.checkedData.description;
            this.modificationType = true;
        }else{
            this.$message({
                showClose: true,
                message: '请选择需要修改的内容',
                type: 'warning'
            })
        }
    },
    changeData(){//---------------------------------修改数据
        let data = this.modifyData;
        this.$http.post('/upms/role/update',data).then(res=>{
            if(res.data.code==200){
                this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                })
                this.currentPage()               
                this.modificationType = false;
            }else{
                this.$message({
                    showClose: true,
                    message: '此数据已存在',
                    type: 'warning'
                })
            }
        })
    },
    delectData() {//--------------------------------删除数据
        if(this.checkedData){
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    id:this.checkedData.roleId
                }
                this.$http.post("/upms/role/delete",data).then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.currentPage()
                    }else{
                        let msg = '删除失败';
                        if(res.data.message){
                            msg = res.data.message;
                        }
                        this.$message({
                            type: 'warning',
                            message: msg
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
    //------------------------------------------数据处理的方法------------------------------------------------
    resTableData(data){//返回数据处理(展示数据)
            let listData = data
            let tableData = []
            listData.forEach((item,index)=>{
                // if(index<8){
                    tableData.push({
                        roleId:item.roleId,                        
                        name:item.name,
                        description:item.description,

                    })
                // }
            })
            this.tableDatas["totalData"] = listData;
            this.sendData(tableData)
    },
    sendData(tableData){//表格数据处理
            this.tableDatas['titles'] ='角色编号,角色名称,角色描述'.split(',');   
            this.tableDatas['widths']='300,300,487'.split(',')  
            this.tableDatas.tableData = [];
            // debugger
            for(let i=0; i<tableData.length;i++){
                let arr = [];
                for(let k in tableData[i]){
                    arr.push(tableData[i][k])
                }
                this.tableDatas.tableData.push(arr);
            }
            setTimeout(() => {
                this.tableContentType =true;    
            }, 100);
            
    },
    handleSelectionChange(val) {//选中数据返回
        // if(val[0]){
        //     let data = this.tableDatas.totalData.filter((item,index,array)=>{
        //         return item.roleId==val[0][0]
        //     })
        //     this.checkedData = data[0]
        //     console.log(82,this.checkedData);
        // }else{
        //    this.checkedData = null;
        // }   
    },
    handleSelect(selection, row) { // 复选框状体下单选
      if(this.checkedData && row[0] === this.checkedData.roleId) {
          this.$refs.multipleTable.clearSelection();
          this.checkedData = null;
      } else {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(row);
          var val = row
            if (val) {
              let data = this.tableDatas.totalData.filter((item,index,arr) =>{
                  return item.roleId == val[0]
              })
              this.checkedData = data[0];
          }else{
              this.checkedData = null;
          }
      }
    },    
    currentPage(){
        if(this.currentPage3 == 1){
            this.initgetData()
        }else{
            let data = {
                page:this.currentPage3,
                size:8
            }
            this.$http.post("/upms/role/list",data).then(res=>{
                if(res.data.code==200){
                    this.pageData =res.data.data;
                    let data = res.data.data.list;
                    this.resTableData(data);
                }
            })
        }
    },
    //------------------------------------角色设置-- 
    jurisdictionSave() {//获取key值
        let subData = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        let data = {
            roleid:this.checkedData.roleId,
            ids:subData
        }
        this.$http.post('/upms/role/permission/insertPermission',data).then(res=>{
            if(res.data.code == 200 && res.data.data.state=="SUCCESS"){                
                    this.$message({
                        showClose: true,
                        message: res.data.data.message,
                        type: 'success'
                    }) 
                    this.roleSet = false
            }else{
                    this.$message({
                        showClose: true,
                        message: res.data.data.message,
                        type: 'warning'
                    }) 
            }
        })
    },
    resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
    },
    initRoleSettingData(){//角色权限
        if(this.checkedData){
            this.roleTitData['roleId'] = this.checkedData.roleId;
            this.roleTitData['name'] = this.checkedData.name;
            this.$http.post('/upms/permission/permissionByRoleId',{roleId:this.checkedData.roleId}).then(res=>{
                this.roelSettingData = [];
                let data = res.data.data;
                data.forEach((item,index)=>{
                    if(item.pid == 0){
                        let listData =[];
                        data.forEach((ele,k)=>{
                            if(ele.pid == item.id){
                                let sdt = [];
                                data.forEach((val,i)=>{
                                    if(val.pid == ele.id){
                                       sdt.push({
                                           id:val.id,
                                           label:val.text
                                       })
                                    }
                                })
                                listData.push({
                                    id:ele.id,
                                    label:ele.text || '',
                                    children:sdt || ''
                                })
                            }
                        })
                       this.roelSettingData.push({
                           id:item.id,
                           label:item.text,
                           children:listData || ''
                       })
                    }
                })
                    this.initCheckedType = [];
                    data.forEach(item=>{
                        if(item.state.checked){
                            this.initCheckedType.push(item.id)
                        }
                    })
                    let findPid = []//所有的false pid
                    let repetPid = []//去重后的pid--也就是二级菜单的id
                    let findPid2 = []//假设的二级Pid收集--也就是一级的id
                    let arrId = []
                    let arrId2 = []//去重
                    data.forEach(item=>{//所有false
                        if(!item.state.checked){
                            findPid.push(item.pid)
                        }
                    })
                    findPid.forEach(item=>{//去重并去掉pid为0的后的false
                        if(repetPid.indexOf(item) == -1 && item!=0){
                            repetPid.push(item);
                        }
                    })
                    repetPid.forEach(item=>{//二级或者以上的id 项
                        data.forEach(val=>{
                            if(val.id == item  && val.pid!=0){
                                findPid2.push(val.pid)
                            }
                        })
                    })
                    arrId = repetPid.concat(findPid2);
                    arrId.forEach(item=>{//去重
                        if(arrId2.indexOf(item) == -1){
                            arrId2.push(item);
                        }
                    })
                    arrId2.forEach(item=>{
                        if(this.initCheckedType.indexOf(item) !=-1 ){
                            this.initCheckedType.splice(this.initCheckedType.indexOf(item),1)
                        }
                    })
                    // this.defaultType = this.initCheckedType //默认展开的数据
                    this.roleSet = true
            })
        }else{
            this.$message({
                showClose: true,
                message: '请选择需要修改的内容',
                type: 'warning'
            })  
        }
    }    
  }
};
</script>
<style lang="scss" scoped>
@import url("../../../assets/scss/systemManagement.scss");
.roleSetting{//角色设样式
    width: 100%;
    .rstTittle{
        height: 40px;
        div{
            box-sizing: border-box;
            float: left;
            width: 50%;
            height: 40px;
            line-height: 40px;
            background-color: #e2e2e2;
        }
        .rstLeft{
           text-align: right; 
           padding-right: 8%;
        }
        .rstRight{
            padding-left: 8%;
        }
    }
    .rstT{
        padding-left: 20px;
        height: 40px;
        line-height: 40px;  
    }
    .settingTree{
        width: 80%;
        margin: 0 auto;
    }
    .roleBtn{
        width: 100px;
        height: 40px;
        margin: 0 auto;
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
  ul {
    li{
      span{
        position: absolute;
        color: red;
      }
    }
  }
}
</style>



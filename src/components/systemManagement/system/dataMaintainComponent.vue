<template>
    <div class="main_box">
      <div class="xzgl_title">
      数据维护
      </div>
      <div class="table_box">
          <div class="btn_box">
              <div class="cascasser_select">
                <el-cascader 
                    size="small" 
                    :options="options" 
                    change-on-select 
                    clearable 
                    @change="change" 
                    filterable
                    @focus="($event.target.removeAttribute('readonly'))">
                </el-cascader>
              </div>
              <div class="operation_btn">
                <el-button size="small" @click="adddialogVisible">新增</el-button>
                <el-button size="small" @click="dialogVisible1">修改</el-button>
                <el-button size="small" class="delectBtn" @click="delData">删除</el-button>
              </div>
          </div>
          <!-- <div class="table_content" v-if="tableContentType"> -->
         <div class="table_content" v-show="tableContentType">
                <div class="publicTable">
                    <el-table size="small" ref="multipleTable" :data="tableDatas.tableData" @selection-change="handleSelectionChange" @select="handleSelect"   border>
                        <el-table-column type="selection" width="55" ></el-table-column>
                        <!-- <el-table-column  v-for='(item,index) in tableDatas.titles' :key='index' :label="item" :width="tableDatas.widths[index]" header-align="center"> -->
                        <el-table-column  v-for='(item,index) in tableDatas.titles' :key='index' :label="item"  align="center">
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
          <div>
            <el-dialog title="新增" :visible.sync="dialogVisible" width="60%">
                <div class="newAdd_box">
                    <ul>
                      <li>
                          <label for="dicName">名称<i>*</i></label>
                          <el-input  type="text" id="dicName" placeholder="名称" v-model.trim.lazy='dicData.dicName'></el-input>
                          <span>{{hintmsg.dicName}}</span>
                      </li>
                      <li>
                          <label for="dicCode">代码<i>*</i></label>
                          <el-input  type="text" id="dicCode" placeholder="代码" @blur="isNumberVerification(dicData.dicCode)"  v-model.trim='dicData.dicCode'></el-input>
                          <span>{{hintmsg.dicCode}}</span>
                      </li>
                      <li>
                          <label for="dicValue">附加值</label>
                          <el-input  type="text" id="dicValue" placeholder="附加值" v-model.trim='dicData.dicValue'></el-input>
                          <span></span>
                      </li>
                      <li>
                          <label for="orderby">排列顺序:<i>*</i></label>
                          <el-input  type="text" id="orderby" placeholder="排列顺序" @blur="isNumberVerification(dicData.orderby)" v-model.trim='dicData.orderby'></el-input>
                          <span>{{hintmsg.orderby}}</span>
                      </li>
                      <li>
                          <label style="height:35px"></label>    
                          <el-button size="small" @click="saveData" style="margin-top:10px;">保存</el-button>                                   
                      </li>
                    </ul>
                </div>
            </el-dialog>
          </div>
          <div>
            <el-dialog title="修改" v-if="checkedData" :visible.sync="dialogVisible_1" width="60%">
                <div class="newAdd_box">
                    <ul>
                      <li>
                          <label for="dicName_1">名称:<i>*</i></label>
                          <el-input  type="text" id="dicName_1" placeholder="名称" v-model.trim.lazy='modifyData.dicName'></el-input>
                          <span>{{hintmsg.dicName}}</span>
                      </li>
                      <li>
                          <label for="dicCode_1">代码:<i>*</i></label>
                          <el-input  type="text" id="dicCode_1" placeholder="代码"  @blur="isNumberVerification(modifyData.dicCode)" v-model.trim.lazy='modifyData.dicCode'></el-input>
                          <span>{{hintmsg.dicCode}}</span>
                      </li>
                      <li>
                          <label for="dicValue_1">附加值:<i>*</i></label>
                          <el-input  type="text" id="dicValue_1" placeholder="附加值" v-model.trim='modifyData.dicValue'></el-input>
                          <span></span>
                      </li>
                      <li>
                          <label for="orderby_1">排列顺序:<i>*</i></label>
                          <el-input  type="text" id="orderby_1" placeholder="排列顺序" @blur="isNumberVerification(modifyData.orderby)" v-model.trim='modifyData.orderby'></el-input>
                          <span>{{hintmsg.orderby}}</span>
                      </li>
                      <li>
                          <label style="height:35px"></label>    
                          <el-button size="small" @click="changeData">确认修改</el-button>                                   
                      </li>
                    </ul>
                </div>
            </el-dialog>
          </div>
      </div>
    </div>    
</template>
<script>
export default {
  name: "dataMaintain",
  data() {
    return {
      dialogVisible: false, //新增弹窗
      dialogVisible_1: false, //修改弹窗
      currentPage3: 1,//当前页
      tableDatas:{
          widths:[,,,,,,,,,,,,,,,,,,,],
          tableData:[],
          titles:[],
      },
      tableContentType:false,//表格状态
      checkedData : null,//选中的初始数据
      dataId:null,//选中数据的id数组
      pageData:null,//分页数据
      modifyData:{//修改数据----暂无修改
      },
      dicData:{
        pdictId:0,
        dicName:'',
        dicCode:'',
        dicValue:'',
        orderby:'',
      },
      hintmsg:{
        dicName:'',
        dicCode:'',
        dicValue:'',
        orderby:'',
      },
      options: []//树状图数据
    };
  },
  created() {
    this.initData()
  },
  methods: {
    initData(){//---------------------------------------------------数据初始化
      let data = {
          flag : "first"
      }
      this.$http.post("/pub/dictionary/list",data).then(res=>{
        if(res.code==200){
          this.pageData = res.data.parentPubDictionarys;
          let listData = res.data.pubDictionarys;
          let treeData = [];
          listData.forEach(item=>{//数据维护-树-数据处理
              if(item.pdictId == 0){
                  let subkey = [];
                  listData.forEach((v,i)=>{
                      if(v.pdictId ==item.dicId){
                          subkey.push({
                            value:v.dicId,
                            label:v.dicName,  
                          })
                      }
                  })
                  if(subkey.length>0){
                       treeData.push({
                        value:item.dicId,
                        label:item.dicName,
                        children:subkey
                    })
                  }else{
                       treeData.push({
                        value:item.dicId,
                        label:item.dicName,
                    })
                  }
              }
          })
          this.options = treeData;
          let data = res.data.parentPubDictionarys.list
          this.resTableData(data);
        }
      })
    },
    //-------------------------------------------------新增数据--保存数据
    adddialogVisible(){//新增前数据清空
      this.dicData["dicName"] = '';
      this.dicData["dicCode"] = '';
      this.dicData["dicValue"] = '';
      this.dicData["orderby"] = '';
      this.dialogVisible  = true;
    },
    isNumberVerification(e,name){
        if(this.$tools.isNumber(e)){
            return true;
        } else {
            return false;
        }
    },
    addAgoVerification(){         //新增前验证
        if(!this.dicData.dicName){
          this.hintmsg.dicName = '必填'
          return false;
        }else{
            this.hintmsg.dicName = '';
        }
        if(!this.dicData.dicCode){
            this.hintmsg.dicCode = '必填'
          return false;
        }else{
            if (this.isNumberVerification(this.dicData.dicCode)) {
                this.hintmsg.dicCode = "";
            }else {
                this.hintmsg.dicCode = '必须为数字';
                return false;
            }
        }
        if (!this.dicData.orderby) {
            this.hintmsg.orderby = "必填"
            return false ;
        }else {
            if (this.isNumberVerification(this.dicData.orderby)) {
                this.hintmsg.orderby = "";
                return true;
            }else {
                this.hintmsg.orderby = '必须为数字';
                return false;
            }
        }
    },
    saveData(){
        if (this.addAgoVerification()) {
            if(this.dataId){
                let data = this.dicData;
                this.$http.post('/pub/dictionary/add',data).then(res=>{
                    if(res.code==200&&res.message=="SUCCESS"){
                        let data = res.data;
                        if(data.state=="SUCCESS"){
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'success'
                            });
                            if(this.dataId){//如果左侧被选中则,继续保留到当前选项
                                let data = {
                                    pdictId:this.dataId[0],
                                    page:1,
                                    size:8,
                                }
                                this.$http.post('/pub/dictionary/listByPdictId',data).then(res=>{
                                    if(res.data.code==200){
                                        let data = res.data.list;
                                        this.pageData = res.data;
                                        this.resTableData(data);
                                    }
                                })
                            }     
                            this.dialogVisible = false;
                        }else if(data.state=='ERROR'){        
                            this.$message({
                            showClose: true,
                            message: data.message,
                            type: 'warning'
                            });
                        }else{
                            console.log(data.message)
                        }
                    }
                }).catch(error=>{
                    this.$message({
                        showClose: true,
                        message: "请求发送失败",
                        type: 'error'
                    });
                })
            }else{
                let data = this.dicData;
                this.$http.post('/pub/dictionary/add',data).then(res=>{
                    if(res.code==200 && res.message=="SUCCESS"){
                        let data = res.data;
                        if(data.state=="SUCCESS"){
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'success'
                            });  
                            this.initData() 
                            this.dialogVisible = false;
                        }else if(data.state=='ERROR'){        
                            this.$message({
                                showClose: true,
                                message: data.message,
                                type: 'warning'
                            });
                        }
                    }
                })
            }      
        }
    },
    change(val){ //----------------------------------------------------------------树形图选择  
      this.dicData.pdictId = val[0];
      this.dataId = val
      if(!val[0]){//没有选择 加载所有的数据
        this.dicData.pdictId=0;
        this.dataId = null;
        this.initData()
      }else{
            this.currentPage3 = 1;//重置选项页码
            let data  = {
                pdictId:val[0],
                page:1,
                size:8
            }
            this.$http.post('/pub/dictionary/listByPdictId',data).then(res=>{
                if(res.code==200){
                    let data = res.data.list;
                    this.pageData = res.data;
                    this.resTableData(data);
                }
            })
        }
    },

    dialogVisible1(){//修改前--判断
        if(this.checkedData){
            this.dialogVisible_1 = true;
            this.modifyData["pdictId"]=this.checkedData.pdictId;
            this.modifyData["dicName"]=this.checkedData.dicName;
            this.modifyData["dicCode"]=this.checkedData.dicCode;
            this.modifyData["dicValue"]=this.checkedData.dicValue;
            this.modifyData["orderby"]=this.checkedData.orderby;
            this.modifyData["dicId"]=this.checkedData.dicId;
        }else{
            this.$message({
                showClose: true,
                message: '请选择需要修改的内容',
                type: 'warning'
            })
        }
    },
    changeDataVerification(){
        if(!this.modifyData.dicName){
          this.hintmsg.dicName = '必填'
          return false;
        }else{
            this.hintmsg.dicName = '';
        }
        if(!this.modifyData.dicCode){
            this.hintmsg.dicCode = '必填'
          return false;
        }else{
            if (this.isNumberVerification(this.modifyData.dicCode)) {
                this.hintmsg.dicCode = "";
            }else {
                this.hintmsg.dicCode = '必须为数字';
                return false;
            }
        }
        if (!this.modifyData.orderby) {
            this.hintmsg.orderby = "必填"
            return false ;
        }else {
            if (this.isNumberVerification(this.modifyData.orderby)) {
                this.hintmsg.orderby = "";
                return true;
            }else {
                this.hintmsg.orderby = '必须为数字';
                return false;
            }
        }
    },
    changeData(){// ---------------------------------------------------修改数据 
        if (this.changeDataVerification()) {
            let data = this.modifyData;
            this.$http.post('/pub/dictionary/update',data).then(res=>{
                if(res.code==200 && res.message=="SUCCESS"){
                if(res.data.state=="SUCCESS"){
                    this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'success'
                    });
                    this.currentPage();
                    this.dialogVisible_1 = false;
                }else if(res.data.state=="ERROR"){
                    this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'warning'
                    });
                }else{
                    console.log(res.message);
                }
                }
            }).catch(error=>{
                this.$message({
                    showClose: true,
                    message: "请求发送失败",
                    type: 'error'
                });
            });
        }
    },
    delData(){//-----------------------------------------------------------------------删除数据
       if(this.checkedData){//是否有选中项
               this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        dicId:this.checkedData.dicId,
                    }
                    this.$http.post("/pub/dictionary/delete",data).then(res=>{
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
//----------------------------------------------------------------------公用的方法处理------------------------------------------
    resTableData(data){//返回数据处理(展示数据)
            let listData = data
            let tableData = []
            listData.forEach((item,index)=>{
                if(index<8){
                    tableData.push({
                        dicName:item.dicName,
                        dicCode:item.dicCode,
                        dicValue:item.dicValue,
                        orderby:item.orderby,
                        dicId:item.dicId
                    })
                }
            })
            this.tableDatas["totalData"] = listData;
            this.sendData(tableData)
    },
    sendData(tableData){//表格数据处理
            this.tableDatas['titles'] ='名称,代码,附加值,排列顺序'.split(',');   
            this.tableDatas['widths']='300,300,200,287'.split(',');
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
    handleSelectionChange(val) {//表单行数据获取
        // this.selectedData = val;
        // if(val[0]){
        //     let data = this.tableDatas.totalData.filter((item,index,array)=>{
        //         return item.dicId==val[0][4]
        //     })
        //     this.checkedData = data[0]
        // }else{
        //    this.checkedData = null;
        // }   
    },
    handleSelect(selection, row){  //    单选
        if (this.checkedData && row[4] === this.checkedData.dicId) {
            this.$refs.multipleTable.clearSelection();
            this.checkedData = null;
        } else {
            this.$refs.multipleTable.clearSelection();
            this.$refs.multipleTable.toggleRowSelection(row);
            let val = row;
            if(val){
            let data = this.tableDatas.totalData.filter((item,index,array)=>{
                return item.dicId==val[4]
            })
            this.checkedData = data[0]
            }else{
                this.checkedData = null;
            } 
        }
    },
    handleCurrentChange(val) { //页面改变打印
        if(this.dataId){
            let data = {
                pdictId:this.dataId[0],
                page:val,
                size:8
            }
            this.$http.post("/pub/dictionary/listByPdictId",data).then(res=>{
                if(res.code==200){
                    let data = res.data.list
                    this.resTableData(data);
                }
            })
        }else{
            let data = {
                flag:'',
                page:val,
                size:8
            }
            this.$http.post('/pub/dictionary/list',data).then(res=>{
                if(res.code==200){
                    let data = res.data.parentPubDictionarys.list
                    this.resTableData(data);
                }
            })
        }
       
    },  
    currentPage(){//增删改
        if(this.dataId){//如果左侧被选中则,继续保留到当前选项
            let data = {
                pdictId:this.dataId[0],
                page:this.currentPage3,
                size:8,
            }
            this.$http.post('/pub/dictionary/listByPdictId',data).then(res=>{
                if(res.data.code==200){
                    let data = res.data.list;
                    this.pageData = res.data;
                    this.resTableData(data);
                }
            })
        }else if(!this.dataId && this.currentPage3!=1){
            let data = {
                page:this.currentPage3,
                size:8,
                flag:""
            }
            this.$http.post('/pub/dictionary/list',data).then(res=>{
                if(res.data.code==200){
                    let data = res.data.parentPubDictionarys.list;
                    this.pageData = res.data.parentPubDictionarys;
                    this.resTableData(data);
                }
            })
        }else if(this.currentPage3 == 1){
            this.initData();
        }
    },
  }
};
</script>
<style lang="scss" scoped>
@import url("../../../assets/scss/systemManagement.scss");
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
.page_btn{
    width: 100%;
    .block{
        float: right;
        margin: 6px 0;
    }
}
</style>

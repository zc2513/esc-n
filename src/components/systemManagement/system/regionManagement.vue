<template>
    <div>
      <div class="main_box">
        <div class="xzgl_title">
          行政区域管理
        </div>
        <div class="table_box">
            <div class="btn_box">
                <div class="cascasser_select">
                  <!-- <el-cascader size="small" :options="regionData"   @change="handleItemChange"></el-cascader> -->
                  <el-cascader
                    filterable
                    @focus="($event.target.removeAttribute('readonly'))"
                    :options="options"
                    size="small"
                    v-model="selectedOptions"
                    change-on-select
                    clearable
                    @change="handleChange">
                  </el-cascader>
                </div>
                <div class="operation_btn">
                  <el-button size="small" @click="addDistrict">新增</el-button>
                  <el-button size="small" @click="upDataBefore">修改</el-button>
                  <el-button size="small" @click="deleteData" class="delectBtn">删除</el-button>
                </div>
            </div>
            <div class="table_content" v-show="tableContentType">
            <!-- <div class="table_content" v-if="tableContentType"> -->
                    <div class="publicTable">
                        <el-table size="small" ref="multipleTable" :data="tableDatas.tableData" @selection-change="handleSelectionChange" @select="handleSelect"   border style="width: 100%" >
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
            <!-- 弹窗 -->
             <div>
              <el-dialog title="新增" :visible.sync="addDialogVisible" width="60%">
                  <div class="newAdd_box">
                      <ul>
                        <li>
                            <label for="code">行政区域编号:<i>*</i></label>
                            <el-input  type="text" id="code" placeholder="行政区域编号" v-model.trim='addParams.code'></el-input>
                            <span>{{hintmsg.code}}</span>
                        </li>
                        <li>
                            <label for="province">区域名称:<i>*</i></label>
                            <el-input  type="text" id="province" placeholder="区域名称" v-model.trim='addParams.province'></el-input>
                            <span>{{hintmsg.province}}</span>
                        </li>
               <!--          <li>
                            <label for="describe">描述:<i>*</i></label>
                            <el-input  type="text" id="describe" placeholder="描述" v-model.trim="addParams.describe"></el-input>
                            <span>{{hintmsg.describe}}</span>
                        </li> -->
                        <li>
                            <label style="height:35px"></label>    
                            <el-button  size="small" @click="addData">保存</el-button>                                   
                        </li>
                      </ul>
                  </div>
              </el-dialog>

              <el-dialog title="修改" :visible.sync="upDataDialogVisible" width="60%">
                  <div class="newAdd_box">
                      <ul>
                        <li>
                            <label for="code">行政区域编号:<i>*</i></label>
                            <el-input  type="text" id="code" placeholder="行政区域编号" v-model.trim='modifyData.code'></el-input>
                            <span>{{hintmsg.codex}}</span>
                        </li>
                        <li>
                            <label for="province">区域名称:<i>*</i></label>
                            <el-input  type="text" id="province" placeholder="区域名称" v-model.trim='modifyData.province'></el-input>
                            <span>{{hintmsg.namex}}</span>
                        </li>
                      <!--   <li>
                            <label for="describe">描述:<i>*</i></label>
                            <el-input  type="text" id="describe" placeholder="描述" v-model="upDataParams.describe"></el-input>
                            <span>{{hintmsg.describe}}</span>
                        </li> -->
                        <li>
                            <label style="height:35px"></label>    
                            <el-button size="small"  @click="upData">保存</el-button>                                   
                        </li>
                      </ul>
                  </div>
              </el-dialog>              
            </div>
        </div>
      </div>          
    </div>   
     
</template>
<script>
import publicTable from "@/components/mux/tableComponent";
import baseUrl from "@/common/url.base.js";
export default {
  name: "district",
  components: {
    publicTable
  },
  data() {
    return {
        options: [],//省市级联数据
        selectedOptions: [],//省市级联选中数据展示
        currentPage3:1,//当前页
        pageData:null,//分页数据  
        tableContentType:false,//表单状态
        tableDatas:{//表单数据
            widths:[,,,,,,,,,,,,,,,,,,,],
            tableData:[],
            titles:[],
        },
        checkedData:null,//选中的数据
        dataId:null,//省市级联的选中数据
        cityData:null,//dataId对应的省市名称
        addParams: {//添加数据
            code: "",
            province: "",            
        },      
        hintmsg: {// 添加数据验证-------------
            code: "",
            province: "",
            codex: "",
            provincex: "",
        },
        // 修改数据------------------
        modifyData:{//修改数据----未选中前无数据
        },
        addDialogVisible: false, //新增弹窗状态
        upDataDialogVisible: false,//修改弹窗状态
      deletId: '',// 删除数据参数-----------
     
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() { // ---------------页面初始化表单数据
      this.$http.post("/pub/nation/list").then(res => {
          let data = res.data.data.list;
          var areaData = [];
          data.filter((item, index, arr) => {//省市级联数据处理
                if (item.parentId == 1) {
                    var city = [];
                    data.forEach((e, f, g) => {
                        if (item.id == e.parentId) {
                        let district = [];
                        data.forEach((k, i, j) => {
                            if (e.id == k.parentId) {
                            district.push({
                                value: k.district + "-" + k.id,
                                label: k.district
                            });
                            }
                        });
                        if (!e.city == "") {
                            city.push({
                            value: e.city + "-" + e.id,
                            label: e.city,
                            children: district
                            });
                        } else {
                            city.push({
                            value: e.district + "-" + e.id,
                            label: e.district
                            });
                        }
                        }
                    });
                    areaData.push({
                        value: item.province + "-" + item.id,
                        label: item.province,
                        children: city
                    });
                }
          });
          this.options = areaData;//省市级联整合数据
          this.pageData=res.data.data;
          let showData = [];
          data.forEach((item,index)=>{
              if(index<8){
                  showData.push(item);
              }
          })
          this.resTableData(showData);        
        })
    },
    addDistrict(){
        if(!this.dataId){
            this.$message({
                type:'info',
                message:'请在左侧下拉框，选择添加需要添加的位置'
            })
            return;
        }
        this.addDialogVisible = true
    },    
    addData() {//--------------------------------------------------------新增数据
        if(!this.addParams.code) {
            this.hintmsg.code = "内容不能为空";
            return;
        }else {
            this.hintmsg.code = "";
        }
        if(!this.addParams.province) {
            this.hintmsg.province = "内容不能为空";
            return;
        }else {
            this.hintmsg.province = "";
        }
        // 省市区字段验证
        let postData = {
            code:this.addParams.code,
        };
        if(this.addParams.province.indexOf("省")!=-1){
            postData["province"] = this.addParams.province;
        }else 
        if(this.addParams.province.indexOf("市")!=-1){
            postData["city"] = this.addParams.province;
        }  
        if(this.addParams.province.indexOf("省")==-1 && this.addParams.province.indexOf("市")==-1){
            postData["district"] = this.addParams.province;
        }    
        if(this.dataId){
            if(this.dataId.length==1){
                postData["parentId"] = this.dataId[0];
                let data = postData;
                this.addHttp(data);
            }
            if(this.dataId.length==2 && this.cityData[1].indexOf("区")!=-1){
                postData["parentId"] = this.dataId[0];
                let data = postData;
                this.addHttp(data);
            }else{
                postData["parentId"] = this.dataId[1];
                let data = postData;
                this.addHttp(data);
            }
        }else{
            this.$message('编码已存在')
        }
    },
    addHttp(params){//增加数据接口
        this.$http.post("/pub/nation/add",params).then(res =>{
            if (res.data.code == 200) {
                    this.$message({
                        showClose: true,
                        message: "添加成功",
                        type: "success"
                    });
                    this.currentPage();
                    this.addDialogVisible = false;
            }else if(res.data.code==400){
                    this.$message({
                        showClose: true,
                        message: "该数据已存在",
                        type: "warning"
                    });
            }
        })
    },
    //-----------------------------------------------------------------修改数据
    upDataBefore(){//修改前判断
        if(this.checkedData){
            this.modifyData["id"]=this.checkedData.id;
            this.modifyData["code"]=this.checkedData.code;
            this.modifyData["province"]=this.checkedData.province || this.checkedData.city || this.checkedData.district;    
            this.upDataDialogVisible = true;
        }else{
            this.$message('请选择需要修改的内容');
        }
    },
    upData() { //修改提交
        if(!this.modifyData.code) {
            this.hintmsg.code = "内容不能为空";
            return;
        } else {
            this.hintmsg.codex = "";
        }
        if (!this.modifyData.province) {
            this.hintmsg.province = "内容不能为空";
            return;
        } else {
            this.hintmsg.provincex = "";
        }
        // 省市区字段验证
        let postData = {
            id:this.modifyData.id,
            code:this.modifyData.code,
        };
        if(this.modifyData.province.indexOf("省")!=-1){
            postData["province"] = this.modifyData.province;
        }else 
        if(this.modifyData.province.indexOf("市")!=-1){
            postData["city"] = this.modifyData.province;
        }  
        if(this.modifyData.province.indexOf("省")==-1 && this.modifyData.province.indexOf("市")==-1){
            postData["district"] = this.modifyData.province;
        } 
        let data = postData;
        this.$http.post("/pub/nation/update", data).then(res => {
            if (res.data.code == 200 && res.data.message == "SUCCESS") {
                this.$message({
                    showClose: true,
                    message: "修改成功",
                    type: "success"
                })
                this.currentPage();
                this.upDataDialogVisible = false;
            }
        })
    },
    deleteData() {//----------------------------------------------------- 删除数据
      if(this.checkedData){//是否有选中项
               this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id:this.checkedData.id
                    }
                    this.$http.post("/pub/nation/delete",data).then(res=>{
                        if(res.data.code==200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.currentPage();
                        }else{
                            console.log("具有父元素或者删除失败/后台没有处理具有子元素的元素不能删除")
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
//-------------------------------------------------------------------------公用方法---------------------------------------------------------------
    resTableData(data){//返回数据处理(展示数据)
            let listData = data
            let tableData = []
            listData.forEach((item,index)=>{
                if(index<8){
                    let name = item.province || item.city || item.district;                    
                    tableData.push({
                        code:item.code,
                        name:name,
                    })
                }
            })
            this.tableDatas["totalData"] = listData;
            this.sendData(tableData)
    },
    sendData(tableData){//表格数据处理
            this.tableDatas['titles'] ='区域编号,区域名称'.split(',');   
            this.tableDatas['widths']='543,544'.split(',')  
            this.tableDatas.tableData = [];
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
    handleCurrentChange(val) { // -----选择省市后的翻页
        if(this.dataId){
            if(this.dataId.length == 1){
                let data = {
                    parentId:this.dataId[0],
                    page:val,
                    size:8
                }
                this.httpSave(data);
            }else{
                if(this.cityData[1].indexOf("区")==-1){
                    let data = {
                        parentId:this.dataId[1],
                        page:val,
                        size:8
                    }
                    this.httpSave(data);                 
                }else{
                    let data = {
                        parentId:this.dataId[0],
                        page:val,
                        size:8
                    }
                    this.httpSave(data);
                }
            }
        }else{
            let data = {
                page:val,
                size:8
            }
            this.$http.post('/pub/nation/list',data).then(res=>{
                if(res.data.code==200){
                    let data = res.data.data.list
                    this.resTableData(data);
                }
            })
        }
       
    },     
    handleSelectionChange(val) {//表单行数据获取----当前选中的数据
        // if(val[0]){
        //     let data = this.tableDatas.totalData.filter((item,index,array)=>{
        //         return item.code==val[0][0]
        //     })
        //     this.checkedData = data[0]
        // }else{
        //    this.checkedData = null;
        // }   
    },
    handleSelect(selection, row) { // 复选框状体下单选
      if(this.checkedData && row[0] === this.checkedData.code) {
          this.$refs.multipleTable.clearSelection();
          this.checkedData = null;
      } else {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(row);
          var val = row
            if (val) {
              let data = this.tableDatas.totalData.filter((item,index,arr) =>{
                  return item.code == val[0]
              })
              this.checkedData = data[0];
          }else{
              this.checkedData = null;
          }
      }
    },  
    handleChange(value) {//-------------省市级联选择
    console.log(value,8888);
        let arr = [];
        let city = [];
         value.forEach((ele, index) => {
            arr.push(ele.split('-')[1])
            city.push(ele.split('-')[0])
        })
        this.cityData = city;
        this.dataId = arr;
        if(arr.length!=0){
            if(arr.length==1){
                let data = {
                    parentId:arr[0]
                }
                this.currentPage3 = 1;
                this.httpSave(data)
            }else{
                if(city[1].indexOf("区")==-1){
                    let data = {
                        parentId:arr[1]
                    }            
                   this.currentPage3 = 1;
                   this.httpSave(data)                    
                }else{
                    let data = {
                        parentId:arr[0]
                    }
                    this.currentPage3 = 1;
                    this.httpSave(data)
                }
            }
        }else{
            this.dataId = null;
            this.initData()
        }
    },
    httpSave(config){//根据父id请求 带翻页 公用---
        this.$http.post("/pub/nation/listByParentId",config).then(res=>{
            if(res.data.code==200){
                let data =  res.data.data
                this.pageData=data
                this.resTableData(data.list);
            }
        }) 
    },
    currentPage(){//增删改 ---停留当前页
        if(this.dataId){//如果左侧被选中则,继续保留到当前选项
            if(this.dataId.length==1){
                let data = {
                    parentId:this.dataId[0],
                    page:this.currentPage3,
                    size:8,
                }
                this.httpSave(data);              
            }
            if(this.dataId.length==2 && this.cityData[1].indexOf("区")!=-1){
                let data = {
                    parentId:this.dataId[0],
                    page:this.currentPage3,
                    size:8,
                }
                this.httpSave(data);              
            }else{
                let data = {
                    parentId:this.dataId[1],
                    page:this.currentPage3,
                    size:8,
                }
                this.httpSave(data);              
            }
        }else if(!this.dataId && this.currentPage3!=1){
            let data = {
                page:this.currentPage3,
                size:8,
            }
            this.$http.post('/pub/nation/list',data).then(res=>{
                if(res.data.code==200){
                    let data = res.data.data.list;
                    this.pageData = res.data.data;
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
.newAdd_box {
  ul {
    overflow: visible;
    label {
      width: 97px;
    }
    li {
      position: relative;
      span {
        position: absolute;
        padding-left: 10px;
        color: #f00;
        right: -100px;
        font-size: 12px;
        top: 0;
      }
    }
  }
}
</style>



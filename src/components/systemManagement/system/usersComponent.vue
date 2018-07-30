<template>
    <div class="main_box">
      <div class="xzgl_title">
      用户管理
      </div>
      <div class="table_box">
          <div class="query_box">
              <ul>
                <li class="user_query">
                  <label>登录名称:</label>
                  <el-input size="small" type="text" v-model="RequestParam.username" :clearable="RequestParam.username ? true : false"></el-input>
                </li>
                <li>
                  <label>联系方式:</label>
                  <el-input size="small" type="text" v-model="RequestParam.phone" focus :clearable="RequestParam.phone ? true : false"></el-input>
                </li>
                <li><el-button size="small"  @click="selectData" >查询</el-button></li>
              </ul>
          </div>
          <div class="btn_box">
              <!-- 操作按钮 -->
              <div class="cascasser_select">
                  <!-- 下拉选择 -->
                <el-cascader 
                  filterable
                  @focus="($event.target.removeAttribute('readonly'))"
                  size="small" 
                  :options="options" 
                  change-on-select 
                  @change="change" 
                  placeholder="行政区域" 
                  clearable>
                </el-cascader>
              </div>
              <div class="operation_btn">
                <el-button size="small" @click="addUserData" v-if="flagIsTrue">新增</el-button>
                <el-button size="small" @click="upDatadialogVisible" v-if="flagIsTrue">修改</el-button>
                <el-button size="small" @click="delectData" class="delectBtn" v-if="flagIsTrue">删除</el-button>
                <el-button size="small" @click="initRoleSettingData"  v-if="flagIsTrue">角色设置</el-button>
                <el-button size="small" @click="ResetPaswword">重置密码</el-button>
              </div>
          </div>
          <div class="table_content" v-show="tableContentType">
          <!-- <div class="table_content" v-if="tableContentType"> -->
              <div class="publicTable">
                  <el-table size="small" ref="multipleTable" :data="tableDatas.tableData" @selection-change="handleSelectionChange" @select="handleSelect" border style="width: 100%" >
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
          <el-dialog title="新增" :visible.sync="dialogVisible" width="60%">
            <div class="newAdd_box">
                <!-- <div><span @click="dialogVisible = false">X</span></div> -->
                <ul>
                <li>
                    <label for="name">登录名称:<i>*</i></label>
                    <el-input  placeholder="用户名称" id="name" v-model.trim="addParams.username"></el-input>
                    <span>{{hintmsg.username}}</span>
                </li>
                <li>
                    <label for="name">真实姓名:<i>*</i></label>
                    <el-input  placeholder="用户名称" id="name" v-model.trim="addParams.realname"></el-input>
                    <span>{{hintmsg.realname}}</span>
                </li>
                <li>
                    <label for="tel">联系方式:<i>*</i></label>
                    <el-input  placeholder="联系方式" id="tel" v-model.trim="addParams.phone" @blur="phoneValidation(addParams.phone)"></el-input>
                    <span>{{hintmsg.phone}}</span>
                </li>
                <li class="">
                    <label style="height:35px"></label>    
                    <el-button @click="addData" size="small" style="margin-top:10px;">保存</el-button>                                    
                </li>
                </ul>
            </div>
          </el-dialog>
          <!-- 修改 -->
          <el-dialog title="修改" :visible.sync="upDatadialogVisible1" width="60%">
            <div class="newAdd_box">
                <ul>
                <li>
                    <label for="name">登录名称:<i>*</i></label>
                    <el-input  placeholder="用户名称" id="name" v-model.trim="upDataParams.username"></el-input>
                    <span v-text="hintmsg.username"></span>
                </li>
                <li>
                    <label for="name">真实姓名:<i>*</i></label>
                    <el-input  placeholder="用户名称" id="name" v-model.trim="upDataParams.realname"></el-input>
                    <span v-text="hintmsg.realname"></span>
                </li>
                <li>
                    <label for="tel">联系方式:<i>*</i></label>
                    <el-input  placeholder="联系方式" id="tel" v-model.trim="upDataParams.phone" @blur="phoneValidation(upDataParams.phone)" ></el-input>
                    <span v-text="hintmsg.phone"></span>
                </li>
                <li class="">
                    <label style="height:35px"></label>    
                    <el-button @click="upData">修改</el-button>                                    
                </li>
                </ul>
            </div>
          </el-dialog>
          <!-- 角色设置弹窗 -->
          <el-dialog class="roleSettingBox" :visible.sync="roleSet">
             <div class="roleSetting">
                <div class="rstTittle">
                   <div class="rstLeft">角色编号：{{roleTitData.userId}}</div>
                   <div class="rstRight">角色名称：{{roleTitData.username}}</div>
                </div>
                <div class="rstT">
                    <h4>角色设置</h4>
                </div>
                <div class="settingTree">
                    <ul class="clearfix">
                        <li v-for="(item,index) in radioDatas" :key='index' > 
                            <el-radio v-model="radioDefaultId" @change='radioChange' :checked='true' :label="item.roleId">{{item.name}}</el-radio>
                        </li>
                    </ul>
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
  name: "users",
  data() {
    return {
      show: false,
      tableContentType: false,
      //-----------------------------角色设置权限参数
      roleSet: false,
      roleTitData: {
        userId: "",
        username: ""
      },
      radioDatas: [],
      radioCheckedId: "",//用户选中的值
      radioDefaultId:null,//默认选中的值
      RequestParam: {
        // 查询数据
        username: "",
        realname:null,
        phone: ""
      },
      cascaderData: {
        xzqSbm: "",
        xzqDsbm: "",
        xzqQbm: "",
        xzqSData:null,
        xzqQData:null,
        xzqDsData:null,
      },
      disabled: true,
      tableDatas: {
        widths: [, , , , , , , , , , , , , , , , , , ,],
        tableData: [],
        titles: []
      },
      tableData: [], //表格数据
      //新增参数
      addParams: {
        username: "",
        phone: null,
        xzqSbm: "",
        xzqDsbm: "",
        xzqQbm: "",
        xzqMc:null,
      },
      
      //******************************修改 */
      upDataParams: {},
      //*********************************新增验证 */
      hintmsg: {
        username: null,
        realname:null,
        phone: null,
      },
      roleData: {
        useId: "",
        usename: ""
      },
      checkList: [],
      dialogVisible: false, // 新增弹窗
      roleSet: false, //角色设置弹窗
      upDatadialogVisible1: false, //修改弹窗
      options: [], //区域选择
      currentPage3: 1, //分页
      pageData: null, //分页数据
      // 表格选中的数据-------------------------
      tableSelectData: "",
      // 行政区域选中的数据--------------------
      handleChangeData: "",
      //*************************表格选中数据 */
      checkedData: "",
      dataId: "", //****************选中数据的id
      userInfo:null,
      flagIsTrue:true
    };
  },
  created() {
    this.initGetData();
    this.initGetregionData();
  },
  methods: {
    // 区域选择下拉框数据
    initGetregionData() {
      this.$http.post("/pub/nation/listByUser")
        .then(res => {
          let data = res.data.data.list;
          var areaData = [];
          data.filter((item, index, arr) => {
            if (item.parentId == 1) {
              var city = [];
              data.forEach((e, f, g) => {
                if (item.id == e.parentId) {
                  let district = [];
                  data.forEach((k, i, j) => {
                    if (e.id == k.parentId) {
                      district.push({
                        value: k.district + "-" + k.code,
                        label: k.district
                      });
                    }
                  });
                  if (!e.city == "") {
                    city.push({
                      value: e.city + "-" + e.code,
                      label: e.city,
                      children: district
                    });
                  } else {
                    city.push({
                      value: e.district + "-" + e.code,
                      label: e.district
                    });
                  }
                }
              });
              areaData.push({
                value: item.province + "-" + item.code,
                label: item.province,
                children: city
              });
            }
          });
          this.options = areaData;
          // console.log(areaData);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //*********************************************************** 表格初始化数据
    initGetData(val) {
      this.userInfo = JSON.parse(window.localStorage.getItem("USER_INFO"));
      if (this.userInfo.rolename !== "超级管理员") {
          this.flagIsTrue = false;
      }
      let data = {
        size: 8,
        page: 1,
        xzqSbm:this.userInfo.xzqSbm,
        xzqDsbm:this.userInfo.xzqDsbm,
        xzqQbm:this.userInfo.xzqQbm,
      };
      this.$http
        .post("/upms/user/listByParams", data)
        .then(result => {
          data = result.data.data.list;
          this.pageData = result.data.data;
          this.tableData = data;
          this.resTableData(this.tableData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCheckVal(e) {
      //角色设置弹窗获取选中值
      console.log(e);
    },
    change(val) {
      this.cascaderData.xzqSbm = ""
      this.cascaderData.xzqDsbm = ""
      this.cascaderData.xzqQbm = ""
      this.RequestParam.usern = ""
      this.RequestParam.phone = ""
      //----------------------------------------------------------------树形图选择
      this.dataId = val;
      if (!val[0]) {
        //没有选择 加载所有的数据
        // this.dicData.pdictId=0;
        this.dataId = null;
        this.initGetData();
      } else {
        if (val.length == 1) {
          let xzqSbmArr = [];
          xzqSbmArr = val[0].split("-");
          this.cascaderData["xzqSbm"] = xzqSbmArr[1];
          this.cascaderData.xzqSData = xzqSbmArr[0];
          data = {
            xzqSbm: this.cascaderData.xzqSbm,
            page:1,
            size:8,
          };
        } else if (val.length == 2) {
          if (val[1].indexOf("区") == -1) {
            let xzqDsbmArr = val[1].split("-");
            this.cascaderData["xzqDsbm"] = xzqDsbmArr[1];
            this.cascaderData.xzqDsData = xzqDsbmArr[0];
            var data = {
              xzqSbm: this.cascaderData.xzqSbm,
              xzqDsbm: this.cascaderData.xzqDsbm,
              page:1,
              size:8,
            };
          } else {
            let xzqDsbmArr = val[1].split("-");
            this.cascaderData.xzqDsbm = xzqDsbmArr[1];
            this.cascaderData.xzqDsData = xzqDsbmArr[0];
            var data = {
              xzqSbm: this.cascaderData.xzqSbm,
              xzqDsbm: this.cascaderData.xzqDsbm,
              page:1,
              size:8,
            };
          }
          // this.httpSever(data);
        } else if (val.length == 3) {
          let xzqQbmArr = val[2].split("-");
          this.cascaderData.xzqQbm = xzqQbmArr[1];
          this.cascaderData.xzqQData = xzqQbmArr[0];
          var data = {
            xzqSbm: this.cascaderData.xzqSbm,
            xzqDsbm: this.cascaderData.xzqDsbm,
            xzqQbm: this.cascaderData.xzqQbm,
            page:1,
            size:8,
          };
        }
        this.currentPage3 = 1; //重置选项页码
        this.httpSever(data);
      }
    },

    // 新增数据-----------------
    addUserData() {
      if (this.dataId.length != 0) {
        this.dialogVisible = true;
      } else {
        this.$message({
          showClose: true,
          message: "请选择行政区域",
          type: "error"
        });
      }
      
      for (const k in this.hintmsg) {
        if (this.hintmsg.hasOwnProperty(k)) {
          this.hintmsg[k] = "";
        }
      }
      for (const k in this.addParams) {
        if (this.hintmsg.hasOwnProperty(k)) {
          this.addParams[k] = "";
        }
      }
    },
    phoneValidation(e){
      // debugger
        if(this.$tools.isPhoneInspect(e) == 1){
            this.hintmsg.phone = "";
            return false
        }else{
            this.hintmsg.phone = this.$tools.isPhoneInspect(e);
            return true;
        }
    },
    addData() {
      if (!this.addParams.username) {
        this.hintmsg.username = "内容不能为空";
        return;
      } else {
        this.hintmsg.username = "";
      }
      if (!this.addParams.realname) {
        this.hintmsg.realname = "内容不能为空";
        return;
      } else {
        this.hintmsg.username = "";
      }
      if (!this.addParams.phone) {
        this.hintmsg.phone = "内容不能为空";
        return;
      } else {
        if (this.phoneValidation(this.addParams.phone)) {
            return;
        }
      }

      if (this.dataId.length == 1) {
        this.addParams.xzqSbm = this.cascaderData.xzqSbm;
        this.addParams.xzqMc = this.cascaderData.xzqSData
      } else if (this.dataId.length == 2) {
        this.addParams.xzqSbm = this.cascaderData.xzqSbm;
        this.addParams.xzqDsbm = this.cascaderData.xzqDsbm;
        this.addParams.xzqMc = this.cascaderData.xzqSData + this.cascaderData.xzqDsData;
      } else {
        this.addParams.xzqSbm = this.cascaderData.xzqSbm;
        this.addParams.xzqDsbm = this.cascaderData.xzqDsbm;
        this.addParams.xzqQbm = this.cascaderData.xzqQbm;
        this.addParams.xzqMc = this.cascaderData.xzqSData + this.cascaderData.xzqDsData + this.cascaderData.xzqQData;
      }

      let data = this.addParams;
      this.$http.post("/upms/user/add", data)
        .then(res => {
          if (res.data.code == 200 && res.data.data.state == "SUCCESS") {
            this.dialogVisible = false;
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            this.currentPage();
            this.addParams.username = "";
            this.addParams.phone = "";
            this.addParams.realname = null;
          }else if(res.data.data.state == "ERROR"){
                this.$message({
                    message: res.data.data.message,
                    type: "warning"
                });
          }
        })
    },
    upDatadialogVisible() {
      //修改前--判断
      if (this.checkedData) {
        this.upDatadialogVisible1 = true;
        this.upDataParams["username"] = this.checkedData.username;
        this.upDataParams["realname"] = this.checkedData.realname;
        this.upDataParams["phone"] = this.checkedData.phone;
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要修改的内容",
          type: "warning"
        });
      }
    },
    upData() {
      // 修改
      let url = "/upms/user/updateUserInfo";
      if(this.upDataParams.username == ''){
          this.hintmsg.username ='登录名称不能为空'
          return;
      }else{
          this.hintmsg.username = ''
      }
      if(this.upDataParams.realname == ''){
           this.hintmsg.realname ='姓名不能为空'
           return;
      }else{
          this.hintmsg.realname = ''
      }
      if(this.upDataParams.phone == ''){
            this.hintmsg.phone ='电话号码不能为空'
            return;
      }else{
          if (this.phoneValidation(this.upDataParams.phone)) {
            return;
          }
      }
      let data = this.upDataParams;
      data["userId"] = this.checkedData.userId;
      this.$http
        .post(url, data)
        .then(res => {
          if (res.data.code == 200 && res.data.message == "SUCCESS") {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.upDatadialogVisible1 = false;
            this.currentPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delectData() {
      if (this.checkedData) {
        //是否有选中项
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = {
              id: this.checkedData.userId
            };
            this.$http.post("/upms/user/delete", data).then(res => {
              if (res.data.code == 200 && res.data.message == "SUCCESS") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.currentPage();
              } else if (res.data.code == 200 && res.data.message == "ERROR") {
                this.$message({
                  type: "warning"
                  // message: res.data.data.message
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要删除的内容",
          type: "warning"
        });
      }
    },
    ResetPaswword() {//重置密码
      if (this.checkedData) {
          this.$confirm('确定要重置此密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                       let data = {
                            userId: this.checkedData.userId
                        };
                        this.$http.post("/upms/user/resetPassword", data).then(res => {
                            if(res.data.code==200){
                                this.$message({
                                    type:'success',
                                    message:"密码已重置"
                                })
                            }
                        })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要重置密码项",
          type: "warning"
        });
      }
    },
    // 查询
    selectData() {
      if (this.cascaderData.xzqSbm ||this.cascaderData.xzqDsbm || this.cascaderData.xzqQbm) {
        let data = {
          xzqSbm:this.cascaderData.xzqSbm,
          xzqDsbm:this.cascaderData.xzqDsbm,
          xzqQbm:this.cascaderData.xzqQbm,
          username: this.RequestParam.username,
          phone: this.RequestParam.phone,
          page:1,
          size:8
        }
        this.httpSever(data);
      }else {
        let data = {
        username: this.RequestParam.username,
        phone: this.RequestParam.phone,
        xzqSbm:this.userInfo.xzqSbm,
        xzqDsbm:this.userInfo.xzqDsbm,
        xzqQbm:this.userInfo.xzqQbm,
        page:1,
        size:8
      };
      this.httpSever(data);
      }
    },
    currentPage() {
      //增删改
      if (this.dataId) {
        //如果左侧被选中则,继续保留到当前选项
        let data = [];
        if (this.dataId.length == 1) {
          data = {
            xzqSbm: this.cascaderData.xzqSbm,
            page: this.currentPage3,
            size: 8
          };
        } else if (this.dataId.length == 2) {
          data = {
            xzqDsbm: this.cascaderData.xzqDsbm,
            page: this.currentPage3,
            size: 8
          };
        } else {
          data = {
            xzqQbm: this.cascaderData.xzqQbm,
            page: this.currentPage3,
            size: 8
          };
        }
        this.httpSever(data);
      } else if (!this.dataId && this.currentPage3 != 1) {
        let data = {
          xzqSbm:this.userInfo.xzqSbm,
          xzqDsbm:this.userInfo.xzqDsbm,
          xzqQbm:this.userInfo.xzqQbm,
          page: this.currentPage3,
          size: 8,
        };
        this.$http.post("/upms/user/listByParams", data).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data.list;
            this.pageData = res.data.data;
            this.resTableData(data);
          }
        });
      } else if (this.currentPage3 == 1) {
        this.initGetData();
      }
    },
    orderFlag(){
      if (this.RequestParam.username || this.RequestParam.phone) {
        return true;
      } else {
        return false;
      }
    },
    handleCurrentChange(val) {
      console.log(this.dataId,7777);
      if (this.dataId) {
        if (this.orderFlag()) {
          let data = [];
          if (this.dataId.length == 1) {
             data = {
              xzqSbm: this.cascaderData.xzqSbm,
              username: this.RequestParam.username,
              phone: this.RequestParam.phone,
              page: val,
              size: 8
            };
          } else if (this.dataId.length == 2) {
             data = {
              xzqDsbm: this.cascaderData.xzqDsbm,
              username: this.RequestParam.username,
              phone: this.RequestParam.phone,
              page: val,
              size: 8
            };
          } else {
             data = {
              xzqQbm: this.cascaderData.xzqQbm,
              username: this.RequestParam.username,
              phone: this.RequestParam.phone,
              page: val,
              size: 8
            };
          }
          this.$http.post("/upms/user/listByParams", data).then(res => {
            if (res.data.code == 200) {
               data = res.data.data.list;
              this.pageData = res.data.data;
              this.resTableData(data);
            }
          });
        } else {
          let data = [];
          if (this.dataId.length == 1) {
           data = {
            xzqSbm: this.cascaderData.xzqSbm,
            page: val,
            size: 8
          };
        } else if (this.dataId.length == 2) {
           data = {
            xzqDsbm: this.cascaderData.xzqDsbm,
            page: val,
            size: 8
          };
        } else {
           data = {
            xzqQbm: this.cascaderData.xzqQbm,
            page: val,
            size: 8
          };
        }
        this.$http.post("/upms/user/listByParams", data).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data.list;
            this.pageData = res.data.data;
            this.resTableData(data);
          }
        });
        }
      } else {
        if (this.orderFlag()) {
          let data = {
            page: val,
            size: 8,
            xzqSbm:this.userInfo.xzqSbm,
            xzqDsbm:this.userInfo.xzqDsbm,
            xzqQbm:this.userInfo.xzqQbm,
            username: this.RequestParam.username,
            phone: this.RequestParam.phone,
          };
          this.$http.post("/upms/user/listByParams", data).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data.list;
              this.pageData = res.data.data;
              this.resTableData(data);
            }
          });
        } else {
          let data = {
            page: val,
            size: 8,
            xzqSbm:this.userInfo.xzqSbm,
            xzqDsbm:this.userInfo.xzqDsbm,
            xzqQbm:this.userInfo.xzqQbm,
          }
          this.$http.post("/upms/user/listByParams", data).then(res => {
            if (res.data.code == 200) {
              let data = res.data.data.list;
              this.pageData = res.data.data;
              this.resTableData(data);
            }
          });
        }
      }
    },

    resTableData(data) {
      //返回数据处理(展示数据)
      let listData = data;
      let tableData = [];
      if (listData) {
        listData.forEach((item, index) => {
          if (index < 8) {
            tableData.push({
              dicName: item.userId,
              dicId: item.username,
              dicCode: item.phone
            });
          }
        });
      }
      this.tableDatas["totalData"] = listData;
      this.sendData(tableData);
    },

    handleSelectionChange(val) {
      //表单行数据获取
      // this.selectedData = val;
      // if (val[0]) {
      //   let data = this.tableDatas.totalData.filter((item, index, array) => {
      //     return item.userId == val[0][0];
      //   });
      //   this.checkedData = data[0];
      // } else {
      //   this.checkedData = null;
      // }
    },

    handleSelect(selection, row) { // 复选框状体下单选
      if(this.checkedData && row[0] === this.checkedData.userId) {
          this.$refs.multipleTable.clearSelection();
          this.checkedData = null;
      } else {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(row);
          var val = row
            if (val) {
              let data = this.tableDatas.totalData.filter((item,index,arr) =>{
                  return item.userId == val[0]
              })
              this.checkedData = data[0];
          }else{
              this.checkedData = null;
          }
      }
    },
    sendData(tableData) {
      //表格数据处理
      this.tableDatas["titles"] = "用户编号,登录名称,联系方式".split(",");
      this.tableDatas["widths"] = "300,300,487".split(",");
      this.tableDatas.tableData = [];
      for (let i = 0; i < tableData.length; i++) {
        let arr = [];
        for (let k in tableData[i]) {
          arr.push(tableData[i][k]);
        }
        this.tableDatas.tableData.push(arr);
      }
      setTimeout(() => {
        this.tableContentType = true;  
      }, 100);
      
    },
    httpSever(flag) {
      this.$http.post("/upms/user/listByParams", flag).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data.list;
          this.pageData = res.data.data;
          this.currentPage3 = 1;
          this.resTableData(data);
        }
      });
    },
    //------------------------------------角色设置--
    radioChange(val) {//单选选中的值
      this.radioCheckedId = val;
    },
    jurisdictionSave() {
      //获取key值
      let data = {
        userId: this.checkedData.userId,
        roleId: this.radioCheckedId
      };
      this.$http.post("/upms/user/role/addUserRole", data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            showClose: true,
            message: res.data.data.message,
            type: "success"
          });
          this.roleSet = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.data.message,
            type: "warning"
          });
        }
      });
    },
    initRoleSettingData() {
      //角色设置数据初始化
      if (this.checkedData) {
        this.roleTitData["userId"] = this.checkedData.userId;
        this.roleTitData["username"] = this.checkedData.username;
        this.radioDefaultId = "";
        this.$http.post("/upms/role/userList",{userId:this.checkedData.userId}).then(res => {
          if (res.data.code == 200) {
            if (res.data.data.upmsRole  && res.data.data.upmsRole != null) {
               this.radioDefaultId = res.data.data.upmsRole.roleId;     
            }
            this.radioDatas = res.data.data.upmsRoles;
          }
        });
        this.roleSet = true;
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要修改的内容",
          type: "warning"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("../../../assets/scss/systemManagement.scss");
.query_box {
  width: 100%;
  height: 60px;
  line-height: 60px;
  .user_query {
    margin-right: 20px;
  }
  ul li {
    float: left;
    width: 250px;
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
    .el-button {
      margin-left: 30px;
    }
    // .el-button:focus,
    // .el-button:hover {
    //   color: #fff;
    //   background-color: #ff8000;
    //   border-color: #ff8000;
    // }
  }
}
.roleSetting {
  //角色设样式
  width: 100%;
  .rstTittle {
    height: 40px;
    div {
      box-sizing: border-box;
      float: left;
      width: 50%;
      height: 40px;
      line-height: 40px;
      background-color: #e2e2e2;
    }
    .rstLeft {
      text-align: right;
      padding-right: 8%;
    }
    .rstRight {
      padding-left: 8%;
    }
  }
  .rstT {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
  }
  .settingTree {
    width: 80%;
    margin: 0 auto;
    ul {
      padding: 4px;
      li {
        width: 33.33%;
        height: 40px;
        line-height: 40px;
        float: left;
        text-align: center;
      }
    }
  }
  .roleBtn {
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
.newAdd_box {
  li {
    span {
      font-size: 14px;
      color: red;
      position: absolute;
    }
  }
}
</style>



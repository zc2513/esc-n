<template>
  <div class="login">
    <div class="box">
        <div class="con">
            <h2>二手车交易管理系统</h2>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0"  class="demo-ruleForm">
              <el-form-item label="" prop="username" class="tp">
                <el-input type="text" prefix-icon="fa fa-user" placeholder="请输入用户名称" v-model="ruleForm.username"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="" prop="userPass" class="tp">
                <el-input type="password" prefix-icon="fa fa-lock" placeholder="请输入登陆密码" @keyup.13.native="submitForm('ruleForm')" v-model="ruleForm.userPass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style='width:100%;height:46px;font-size:1.2rem;' @click="submitForm('ruleForm')">登陆</el-button>
              </el-form-item>
            </el-form>
            <p>{{loginInit}}</p>
        </div>
    </div>
    <div class="footer">
        Copyright © WWW.YUXIN.com, All Rights Reserved.
    </div>
  </div>
</template>

<script>
import servers from '@/js/login/login.js'
export default {
  name: 'HelloWorld',
  data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          userPass: '',
        },
        rules: {
          username: [
            { validator: validateName, trigger: 'blur' }
          ],
          userPass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        loginInit:''
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            servers.login(this)
          } else {
            return false;
          }
        });
      },
    }  
}
</script>
<style lang='scss' scoped>
  @import '@/assets/scss/login/login.scss';
</style>
<style lang='scss'>
.login{
  .el-button--primary{
    background-color:rgba(74, 169, 211, 1);
  }
  .el-button--primary:focus, .el-button--primary:hover{
    background-color:rgba(110,186,220, 1);
  }
  .el-input__inner{
    height: 50px;
    line-height: 50px;
  }
  .el-input__inner::-webkit-input-placeholder {
    color: #aab2bd;
    font-size: 1rem;
  }
  input:-webkit-autofill{
    -webkit-box-shadow: 0 0 0 1000px white inset;  //使用足够大的纯色内阴影覆盖黄色背景
  }
  .el-input__prefix{
    left:10px;
    font-size: 2rem;
    line-height:3.4rem;
    .el-input__icon{
      line-height:3.4rem;
    }
  }
  .el-input--prefix .el-input__inner{
    padding-left:40px;
  }
}
</style>

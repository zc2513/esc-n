import $ from '@/api/http.config.js'
import localStorage from '@/store/index.js'
export default{
    login(vue){
        let data = { 'username': vue.ruleForm.username, 'password': vue.ruleForm.userPass }
        $.post('/upms/user/login',data).then(res=>{
            if (res.code == 200){
                localStorage.save(res.data)
                vue.$router.push({ path: '/home' })
            }
            if (res.code == 400){
                vue.loginInit = res.data.message
                setTimeout(() => {
                    vue.loginInit = ''
                }, 2000);
            }
        })
    }
}
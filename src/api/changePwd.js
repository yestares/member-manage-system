import request from '@/until/server.js'

export default {
    oldVerify(userId , oldPwd){
       return request({
            url:'/user/pwd',
            method:'post',
            data:{
                userId,
                oldPwd
            }
        })
    },
    newPwdSub(userId , newPwd){
       return request({
            url:'/user/pwd',
            method:'put',
            data:{
                userId,
                newPwd
            }
        })
    }
}
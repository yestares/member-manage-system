import Axios from "axios";
import { Loading , Message } from 'element-ui';

const request = Axios.create({
  baseURL: process.env.VUE_APP_BAES_API,
  timeout: 6000
});

const loading = {
  loadingInstance: null,
  open(){
    if(this.loadingInstance === null){
      this.loadingInstance = Loading.service({target: '.main' , text:'加载中...', background: 'rgba(0 ,0, 0,0.8)'})
    }
  },
  close(){
    if(this.loadingInstance !== null){
      this.loadingInstance.close()
    }
    this.loadingInstance = null;
  }
}



// 请求拦截
request.interceptors.request.use(config => {
  loading.open()
  return config
}, error => {
  loading.close()
  return Promise.reject(error)
})
// 响应拦截
request.interceptors.response.use(response => {
  loading.close()
  const resp = response.data;
  if(resp.code !== 2000){
    Message({
      message:resp.message || '系统异常',
      type:'warning',
      druation:5000
    })
  }
  return response
}, error => {
  loading.close()
  console.log(error.response.status)
  Message({
    message:error.message,
    type:'error',
    druation:5000
  })
  return Promise.reject(error)
})


export default request;

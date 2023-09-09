import axios from 'axios';
import useStore from "../store";

const http = axios.create({
    baseURL: '/primary/', // api的base_url
    timeout: 15000 // 请求超时时间
});

http.interceptors.request.use((request)=>{
    const state = useStore.getState()
    console.log('request.url',request.url)
    if(request.url?.match('/main/touch')){
        request.headers['Content-Type'] = "multipart/form-data"
        return request;
    }
    if (request.url.startsWith("/main/")){
        return request;
    }
    request.headers.set("X-Target-Port",state.invokePort)
    return request;
})


http.interceptors.response.use(response => {
    return response.data
})

export default http;

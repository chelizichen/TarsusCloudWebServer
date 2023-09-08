import axios from 'axios';

const http = axios.create({
    baseURL: '/api/', // api的base_url
    timeout: 15000 // 请求超时时间
});

http.interceptors.response.use(response => {
    return response.data
})

export default http;

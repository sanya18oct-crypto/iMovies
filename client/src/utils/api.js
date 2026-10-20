import axios from 'axios';import Cookies from 'js-cookie';import {render} from '../host';
const api=axios.create({baseURL:render,timeout:15000});api.interceptors.request.use(config=>{const token=Cookies.get('imovies_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r.data,error=>{const message=error.response?.data?.message||error.message||'Something went wrong';return Promise.reject(new Error(message));});export default api;

import axios from "axios";
import { getAuthToken } from "./auth";
import store from "../app/store";
import { logout, setRequestLoading } from "../app/slices/authSlice";

// constants
// const BASE_URL = "http://localhost:8000";
// const BASE_URL = 'http://13.53.197.82:8000';
const BASE_URL = 'https://ess-be.techkingdom.in';

// const BASE_URL = "http://192.168.1.12:8000";

const ERROR_MSG = { type: "error", text: "Something went wrong." };

// helpers functions
const genHeaders = () => {
  return {
    Authorization: `Token ${getAuthToken()}`,
    "Content-Type": "application/json",
  };
};
const genFormHeaders = () => {
  return {
    Authorization: `Token ${getAuthToken()}`,
    "Content-Type": "multipart/form-data",
  };
};

// request functions

const getFromServer = async (url:any) => {
  try {
    store.dispatch(setRequestLoading(true))
    const res = await axios.get(`${BASE_URL}${url}`, { headers: genHeaders() });
    store.dispatch(setRequestLoading(false))
    if (res.status === 200 || res.status === 201) {
      store.dispatch(setRequestLoading(false))
      return { status: true, data: res.data, detail: res.data.detail };
    } else if(res.status===401){
      store.dispatch(setRequestLoading(false))
      store.dispatch(logout());;
      return {status:false}
    }
    else {
      return { status:false};
    }
  } catch (error:any) {
    if (error.response && error.response.data && error.response.data.detail) {
      store.dispatch(setRequestLoading(false))
      if(error.response.status===401){
        store.dispatch(logout());;
         return {status:false}
      }
      return { status: error.response.status, detail: error.response.data.detail };
    } else return { status: false, detail: ERROR_MSG };
  }
};


const postToServer = async (url:string, data = {}) => {
  try {
    store.dispatch(setRequestLoading(true))
    const res = await axios.post(`${BASE_URL}${url}`, data, {
      headers: genHeaders(),
    });
    
    if(res.status===401){
      store.dispatch(logout());
      store.dispatch(setRequestLoading(false))
      return {}
    }
    
    store.dispatch(setRequestLoading(false))
    return { status: res.status, data: res.data };  
  } catch (error:any) {
    console.log(error)
    if (error.response) {
      if(error.response.status===401){store.dispatch(logout()); store.dispatch(setRequestLoading(false));  return {}}
      store.dispatch(setRequestLoading(false))
      return { status: error.response.status, data: error.response.data };
    } else {store.dispatch(setRequestLoading(false));return { status: false, data:{detail: "An error occurred"} };
    }
  }
};


const postToServerFileUpload = async (url:string, data = new FormData()) => {
  try {
    store.dispatch(setRequestLoading(true))
    const res = await axios.post(`${BASE_URL}${url}`, data, {
      headers: genFormHeaders(),
    });
    store.dispatch(setRequestLoading(false))
    if(res.status===401){
      store.dispatch(setRequestLoading(false))
      store.dispatch(logout());;
      return {}
    }
    return { status: res.status, data: res.data };  
  } catch (error:any) {
    if (error.response) {
      store.dispatch(setRequestLoading(false))
      if(error.response.status===401){
        store.dispatch(logout());;
        return {}
      }
      return { 
        status: error.response.status, 
        data: error.response.data 
      };
    } else {
      store.dispatch(setRequestLoading(false))
      return { status: false, data: "An error occurred" };
    }
  }
};


const patchToServer = async (url:string, data = {}) => {
  try {
    store.dispatch(setRequestLoading(true))
    const res = await axios.patch(`${BASE_URL}${url}`, data, {
      headers: genHeaders(),
    });
    store.dispatch(setRequestLoading(false))
    if(res.status===401){
      store.dispatch(logout());;
      return {}
    }
    return { status: res.status, data: res.data };  
  } catch (error:any) {
    store.dispatch(setRequestLoading(false))
    if (error.response) {
      if(error.response.status===401){
        store.dispatch(logout());;
        return {}
      }
      return { 
        status: error.response.status, 
        data: error.response.data 
      };
    } else {
      store.dispatch(setRequestLoading(false))
      return { status: false, detail: "An error occurred" };
    }
  }
};

const putToServer = async (url:string, data = {}) => {
  try {
    const res = await axios.put(`${BASE_URL}${url}`, data, {
      headers: genHeaders(),
    });
    if (res.status === 200 || res.status === 201) {
      return { status: true, data: res.data.data, detail: res.data.detail };
    } else {
      console.log("ERROR => Something went wrong.");
    }
  } catch (error:any) {
    if (error.response && error.response.data && error.response.data.detail) {
      return { status: false, detail: error.response.data.detail };
    } else return { status: false, detail: ERROR_MSG };
  }
};


const deleteFromServer = async (url:string, data = {}) => {
  try {
    const res = await axios.delete(`${BASE_URL}${url}`, {
      headers: genHeaders(),
      data: data, 
    });
    console.log(genHeaders());
    return { status: res.status, data: res.data };
  } catch (error:any) {
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      return { status: false, data: "An error occurred" };
    }
  }
};

export { getFromServer, postToServer, putToServer ,deleteFromServer,patchToServer,postToServerFileUpload ,BASE_URL};

import axios from "axios";
import { getAuthToken } from "./auth";

// constants
const BASE_URL = "http://localhost:8000";
// const BASE_URL = 'http://13.53.197.82:8000';

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
    const res = await axios.get(`${BASE_URL}${url}`, { headers: genHeaders() });
    if (res.status === 200 || res.status === 201) {
      return { status: true, data: res.data, detail: res.data.detail };
    } else {
      console.log("Something got Wrong")
      return { status:false};
    }
  } catch (error:any) {
    if (error.response && error.response.data && error.response.data.detail) {
      return { status: error.response.status, detail: error.response.data.detail };
    } else return { status: false, detail: ERROR_MSG };
  }
};

// const postToServer = async (url, data = {}) => {
//   try {
//     const res = await axios.post(`${BASE_URL}${url}`, data, {
//       headers: genHeaders(),
//     });
//     console.log(genHeaders())
//     if (res.status === 200 || res.status === 201) {
//       return { status: true, data: res.data };
//     } else {
//       return {status:res.status}
//     }
//   } catch (error) {
//     if (error.response && error.response.data && error.response.data.detail) {
//       return { status: error.response.status, data: error.response.data };
//     } else return { status: error.response.status,  data: error.response.data };
//   }
// };

const postToServer = async (url:string, data = {}) => {
  try {
    const res = await axios.post(`${BASE_URL}${url}`, data, {
      headers: genHeaders(),
    });
    return { status: res.status, data: res.data };  
  } catch (error:any) {
    if (error.response) {
      return { 
        status: error.response.status, 
        data: error.response.data 
      };
    } else {
      return { status: false, data: "An error occurred" };
    }
  }
};


const postToServerFileUpload = async (url:string, data = new FormData()) => {
  try {
    
    const res = await axios.post(`${BASE_URL}${url}`, data, {
      headers: genFormHeaders(),
    });
    return { status: res.status, data: res.data };  
  } catch (error:any) {
    if (error.response) {
      return { 
        status: error.response.status, 
        data: error.response.data 
      };
    } else {
      // General fallback when error.response is undefined
      return { status: false, data: "An error occurred" };
    }
  }
};


const patchToServer = async (url:string, data = {}) => {
  try {
    const res = await axios.patch(`${BASE_URL}${url}`, data, {
      headers: genHeaders(),
    });
    
    // Optional: log headers for debugging
    console.log(genHeaders());   
    return { status: res.status, data: res.data };  
  } catch (error:any) {
    if (error.response) {
      // Handling the case when there's a detailed error response
      return { 
        status: error.response.status, 
        data: error.response.data 
      };
    } else {
      // General fallback when error.response is undefined
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

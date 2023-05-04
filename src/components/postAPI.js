import axios from "axios";


const api = axios.create({
    baseURL: "https://itypebackend.onrender.com/"
})

let accessToken = localStorage.getItem("AT")
api.defaults.headers.common['Authorization'] = `Bearer `+ accessToken; //sets default header if user is signed in 

export function setAccessToken(){ //if user logs in then this function is called externally so that the token is updated
    accessToken = localStorage.getItem("AT")
    api.defaults.headers.common['Authorization'] = `Bearer `+ accessToken;
}



export default api
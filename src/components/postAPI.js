import axios from "axios";


const api = axios.create({
    baseURL: "https://itypebackend.onrender.com/"
})


function signOut(){
    localStorage.clear()
}


export function refreshAcessToken(){
    const refreshToken = localStorage.getItem("RT")
    let reqBody = {
        refreshToken
    }
    axios.post('https://itypeauth.onrender.com/auth/accessToken',reqBody).then(token =>{
        const data = token.data
        const accessToken = data.accessToken
        localStorage.setItem('AT',accessToken) //update current token in LS
        setAccessToken()
    })
    .catch(err=>{ //if error than the refresh token has expired
        console.log(err)
        signOut()
    })
}


let accessToken = localStorage.getItem("AT")
api.defaults.headers.common['Authorization'] = `Bearer `+ accessToken; //sets default header if user is signed in 

export function setAccessToken(){ //if user logs in then this function is called externally so that the token is updated
    accessToken = localStorage.getItem("AT")
    api.defaults.headers.common['Authorization'] = `Bearer `+ accessToken;
}



export default api
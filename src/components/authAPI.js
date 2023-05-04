import axios from "axios";

function refreshAcessToken(){
    const refreshToken = localStorage.getItem("RT")
    let reqBody = {
        refreshToken
    }
    axios.post('https://itypeauth.onrender.com/auth/accessToken',reqBody).then(token =>{
        const data = token.data
        const accessToken = data.accessToken
        localStorage.setItem('AT',accessToken)
    })
    .catch(err=>{ //if error than the refresh token has expired
        console.log(err)
        signOut()
    })
}

function signOut(){
    localStorage.clear()
}

export {refreshAcessToken}

export default axios.create({
    baseURL: "https://itypeauth.onrender.com/auth"
})
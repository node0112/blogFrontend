import axios from "axios";
import useState from "react";

function refreshAcessToken(){
    const refreshToken = 'bearer ' + localStorage.getItem("RT")
    let reqBody = {
        refreshToken
    }
    axios.post('https://itypeauth.onrender.com/auth/accessToken',reqBody).then(token =>{
        const data = token.data
        const accessToken = data.accessToken
        localStorage.setItem('AT',accessToken)
        return ''
    })
    .catch(err=>{ //if error then the refresh token has expired
        console.log(err)
        signOut()
        return('signout')
    })
}

function signOut(){
    localStorage.clear()
}

export {refreshAcessToken}

export default axios.create({
    baseURL: "https://itypeauth.onrender.com/auth"
})
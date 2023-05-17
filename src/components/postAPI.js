import axios from "axios";


const api = axios.create({
    baseURL: "https://itypebackend.onrender.com/"
})

export function refreshAcessToken(fetch){
    const refreshToken = localStorage.getItem("RT")
    console.log('refresh token' + refreshToken)
    const userEmail = localStorage.getItem('email')
    let reqBody = {
        refreshToken,
        user: userEmail
    }
    axios.post('https://itypeauth.onrender.com/auth/accessToken',reqBody).then(token =>{
        console.log(token)
        const data = token.data
        const accessToken = data.accessToken
        localStorage.setItem('AT',accessToken) //update current token in LS
        setAccessToken()
        if(fetch){
            fetch() //re fetches post with the given function
        }
        return("")
    })
    .catch(err=>{ //if error than the refresh token has expired
        console.log(err.message)
        signOut() //sign the user out as there is a error in the refresh token
        if(err) return "signout"
    })
}

function signOut(){
    localStorage.clear()
    setAccessToken()
}


export async function setAccessToken(){ //if user logs in then this function is called externally so that the token is updated
    const AT = localStorage.getItem('AT')
    api.defaults.headers.common['Authorization'] = `Bearer `+ AT;
}



export default api
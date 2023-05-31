import axios from "axios";


const api = axios.create({
    baseURL: "https://itypebackend.onrender.com/"
})

export function refreshAcessToken(fetch){ //this function gets a new accesstoken everytime it's called
    const refreshToken = localStorage.getItem("RT")
    const userEmail = localStorage.getItem('email')
    let reqBody = {
        refreshToken,
        user: userEmail
    }
    axios.post('https://itypeauth.onrender.com/auth/accessToken',reqBody).then(token =>{
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

export function checkResponseForTokErrors(resData,setLoading, fetchPost){
    let data = resData.data
    let errors = []
    if(data.errors) errors = data.errors;
    setLoading(false)
    if(errors.length > 0){ //use refresh token if AT expired
    if(errors[0]){ //if errors in the token
        let error = refreshAcessToken(fetchPost)
        if(error == 'signout'){
        navigate('/account')
        console.log('signout')
        return true
        //location.reload()
        }
        return true
    }
    return errors
    }
    else return false
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
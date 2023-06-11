import React, { useEffect, useState } from 'react'
import authAPI from './authAPI'
import './css/loginpage.css'
import Loading from './Loading'
import '../components/postAPI'
import postAPI, { checkResponseForTokErrors, setAccessToken } from '../components/postAPI'


function LoginPage({insertPosts}) {
  
  const [signedIn,setSignedIn] = useState(true)
  const [email, setEmail ] = useState("")
  const [password, setPassword ] = useState("")
  const [username, setUsername] = useState("")
  const [userID,setUserID] = useState('')
  const [loading,setLoading] = useState(false)

  const [accPosts, setAccPosts] = useState([])

  useEffect(() => {
    let accessToken = localStorage.getItem("AT")
    let lsEmail = localStorage.getItem('email')
    let lsUsername = localStorage.getItem('username')
    let lsUserID = localStorage.getItem('userID')
    lsEmail ? setEmail(lsEmail) : null
    lsUsername ? setUsername(lsUsername) : null
    lsUserID ? setUserID(lsUserID) : null
  
    //check if user is signed in
    lsEmail ? setSignedIn(true) : setSignedIn(false)

    //check if user is signed in by looking if cookies are stored
  }, [])

  async function checkError(mode){
    let errors = []
    if(  password === null || password.length < 5){
      errors.push("Password must be at least 5 characters")
    }
    if(email === null||email.length < 7  ){
      errors.push("Email must be at least 7 characters")
    }
    if(mode === "signup"){
      if(username === null||username.length < 3  ){
        errors.push("Username must be at least 3 characters")
      }
    }
    if(errors.length > 0){
      showErrors(errors)
      return true
    }
    return false
    }


  async function signup(){
    if(! await checkError('signup')){ //if there are no errors
      setLoading(true)
      const signupDetails = { //create response in json format
        username,
        password,
        email
      }
      authAPI.post('/signup' , signupDetails).then(res => {
        let errors = []
        if(res.data.errors){
          errors = res.data.errors
        }
        if(errors.length > 0 ){
          let errorMessages = [ ]
          errors.forEach(error =>{
            errorMessages.push(error.msg)
          })
          showErrors(errorMessages)
        }
        else{        
          saveLocal(res.data)
          setSignedIn(true)
        }
      })
      .catch(err =>{
        setLoading(false)
        console.log(err)
      })
    }
  } 
  async function login(){
    if(! await checkError('login')){ //if there are no errors
      setLoading(true)
      const loginDetails = { //create response in json format
        password,
        email
      }
      authAPI.post('/login' , loginDetails).then(res => {
        const errors = res.data.errors
        const data = res.data
        setLoading(false)
        if(errors.length > 0 ){ //handle all the errors
          let errorMessages = [ ]
          errors.forEach(error =>{
            errorMessages.push(error.msg)
          })
          showErrors(errorMessages)
        }
        //else save in local storage\
        else{
          saveLocal(data)
          //set loged in to true so that sign up form gets removed
          setSignedIn(true)
        }
      })
      .catch(err =>{
        setLoading(false)
        console.log(err)
      })
    }
  } 
  function signout(){
    localStorage.clear() //delete all user data from ls and set all variables to default state
    setSignedIn(false)
    setAccessToken()
    setEmail('')
    setUserID('')
    setUsername('')
  }

  function saveLocal(data){
    let refreshToken = data.refreshToken
    let accessToken = data.accessToken
    let user = data.user
    let userID = data.user.id
    localStorage.setItem('RT', refreshToken)
    localStorage.setItem('AT', accessToken)
    localStorage.setItem('email', user.email )
    localStorage.setItem('username', user.username)
    localStorage.setItem('userID',userID)
    setAccessToken() //set accesstoken to current data
  }

  
  async function showErrors(errors){
    setLoading(false)
    errors.forEach(err => {
      const loginForm = document.querySelector('.login-form')
      const error = document.createElement('div')
      error.classList.add('error')
      error.textContent = err
      loginForm.appendChild(error)
      setTimeout(() => {
        error.style.opacity = "0"
      }, 3000);
      setTimeout(() => {
        loginForm.removeChild(error)
      }, 4000);
    });
   
  }
  
  async function getUserPosts(){ //fetch posts for user
    setLoading(true)
    postAPI.get('/post/'+userID+'/userposts').then(resData => {
      let errorStatus = checkResponseForTokErrors(resData, setLoading, getUserPosts)
      if(!errorStatus){
        const posts  = resData.data
        setAccPosts(posts)
        insertPosts(posts)
      }
      setLoading(false)
    }).catch(err =>{
      setLoading(false)
      console.log(err)
    })
  }
  useEffect(() => {
    //fetch user info from api if user is signed in
    if(signedIn){
      if(userID && accPosts.length < 1) getUserPosts()
    }
  }, [signedIn,userID])

  return (
    <div>
       <div className='content-title'>Account</div>
       <Loading loading={loading} />
       {!signedIn ? 
       <div className="login-box flex flex column vertical">
        <div className="small-heading" style={{marginBottom: "45px"}}>Log-in Or Sign-up</div>
        <form className="login-form flex column horizontal">
          <label htmlFor="email" style={{marginBottom: "10px"}}>Email Fake/Real</label>
          <input type="email" className="account-inp" id="email" minLength="7" value={email} onInput={(email)=>{setEmail(email.target.value)}} />
          <label htmlFor="password" style={{marginBottom: "10px", marginTop: "30px"}}>Password</label>
          <input type="password" className="account-inp" id="password" minLength="5" value={password} onInput={(pass)=>{setPassword(pass.target.value)}}/>
          <label htmlFor="username" style={{marginBottom: "10px", marginTop: "30px"}} >Username (Only For Signup)</label>
          <input type="text" className="account-inp" id="username" minLength="5" value={username} onInput={(username)=>{setUsername(username.target.value)}}/>
          <div className="button-container flex" style={{marginBottom: '50px'}}>
            <button type='button' className='form-button' onClick={login}>Login</button>
            <button type='button' className='form-button' onClick={signup}>Sign Up</button>
          </div>
        </form>
       </div>
       :
      <div className="account-container" style={{marginLeft: "7px"}}>
        <div className="top-acc-container flex column" >
          <div className="small-heading" style={{marginBottom:"25px"}} >Info</div>
          <div className="account-info flex column">
            <div className="smaller-heading flex" style={{gap: '10px'}}>Username: <div>{username}</div></div>
            <div className="smaller-heading flex" style={{gap: '10px'}}>Email: <div>{email}</div></div>
            <div className="button-container flex" style={{marginBottom: '50px',gap: '10px',marginTop: '10px' ,width: 'max-content'}}>
            <button type='button' className='form-button cursor' onClick={signout} >Sign Out</button>
            <button type='button' className='form-button cursor' >Delete Account</button>
          </div>
          </div>
        </div>
        <div className="acc-stat-container defont"> 
          <div className="small-heading" style={{marginBottom:"25px",marginTop:'-25px'}} >Stats</div>
          <div className="acc-stats flex">
            <div className="stat-name">Likes Received: </div>
            <div className="stat-value">0</div>
          </div>
        </div>
        <div className="acc-bottom-container">
          <Loading loading={loading} />
          <div className="small-heading" style={{marginBottom:"25px"}} >Posts</div>
          <div className="posts-container"></div>
        </div>
        
      </div>
      }
    </div>
  )
}

export default LoginPage
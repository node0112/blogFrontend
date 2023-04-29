import React, { useEffect, useState } from 'react'
import authAPI from './authAPI'
import './css/loginpage.css'
import Loading from './Loading'


function LoginPage() {
  
  const [sigednIn,setSignedIn] = useState(false)
  const [email, setEmail ] = useState("")
  const [password, setPassword ] = useState("")
  const [username, setUsername] = useState("")
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    let accessToken = localStorage.getItem("AT")
    accessToken ? console.log(accessToken) : null
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
        const errors = res.data.errors
        if(errors.length > 0 ){
          let errorMessages = [ ]
          errors.forEach(error =>{
            errorMessages.push(error.msg)
          })
          showErrors(errorMessages)
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
        console.log(res)
        if(errors.length > 0 ){
          let errorMessages = [ ]
          errors.forEach(error =>{
            errorMessages.push(error.msg)
          })
          showErrors(errorMessages)
        }
      })
      .catch(err =>{
        setLoading(false)
        console.log(err)
      })
    }
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
  return (
    <div>
       <div className='content-title'>Account</div>
      <Loading loading={loading} />
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
    </div>
  )
}

export default LoginPage
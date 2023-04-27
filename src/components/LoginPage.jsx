import React, { useEffect, useState } from 'react'
import './css/loginpage.css'

function LoginPage() {
  useEffect(() => {
    //check if user is signed in by looking if cookies are stored
  }, [])
  
  let [email, setEmail ] = useState("")
  let [password, setPassword ] = useState("")

  useEffect(()=>{
    console.log(password)
  },[password])
  return (
    <div>
       <div className='content-title'>Account</div>
       <div className="login-box flex flex column vertical">
        <div className="small-heading" style={{marginBottom: "45px"}}>Log-in Or Sign-up</div>
        <form className="login-form flex column horizontal">
          <label htmlFor="email" style={{marginBottom: "10px"}}>Email Fake/Real</label>
          <input type="email" className="account-inp" id="email" minLength="7" />
          <label htmlFor="password" style={{marginBottom: "10px", marginTop: "30px"}}>Password</label>
          <input type="password" className="account-inp" id="password" minLength="5" onInput={(pass)=>{setPassword(pass.target.value)}}/>
          <div className="button-container flex">
            <button className='form-button'>Login</button>
            <button className='form-button'>Sign Up</button>
          </div>
        </form>
       </div>
    </div>
  )
}

export default LoginPage
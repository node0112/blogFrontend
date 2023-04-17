import { useEffect, useState } from 'react'
import './css/header.css'

function Header() {
  const [count, setCount] = useState(0)

  function changeColor(){
    let header = document.querySelector(".header")
    let headerRect = header.getBoundingClientRect().top
    console.log(headerRect)

    let percentScroll = (headerRect*100)/75
    if(percentScroll <= 1) percentScroll = 1  //prevent value from becoming zero 
    percentScroll = Math.abs(100 - percentScroll) //reverses the percentage so that color goes from black to white on scroll up
    let gBValue = 2.38*percentScroll //get values for grayblack color
    let lGValue = 1.17*percentScroll //get values for lightgray color

    const root = document.querySelector(':root') 
    root.style.setProperty('--grayblackheader', "rgb("+(17+gBValue)+","+(17+gBValue)+","+(17+gBValue)+")") //updates element's value
    root.style.setProperty('--darkgray', "rgb("+(138+lGValue)+","+(138+lGValue)+","+(138+lGValue)+")") 
  }
  useEffect(() => {
  window.addEventListener("scroll", ()=>{
    changeColor()
  })
  }, [])
  
  
  return (
    <div className="header flex vertical defont">
        <div className='head-left defont flex '>
          <div className='header-link selected cursor'><a>Home</a></div>
          <div className='header-link cursor'><a>Create</a></div>
          <div className='header-link cursor'><a>Drafts</a></div>
        </div>
        <div className="head-right">
          <input type="text" className="searchbox" placeholder='Search A Post'/>
        </div>
    </div>
  )
}

export default Header

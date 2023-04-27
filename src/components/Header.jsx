import { useEffect } from 'react'
import './css/header.css'
import { useLocation, useNavigate } from 'react-router-dom'

function Header({selected,setSelected}) {

  function changeColor(){
    let header = document.querySelector(".header")
    let headerRect = header.getBoundingClientRect().top

    let percentScroll = (headerRect*100)/75
    if(percentScroll <= 1) percentScroll = 1  //prevent value from becoming zero 
    percentScroll = Math.abs(100 - percentScroll) //reverses the percentage so that color goes from black to white on scroll up
    let gBValue = 2.38*percentScroll //get values for grayblack color
    let lGValue = 1.17*percentScroll //get values for lightgray color

    const root = document.querySelector(':root') 
    root.style.setProperty('--grayblackheader', "rgb("+(17+gBValue)+","+(17+gBValue)+","+(17+gBValue)+")") //updates element's value
    root.style.setProperty('--darkgray', "rgb("+(138+lGValue)+","+(138+lGValue)+","+(138+lGValue)+")") 
  }

  function updateHeader(){ //updates header selected text to match current page
    let selectedElement = document.querySelector('.selected')
    selectedElement.classList.remove("selected")
    const newSelected = document.getElementById(selected)
    newSelected.classList.add("selected")
  }

  useEffect(updateHeader,[selected])
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
  window.addEventListener("scroll", ()=>{
    changeColor()
  })
  let path = location.pathname
  path = path.substring(1,path.length)
  if(path === ""){ //special case for home since home is the default address and it's path is empty
    path = ('home')
  }
  setSelected(path) 
  }, [])
  
  
  return (
    <div className="header flex vertical defont">
        <div className='head-left defont flex '>
          <div className='header-link selected cursor' id='home' onClick={()=>{navigate("/"); setSelected("home")}}>Home</div>
          <div className='header-link cursor' id='create' onClick={()=>{navigate("/create"); setSelected("create")}}>Create</div>
          <div className='header-link cursor'  id="drafts" onClick={()=>{navigate("/drafts");setSelected("drafts")}}>Drafts</div>
          <div className='header-link cursor'  id="account" onClick={()=>{navigate("/account");setSelected("account")}}>Acc</div>
        </div>
        <div className="head-right">
          <input type="text" className="searchbox" placeholder='Search A Post'/>
        </div>
    </div>
  )
}

export default Header

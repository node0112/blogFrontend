import { useEffect, useState } from 'react'
import './css/header.css'
import { useLocation, useNavigate } from 'react-router-dom'

function Header({selected,setSelected, setDraftMode, searchPost}) {
  const [email,setEmail] = useState('')
  const [username,setUsername] = useState('')
  const [tooltip,setTooltip] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  useEffect(()=>{
    //get user from ls if signed in
    let lsemail = localStorage.getItem('email')
    let lsUsername = localStorage.getItem('username')
    if(lsemail){
        setTooltip(true)
        setEmail(lsemail)
        setUsername(lsUsername)
    }

  },[])
  
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
  if(path === "post"){
    path = ('home')
  }
  setSelected(path) 
  }, [])
  
  async function initiateSearch(){
    if(searchQuery.length < 6){
      renderError("Type Atleast 5 letters")
    }
    const query = searchQuery //to pass the object as a var instead of a state
    searchPost(query)
  }

  function renderError(error){
    const searchInput = document.querySelector('.searchbox')
    searchInput.value = error
    searchInput.style.color = 'red' 
    searchInput.style.borderBottom = '4px solid red;'

    setTimeout(() => {
      searchInput.value = searchQuery
      searchInput.style.color = '' //sets te color back to default
      searchInput.style.borderBottom = '4px solid var(--accent);'
    }, 1500);
  } 
  
  return (
    <div className="header flex vertical defont">
        <div className='head-left defont flex '>
          <div className='header-link selected cursor' id='home' onClick={()=>{navigate("/"); setSelected("home"); setDraftMode(false)}}>Home</div>
          <div className='header-link cursor' id='create' onClick={()=>{navigate("/create"); setSelected("create");  setDraftMode(false) }}>Create</div>
          <div className='header-link cursor'  id="drafts" onClick={()=>{navigate("/drafts");setSelected("drafts")}}>Drafts</div>
          <div className='header-link material-icons cursor' style={{fontSize: "25px"}}  id="account" onClick={()=>{navigate("/account");setSelected("account");  setDraftMode(false) }}>person
          </div>
          {tooltip ? <span class="tooltiptext flex column"><div>{email}</div><div>{username}</div></span> : null}
        </div>
        <div className="head-right flex center vert">
          <input type="text" className="searchbox" placeholder='Search A Post' onChange={e =>{setSearchQuery(e.target.value)}}/>
          <div class="header-link material-icons cursor" id="search" onClick={initiateSearch}>search</div>
        </div>
    </div>
  )
}

export default Header

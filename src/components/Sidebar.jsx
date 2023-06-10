import React, { useEffect } from 'react'
import './css/sidebar.css'
import { useLocation, useNavigate } from 'react-router-dom'

function Sidebar({selected, setSelected, setDraftMode, setSidebarOpen, sidebarOpen}) {
  const navigate = useNavigate()
  const location = useLocation()

  function updateSidebar(){ //updates header selected text to match current page
    console.log(selected)
    let selectedElement = document.querySelector('.selected-sb')
    selectedElement.classList.remove("selected-sb")
    const newSelected = document.getElementById('sidebar'+selected)
    newSelected.classList.add("selected-sb")
  }

  
  useEffect(updateSidebar,[selected])
  
  useEffect(()=>{
    let path = location.pathname
    path = path.substring(1,path.length)
    if(path === ""){ //special case for home since home is the default address and it's path is empty
      path = ('home')
    }
    if(path === "post"){
      path = ('home')
    }
    setSelected(path)
  },[])

  useEffect(() => {
    const sidebarElement = document.querySelector('.sidebar')
    if(sidebarOpen){
      sidebarElement.style.left = '0'
    }
    else if(!sidebarOpen){
      sidebarElement.style.left = '-181px'
    }
  }, [sidebarOpen])
  



  return (
    <div className="sidebar flex horizontal">
        <div className="sidebar-top-container flex column">
          <div className="sidebar-link selected-sb" id='sidebarhome' onClick={()=>{navigate("/"); setSelected("home"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800)} } >Home</div>
          <div className="sidebar-link" id='sidebarcreate'  onClick={()=>{navigate("/create"); setSelected("create"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800) }} >Create</div>
          <div className="sidebar-link" id='sidebardrafts' onClick={()=>{navigate("/drafts"); setSelected("drafts"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800) }} >Drafts</div>
          <div className="sidebar-link" id='sidebaraccount'  onClick={()=>{navigate("/account"); setSelected("account"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800) }} >Account</div>
        </div>
    </div>
  )
}

export default Sidebar
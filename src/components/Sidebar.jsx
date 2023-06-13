import React, { useEffect } from 'react'
import './css/sidebar.css'
import { useLocation, useNavigate } from 'react-router-dom'

function Sidebar({selected, setSelected, setDraftMode, setSidebarOpen, sidebarOpen, fact}) {
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
      sidebarElement.style.left = '-195px'
    }
  }, [sidebarOpen])
 



  return (
    <div className="sidebar flex column vertical">
        <div className="sidebar-top-container flex column">
          <div className="sidebar-link selected-sb" id='sidebarhome' onClick={()=>{navigate("/"); setSelected("home"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800)} } >Home</div>
          <div className="sidebar-link" id='sidebarcreate'  onClick={()=>{navigate("/create"); setSelected("create"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800) }} >Create</div>
          <div className="sidebar-link" id='sidebardrafts' onClick={()=>{navigate("/drafts"); setSelected("drafts"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800) }} >Drafts</div>
          <div className="sidebar-link" id='sidebaraccount'  onClick={()=>{navigate("/account"); setSelected("account"); setDraftMode(false);setTimeout(() => { setSidebarOpen(false) }, 800) }} >Account</div>
        </div>
        <div className="sidebar-bottom-container  column ">
          <div className="fact-container defont flex column" style={{maxWidth: '133pxz'}}>
              <div className="fact-title flex vertical" style={{fontSize: '20px'}}>Daily Fact<div className="material-icons cursor" style={{'marginLeft': '5px', 'fontSize' : '30px'}}>psychology</div></div>
              <div className="fact-text" style={{fontSize: '15px'}}>{fact}</div>
          </div>
          <div className="sidebar-stat-container defont"> 
              <div className="stats flex" style={{justifyContent: 'flex-start'}}>
                <div className="stat-name">Likes Received: </div>
                <div className="stat-value">0</div>
              </div>
              <div className="stats flex" style={{justifyContent: 'flex-start'}}  >
                <div className="stat-name">Comments: </div>
                <div className="stat-value">0</div>
              </div>
          </div>
        </div>
    </div>
  )
}

export default Sidebar
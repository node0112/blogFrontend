import { useEffect, useState } from 'react'
import './css/header.css'
import { useLocation, useNavigate } from 'react-router-dom'
import postAPI, { checkResponseForTokErrors, setAccessToken } from './postAPI'


function Header({selected,setSelected, setDraftMode, setLoading, insertPosts, clearPosts}) {

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

  useEffect(()=>{ //get user from ls if signed in
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

  useEffect(() => { //change color of header and show tooltip
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

  useEffect(()=>{
    const tooltipelem = document.querySelector('.tooltiptext')
    if(tooltip){
      tooltipelem.style.opacity = '0'
      const accElem = document.getElementById('account')
      accElem.addEventListener('mouseover', ()=>{
        tooltipelem.style.opacity = '1' 
      })
      accElem.addEventListener('mouseout', ()=>{
        tooltipelem.style.opacity = '0' 
      })
    }
  }, [tooltip])

  async function initiateSearch(){
    if(searchQuery.length < 6){
      renderError("Type Atleast 5 letters")
      return
    }
    searchPost()
  }

  async function searchPost(){ //search posts from the db
    setLoading(true)
    navigate('/')
    setSelected('home')
    const reqSearch= {
      search: searchQuery
    }
    postAPI.post('/post/search',reqSearch).then(resData=>{ //returns an array of all posts if found else returns empty array
      console.log(resData)
      const errorStatus = checkResponseForTokErrors(resData,setLoading,searchPost) //checks response for token related errors
      if(!errorStatus){
        console.log(resData)
        let posts = resData.data
        const totalResults = posts.length
        console.log(totalResults)
        clearPosts()
        document.querySelector('.content-title').textContent = totalResults + " Posts Found"
        insertPosts(posts)
      }

      else{ //show and error and tell that it is retrying
        renderError('Error; Retrying in 20s')
      }
    }).catch(err =>{
      console.log(err.message)
    }) 
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
    }, 3000);
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
          <input type="text" className="searchbox" placeholder='Search A Post' onKeyDown={(e)=>{e.key === 'Enter' ? initiateSearch()  : null}} onChange={e =>{setSearchQuery(e.target.value)}}/>
          <div class="header-link material-icons cursor" id="search" onClick={initiateSearch}>search</div>
        </div>
    </div>
  )
}

export default Header

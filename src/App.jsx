import { useEffect, useState } from 'react'
import './App.css'
import './reset.css'
import Header from './components/Header'
import Home from './components/Home'
import postAPI, { setAccessToken } from './components/postAPI'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Editpage from './components/EditPage'
import LoginPage from './components/LoginPage'
import PostPage from './components/PostPage'
import Loading from './components/Loading'
import Draft from './components/Draft'


function App() {

  const navigate = useNavigate() //set to variable

  const [selected, setSelected] = useState("home")
  const[ posts,setPosts] = useState([])
  const[ draftPosts,setDraftPosts] = useState([])
  const [postID, setPostID] = useState('')
  const [loading,setLoading] = useState(true)
  const [draftMode, setDraftMode] = useState(false)

  useEffect(()=>{
    //get posts for hompage
    fetchPosts()
    //set access token and refreshtokens
    setAccessToken()
  },[Home])
  

  async function fetchPosts(){
    setLoading(true)
    postAPI.get("home")
    .then(res=>{
      setPosts(res.data.posts); 
      setLoading(false)
    })
    .catch(err =>{return err  }) //handle error 
  }

  function getDraftPosts(){
    let userID = localStorage.getItem('userID')
    postAPI.get('/user/'+ userID + '/drafts').then(res => {
        setDraftPosts(res.data.posts)
    })
  }

  function insertPosts(posts){ //post constructors
    posts.forEach(post => {
      //insert elements inside the dom
      let postContainer = document.querySelector('.posts-container')
      const newPost = document.createElement('div')
      newPost.className = 'post flex column'
      let bgColor = post.backgroundColor
      let textColor = post.textColor
      newPost.style.backgroundColor = bgColor
      newPost.style.color = textColor

      const postTopContainer = document.createElement('div')
      postTopContainer.className = 'post-top-container'
      const postBottomContainer = document.createElement('div')
      postBottomContainer.className = 'post-bottom-container'

      const postTitle = document.createElement('div')
      postTitle.className = 'post-title'
      postTitle.textContent = post.title
      
      const postAuthor = document.createElement('div')
      postAuthor.className = 'post-author'
      postAuthor.textContent = "Post By: " + post.author

      const postContent = document.createElement('div')
      postContent.className = 'post-content'
      postContent.textContent = post.summary

      const postDate = document.createElement('div')
      postDate.className = 'post-date'
      postDate.textContent = (post.date).substring(0,10)

      const postID = post._id 
      newPost.id = postID 

      if(post.draft){
        console.log(true)
      }

      newPost.addEventListener('click', ()=>{
        console.log(newPost.id)
        let id = newPost.id
        setPostID(id)
        navigate('/post')
      })


      //add everything to respective containers
      postTopContainer.appendChild(postTitle)
      postTopContainer.appendChild(postAuthor)
      postTopContainer.appendChild(postContent)

      postBottomContainer.appendChild(postDate)

      newPost.appendChild(postTopContainer)
      newPost.appendChild(postBottomContainer)

      postContainer.appendChild(newPost)

      const height = newPost.scrollHeight
      return height //so that it casn used to bg to the height of the post
    });   
  }

  useEffect(getDraftPosts,[Draft])
  

  
  return (
    <div className="App">
      <Loading loading={loading} />
        <div className='logo-bar'> <i className="menu-logo">menu</i> ITYPE</div>
        <Header selected={selected} setSelected={setSelected} />
        <div className='content-container flex column'>
            <Routes>
            <Route path = "/"  element = {<Home posts={posts} setPostID = {setPostID}  insertPosts={insertPosts} />} />
            <Route path = "/create"  element = {<Editpage type={"new"} setPostID={setPostID} />} />
            <Route path = "/account"  element = {<LoginPage />} />
            <Route path = "/post"  element = {<PostPage postID={postID} draftMode={draftMode} />} />
            <Route path = "/drafts"  element = {<Draft draftPosts={draftPosts} insertPosts={insertPosts}  setPostID = {setPostID} />} />
            </Routes>
        </div>
        {/* <Sidebar /> */}
    </div>
  )
}

export function accNav(){
  const navigate = useNavigate()
  navigate('/account')
}

export default App

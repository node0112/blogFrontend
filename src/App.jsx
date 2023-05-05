import { useEffect, useState } from 'react'
import './App.css'
import './reset.css'
import Header from './components/Header'
import Home from './components/Home'
import postAPI from './components/postAPI'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Editpage from './components/EditPage'
import LoginPage from './components/LoginPage'
import PostPage from './components/PostPage'
import Loading from './components/Loading'

function App() {

  const [selected, setSelected] = useState("home")
  const[ posts,setPosts] = useState([])
  const [postID, setPostID] = useState('')
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    //hide default loading screen after getting all posts
    //and inserting them in the DOM list
    fetchPosts()
  },[Home])

  async function fetchPosts(){
    setLoading(true)
    postAPI.get("home")
    .then(res=>{
      setPosts(res.data.posts); 
      console.log(posts)
      setLoading(false)
    })
    .catch(err =>{return err  }) //handle error 
  }

  
  return (
    <div className="App">
       <Loading loading={loading} />
      <BrowserRouter>
        <div className='logo-bar'> <i className="menu-logo">menu</i> ITYPE</div>
        <Header selected={selected} setSelected={setSelected} />
        <div className='content-container flex column'>
            <Routes>
            <Route path = "/"  element = {<Home posts={posts} setPostID = {setPostID}/>} />
            <Route path = "/create"  element = {<Editpage type={"new"} />} />
            <Route path = "/account"  element = {<LoginPage />} />
            <Route path = "/post"  element = {<PostPage postID={postID} />} />
            </Routes>
        </div>
        {/* <Sidebar /> */}
      </BrowserRouter>
    </div>
  )
}

export default App

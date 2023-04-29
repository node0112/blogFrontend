import { useEffect, useState } from 'react'
import './App.css'
import './reset.css'
import Header from './components/Header'
import Home from './components/Home'
import axios from 'axios'
import postAPI from './components/postAPI'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Editpage from './components/EditPage'
import LoginPage from './components/LoginPage'

function App() {

  const [selected, setSelected] = useState("home")

  let posts
  
  useEffect(()=>{
    //hide default loading screen after getting all posts
    //and inserting them in the DOM list
    fetchPosts()
  },[Home])

  async function fetchPosts(){
    postAPI.get("home")
    .then(res=>{posts =  res.data.posts; console.log(posts);insertPosts()})
    .catch(err =>{return err  }) //handle error 
  }

  function insertPosts(){ //post constructors
    posts.forEach(post => {
      //insert elements inside the dom
      let postContainer = document.querySelector('.posts-container')
      const newPost = document.createElement('div')
      newPost.className = 'post flex column'

      const postTopContainer = document.createElement('div')
      postTopContainer.className = 'post-top-container'
      const postBottomContainer = document.createElement('div')
      postBottomContainer.className = 'post-bottom-container'

      const postTitle = document.createElement('div')
      postTitle.className = 'post-title'
      postTitle.textContent = post.title
      
      const postAuthor = document.createElement('div')
      postAuthor.className = 'post-author'
      postAuthor.textContent = post.author

      const postContent = document.createElement('div')
      postContent.className = 'post-content'
      postContent.textContent = post.content

      const postDate = document.createElement('div')
      postDate.className = 'post-date'
      postDate.textContent = (post.date).substring(0,10)


      //add everything to respective containers
      postTopContainer.appendChild(postTitle)
      postTopContainer.appendChild(postAuthor)
      postTopContainer.appendChild(postContent)

      postBottomContainer.appendChild(postDate)

      newPost.appendChild(postTopContainer)
      newPost.appendChild(postBottomContainer)

      postContainer.appendChild(newPost)
    });   
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className='logo-bar'> <i className="menu-logo">menu</i> ITYPE</div>
        <Header selected={selected} setSelected={setSelected} />
        <div className='content-container flex column'>
            <Routes>
            <Route path = "/"  element = {<Home />} />
            <Route path = "/create"  element = {<Editpage type={"new"} />} />
            <Route path = "/account"  element = {<LoginPage />} />
            </Routes>
        </div>
        {/* <Sidebar /> */}
      </BrowserRouter>
    </div>
  )
}

export default App

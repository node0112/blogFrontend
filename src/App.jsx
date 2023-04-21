import { useEffect, useState } from 'react'
import './App.css'
import './reset.css'
import Header from './components/Header'
import Home from './components/Home'
import axios from 'axios'

function App() {

  const postServ = "https://itypebackend.onrender.com"
  const [count, setCount] = useState(0)

  let posts
  
  useEffect(()=>{
    //hide default loading screen after getting all posts
    //and inserting them in the DOM list
    fetchPosts()
  },[Home])

  async function fetchPosts(){
    axios.get("https://itypebackend.onrender.com/home")
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
      <div className='logo-bar'> <i className="menu-logo">menu</i> ITYPE</div>
      <div className='content-container flex column'>
       <Header />
       <Home />
      </div>
    </div>
  )
}

export default App

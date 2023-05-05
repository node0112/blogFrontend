import React, { useEffect } from 'react'
import './css/home.css'
import { useNavigate } from 'react-router-dom';
import PostPage from './PostPage';


function Home({posts,setPostID}) {  

  const navigate = useNavigate()


  function insertPosts(){ //post constructors
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
      postAuthor.textContent = post.author

      const postContent = document.createElement('div')
      postContent.className = 'post-content'
      postContent.textContent = post.content

      const postDate = document.createElement('div')
      postDate.className = 'post-date'
      postDate.textContent = (post.date).substring(0,10)

      const postID = post._id 
      newPost.id = postID 

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
    });   
  }

  useEffect(() => {
    insertPosts()
  }, [posts])
  

  return (
    <div className='home flex'>
      <div className="left-container">
        <div className='content-title'>Latest Posts</div>
        <div className='posts-container'>
            <div className="post flex column">
              <div className="post-top-container">
                <div className="post-title">The Capitalism Of Silicon Giants</div>
                <div className="post-author">Post By: Jay Walking</div>
                <div className="post-content">Through a turn of event which have now put chip manufacturers in the fore front of...</div>
              </div>
              <div className="post-bottom-container flex between">
                <div className='post-date'>03/02/2023</div>
                <div className="post-stats flex">
                  <div className="post-like">23</div>
                  <div className="post-comments">3</div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div className="right-container flex column ">
        <div className="fact-container defont flex column">
            <div className="fact-title">Daily Fact</div>
            <div className="fact-text">It takes 8 minutes for the light of the sun to reach Earth</div>
        </div>
        <div className="stat-container defont"> 
            <div className="stats flex">
              <div className="stat-name">Likes Received: </div>
              <div className="stat-value">0</div>
            </div>
            <div className="stats flex">
              <div className="stat-name">Comments: </div>
              <div className="stat-value">0</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home
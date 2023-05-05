import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import postAPI from './postAPI'
import { refreshAcessToken } from './postAPI';
import parse from 'html-react-parser';
import './css/postPage.css'
import Loading from './Loading';

function PostPage({postID}) {
  let navigate = useNavigate()

  const [parsedPost,setParsedPost] = useState('')
  const [postTitle,setPostTitle] = useState('')
  const [postAuthor,setPostAuthor] = useState('')
  const [postLikes,setLikes] = useState('')
  const [postDate,setPostDate] = useState('')
  const [loading,setLoading] = useState(false)

  const [postComments,setPostComments] = useState('')

  useEffect(()=>{
      fetchPost()
  },[])
  function fetchPost(){
    if(postID === '' ){
      navigate('/') //incase a user stumbles here bby accident
    }
    setLoading(true)
    postAPI.get('/post/'+postID).then(resData=>{
      let data = resData.data
      let errors = []
      if(data.errors) errors = data.errors;
      setLoading(false)
      if(errors.length > 0){ //refresh token if it has expired
        if(errors[0] === 'jwt expired' || errors[0] === 'jwt malformed'){ //if errors in the token
          refreshAcessToken().then(fetchPost)
        }
      }
      console.log(data)
      if(data.post){
        parsePost(data.post)
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }

  function parsePost(post){
    let parsedHtml = parse(post.content)
    setPostTitle(post.title)
    setPostAuthor(post.author)
    setLikes(post.likes)
    setPostDate(post.date.substring(0,10))
    setParsedPost(parsedHtml)
    document.querySelector('.main-post-author').style.color = post.textColor
  }


  return (
    <div className='main-post flex column'>
      <Loading loading={loading} />
      <div className="main-post-title">{postTitle}</div>
      <div className="post-info-container flex">
        <div className="main-post-author">By {postAuthor}</div>
        <div className="main-stat-container">
          <div className="likes">{postLikes}</div>
          <div className="comments"></div>
        </div>
        <hr className="sep-line" />
      </div>
      <div className="date">{postDate}</div>
      <div>{parse(parsedPost)}</div>
    </div>
  )
}

export default PostPage
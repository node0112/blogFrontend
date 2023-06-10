import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import postAPI from './postAPI'
import { checkResponseForTokErrors } from './postAPI';
import { refreshAcessToken } from './postAPI';
import parse from 'html-react-parser';
import './css/postPage.css'
import Loading from './Loading';

function PostPage({postID, setDraftMode, publishPost, unpublishPost, deletePost}) {
  let navigate = useNavigate()

  const [parsedPost,setParsedPost] = useState('')
  const [postTitle,setPostTitle] = useState('')
  const [postAuthor,setPostAuthor] = useState('Error, retrying in 20s') //default message incase post fetch fails
  const [postLikes,setLikes] = useState('')
  const [postDate,setPostDate] = useState('')
  const [loading,setLoading] = useState(false)

  const [isPostDraft, setIsPostDraft] = useState(false)
  const[postEdit, setPostEdit] = useState(false)

  const [postComments,setPostComments] = useState('')

  useEffect(()=>{
      fetchPost() //get post from server on inital render
  },[])

  async function fetchPost(){
    if(postID === '' ){
      navigate('/') //incase a user stumbles here bby accident
    }
    setLoading(true)
    postAPI.get('/post/'+postID).then(resData=>{
      let data = resData.data
      let errorStatus = checkResponseForTokErrors(resData, setLoading, fetchPost)
      console.log(errorStatus)
      if(!errorStatus){
          if(data.post){
          checkUser(data.post.user) //check if the current user is the author of the post
          parsePost(data.post)
          let height //this is used for the dark background for the post page since the container is an overflow element 
          setTimeout(() => {
            height = document.querySelector('.main-post').scrollHeight + 140
            document.querySelector('#post-bg').style.height = height + 'px'
          }, 200);
          document.querySelector('#post-bg').style.backgroundColor="black"
      }}
    })
    .catch(err=>{
      console.log(err.message)
    })
  }

  function parsePost(post){
    let parsedHtml = parse(post.content)
    setPostTitle(post.title)
    setPostAuthor("By: "+ post.author)
    setLikes(post.likes)
    setPostDate(post.date.substring(0,10))
    setParsedPost(parsedHtml)
    document.querySelector('.main-post-author').style.color = post.textColor

    //if post's draft is true then render edit buttons and then set it change draft mode and render edit page with draft mode as true

    if(post.draft){
      setPostEdit(true)
      setIsPostDraft(true)
      //render edit button
    }
  }

  function setEditPost(){
    setDraftMode(true)
    navigate('/create')
  }
   
  function checkUser(postUser){
    const userid = localStorage.getItem('userID')
    if(postUser === userid){
      setPostEdit(true) //make post editable
    }
  }

  function addLike(){
    //add a like or dislike based on wether the user had pressed the button
  }


  return (
    <div className='main-post flex column'>
      <Loading loading={loading} />
      <div className="main-post-title">{postTitle}</div>
      { postEdit ? <div className="material-icons cursor"  onClick={setEditPost} id='edit-icon'>edit_note</div> : null}
      <div id="post-bg"></div>
      <div className="post-info-container flex">
        <div className="main-post-author">{postAuthor}</div>
        <div className="main-stat-container">
          <div className="likes flex vertical horizontal">
           <div className="material-symbols-outlined" id='add-fav' onClick={addLike}>heart_plus</div>{postLikes}</div>
          <div className="comments"></div>
        </div>
        <hr className="sep-line" />
      </div>
      <div className="date">{postDate}</div>
      <div>{parse(parsedPost)}</div>
      { isPostDraft && postEdit ? <div>
        <div className="button publish-button"  onClick={publishPost} >Publish</div>
      </div> : null}
      { !isPostDraft && postEdit ? <div>
        <div className="button publish-button"  onClick={unpublishPost} >Unpublish</div>
      </div> : null}
      { postEdit ? <div>
        <div className="button publish-button"  onClick={deletePost} style={{"color" : 'red'}}>Delete</div>
      </div> : null}
    </div>
  )
}


export default PostPage
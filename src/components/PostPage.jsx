import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import postAPI from './postAPI'
import { checkResponseForTokErrors } from './postAPI';
import parse from 'html-react-parser';
import './css/postPage.css'
import Loading from './Loading';

function PostPage({postID, setDraftMode, publishPost, unpublishPost, deletePost}) {

  let navigate = useNavigate()
  useEffect(()=>{ //chheckj is user is signed in
    const user = localStorage.getItem('email')
    if(!user){
      navigate('/account')
    }
  })

  const [parsedPost,setParsedPost] = useState('')
  const [postTitle,setPostTitle] = useState('')
  const [postAuthor,setPostAuthor] = useState('Error, retrying in 20s') //default message incase post fetch fails
  const [postLikes,setLikes] = useState('')
  const [postDate,setPostDate] = useState('')
  const [loading,setLoading] = useState(false)

  const [isPostDraft, setIsPostDraft] = useState(false)
  const[postEdit, setPostEdit] = useState(false)

  const [postComments,setPostComments] = useState(false)
  const [commentInput, setCommentInput] = useState('')

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
    postAPI.post('/post/'+postID+'/upvote').then(res=>{
      if(res.status === 200){
        setLikes(postLikes+1)
        document.querySelector('.likes').style.color = 'red'
      }
    }).catch(err=>{
      console.log(err)
    })
  }

 function fetchComments(){
  setLoading(true)
    postAPI.get('/post/'+postID+'/comments').then(resData =>{
      setLoading(false)
      let errorStatus = checkResponseForTokErrors(resData,setLoading,fetchComments)
      if(!errorStatus){
        let commentsData = resData.data.comments
        console.log(commentsData)
        if(commentsData.length > 0) renderComments(commentsData)
        else setPostComments(true)
      }
    }).catch(err=>{
      setLoading(false)
      console.log(err)
    })
 }

 function renderComments(comments){ //render all comments into the dom
  const commentsContainer = document.getElementById('comments-container')
  setPostComments(true)
  comments.forEach(comment =>{
    const commentContainer = document.createElement('div')
    commentContainer.classList.add('comment-container')
    const commentInfo =  document.createElement("div")
    commentInfo.classList.add('comment-info')   
    commentInfo.classList.add('flex')

    const commenter =  document.createElement('div')
    commenter.classList.add('commenter')
    commenter.textContent = comment.username
    const commentDate =  document.createElement('div')
    commentDate.classList.add('comment-date')
    commentDate.textContent = comment.date.substring(0,10)
    commentInfo.appendChild(commenter)
    commentInfo.appendChild(commentDate)
    

    const commentEleme = document.createElement('div')
    commentEleme.classList.add('comment')
    commentEleme.textContent = comment.comment
    const likesContainer = document.createElement('div')
    const like = document.createElement('div')
    likesContainer.classList.add('flex')
    likesContainer.classList.add('vertical')
    likesContainer.classList.add('likes')
    const commentId = comment._id
    likesContainer.id = commentId
    likesContainer.onclick = (e =>{ addCommentLike(e.target.parentNode.id)})
    const heartIcon = document.createElement('i')
    heartIcon.classList.add('material-symbols-outlined')
    heartIcon.textContent = 'favorite'
    like.textContent = comment.likes
    likesContainer.appendChild(heartIcon)
    likesContainer.appendChild(like)
    likesContainer.classList.add('cursor')

    commentContainer.appendChild(commentInfo)
    commentContainer.appendChild(commentEleme)
    commentContainer.appendChild(likesContainer)
    commentsContainer.appendChild(commentContainer)
  })

  //update bg height
  let height = document.querySelector('.main-post').scrollHeight + 140
  document.querySelector('#post-bg').style.height = height + 'px'
 }

 async function addComment(){
  const commentInputElem = document.getElementById('comment-inp')
  const addCommentButton = document.getElementById('add-comment-btn')

  console.log(commentInput.length)
  addCommentButton.onclick = ''
  if(commentInput.length > 3){
    addCommentButton.classList.add('spin-animation')

    //construct comment req
    const user = localStorage.getItem('userID')
    const username = localStorage.getItem('username')
    let date = new Date()
    date = date.toISOString()

    const commentRes = {
      comment : commentInput,
      user,
      username,
      date
    }
    console.log(commentRes)
    postAPI.post('/post/'+postID+'/comment',commentRes).then(resData =>{
      const data = resData.data
      if(data.errors || resData.status === 500){
        commentInputElem.value = 'Error'
        setTimeout(() => {
          commentInputElem.value = commentInput
        }, 2000);
      }
      addCommentButton.classList.remove('spin-animation')
      commentInputElem.value = 'Added Comment'
      commentInputElem.style.color = 'yellowgreen'
      setTimeout(() => {
        commentInputElem.value = ''
        commentInputElem.style.color = ''
      }, 1500);
    }).catch(err =>{
      addCommentButton.classList.remove('spin-animation')
      commentInputElem.value = 'Error'
      setCommentInput('')
      setTimeout(() => {
        commentInputElem.value = ''
      }, 1500);
    })
    return
  }
  else{
    addCommentButton.style.color = 'red'
    addCommentButton.onclick = addComment
    commentInputElem.value = 'Error; Comment must be at least 3 characters long' 
    setTimeout(() => {
      addCommentButton.style.color = ''
    }, 1000);
    setTimeout(() => {
      commentInputElem.value = commentInput
    }, 2000);
  }
 }

 function addCommentLike(commentId){
    postAPI.post('post/comment/'+commentId+'/upvote').then(resData =>{
      const errStat = checkResponseForTokErrors(resData,addCommentLike, setLoading)
      if(!errStat){
        if(resData.status === 200){
          let currentComment = document.getElementById(commentId)
          const childElem = currentComment.children[1]
          let likes = childElem.textContent
          likes = Number(likes)
          childElem.textContent = likes+1
          currentComment.style.color = 'red'
          currentComment.onclick = (e =>{ removeCommentLike(e.target.parentNode.id)})
        }
      }
    }).catch(err=>{
      console.log(err)
    })
 }

 function removeCommentLike(commentId){
  postAPI.post('post/comment/'+commentId+'/downvote').then(resData =>{
    const errStat = checkResponseForTokErrors(resData,removeCommentLike, setLoading)
    if(!errStat){
      if(resData.status === 200){
        let currentComment = document.getElementById(commentId)
        const childElem = currentComment.children[1]
        let likes = childElem.textContent
        likes = Number(likes)
        childElem.textContent = likes-1
        currentComment.style.color = ''
        currentComment.onclick = (e =>{ addCommentLike(e.target.parentNode.id)})
      }
    }
  }).catch(err=>{
    console.log(err)
  })
 }
  useEffect(()=>{
    let contenWidth = document.querySelector('.main-post-title').clientWidth
    let lines = document.querySelectorAll('.sep-line')
    lines.forEach(line =>{
      line.style.width = contenWidth + 'px'
    })
  },[])


  return (
    <div className='main-post flex column'>
      <Loading loading={loading} />
      <div className="main-post-title">{postTitle}</div>
      { postEdit ? <div className="material-icons cursor"  onClick={setEditPost} id='edit-icon'>edit_note</div> : null}
      <div id="post-bg" ></div>
      <div className="post-info-container flex">
        <div className="main-post-author">{postAuthor}</div>
        <div className="main-stat-container flex" style={{'gap': '10px'}}>
          <div className="likes flex vertical horizontal">
           <div className="material-symbols-outlined cursor" id='add-fav' onClick={addLike}>heart_plus</div>{postLikes}
          </div>
          <div className="comments flex vertical horizontal">
          </div>
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
      <hr className="sep-line" style={{marginTop: '150px'}}/>
        
      <div className="flex column" id='comments-container'>
        <div className="content-title" id='comment-line'>Comments</div>
        <div id="add-comment-box">
          <input type="text" id="comment-inp" placeholder='Add a comment'  onInput={(comment)=>{setCommentInput(comment.target.value)}}/>
          <i className="material-symbols-outlined" id='add-comment-btn' onClick={addComment} >add_box</i>
        </div>
       { !postComments ?  <div className="show-comments" onClick={fetchComments}>View Comments</div> : null}
      </div> 
    </div>
  )
}


export default PostPage
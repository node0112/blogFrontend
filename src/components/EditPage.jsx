import React, { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'; //using cloud editor
import parse from 'html-react-parser';
import '@tinymce/tinymce-react'

import "./css/editpage.css"
import postAPI from './postAPI';
import { refreshAcessToken } from './authAPI';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

function Editpage({setPostID,postId, draftMode}) {
  
  const navigate = useNavigate()

  const [editorValue, setEditorValue] = useState("<h2>Start Typing Your Post Here</h2>")

  let [postBgColor,setpostBgColor] = useState("#215F99")
  let [postTextColor,setPostTextColor] = useState("#FC4F00")
  let [postContent,setPostContent] = useState("")
  let [summary, setPostSummary] = useState('')
  let [postTitle,setPostTitle] = useState("")
  const [postDraft, setPostDraft] = useState(true)
  let [author,setAuthor] = useState("")
  const [loading,setLoading] = useState(true)

  useEffect(()=>{ //sets author when edipage loads up 
    let LSauthor = localStorage.getItem('username')
    setAuthor(LSauthor)
    if(!LSauthor){
      console.log(LSauthor)
      localStorage.clear()
      navigate('/account')
      location.reload()
    }
  },[])

  useEffect(() => {
    if(draftMode){            //if page is navigated to when draft mode is true, fetch post
      setLoading(true)        // and set it as text in the editor, also update all variables
      setEditorValue("<h3>Fetching Post...</h3>") //fallback incase loading screen doesn't appear
      postAPI.get('/post/'+postId).then(res =>{
      setLoading(false)
      console.log(draftMode)  
      const post = res.data.post

      const title = post.title
      setPostTitle(title)
      let titleInput = document.querySelector('.title-input')  //set title in input field that is disabled
      titleInput.value = title
      titleInput.disabled = "disabled"

      const bgColor = post.backgroundColor
      const txtColor = post.textColor
      changePrevBg(bgColor)
      changePrevText(txtColor)

      setpostBgColor(bgColor)
      setPostTextColor(txtColor)

      const isPostDraft = post.draft
      setPostDraft(isPostDraft)
      document.querySelector('#draft').checked = isPostDraft

      //const userID = localStorage.getItem(userID)
      const postUserID = post.user
      //if user is indeed the author of the post then
      let content = post.content
      setPostContent(content) //unparsed content
      content = parse(post.content)
      setEditorValue(content)
      setPostSummary(post.summary)
    }).catch(err=>{
      setLoading(false)
      console.log(err)
    })
     

    }
    
  }, [])
  




  function changePrevText(color){
    setPostTextColor(color)
    document.querySelector(".text-color-selected").classList.remove("text-color-selected")
    document.getElementById(color).classList.add("text-color-selected")
  }
  function changePrevBg(color){
    setpostBgColor(color)
    document.querySelector(".bg-color-selected").classList.remove("bg-color-selected")
    document.getElementById(color).classList.add("bg-color-selected")
  }

  async function postForm(){
    let userid = localStorage.getItem('userID')
    let date = new Date()
    date = date.toISOString()

    let errors = await checkErrors()
    console.log(errors)
    //check errors
    if(errors){console.log('joe'); return} //return //exit function as errors are rendered externally
    let postJSON = {
      title: postTitle,
      user: userid,
      author,
      date: date,
      likes: 0,
      content: postContent,
      summary,
      draft: postDraft,
      backgroundColor: postBgColor,
      textColor: postTextColor
    }
    setLoading(true)
    //if draft mode is false
    if(!draftMode){  postAPI.post('/post/'+userid+'/post', postJSON).then(async newPost => {
        setLoading(false)
        let data = newPost.data
        console.log(data)
        if(data.errors){
          if(data.errors[0] === 'jwt expired'){
            refreshAcessToken() //get new access token
          }
          else{
            console.log(data.errors)
          }
        }
        let newPostID = data.postId
        setPostID(newPostID)
        navigate('/post')
        //navigate to new page
      }).catch(err =>{
        setLoading(false)
        console.log(err)
      })
   }
   else if(draftMode){
    //update post
    postJSON = { //only update selected fields as the others aren't allowed to be update
      content : postContent,
      backgroundColor: postBgColor,
      textColor: postTextColor,
      summary,
      draft: postDraft,
      date
    }
    postAPI.post('post/'+postId+'/edit',postJSON).then(res =>{
      setLoading(false)
      const data = res.data
      if(data.errors){
        renderErrors(data.errors)
      }
      let post = res.data.post
      setPostID(post._id)
      navigate('/post')
    }).catch(err =>{
      setLoading(false)
      console.log(err.message)
    })
   }
  }

  async function checkErrors(){
    let errors = []
    //check for errors locally
    if(postTitle.length < 5){
      errors.push("Please enter a title")
    }
    if(postContent.length < 10){
      errors.push("Please write a post")
    }
    if(errors.length > 0){
      console.log(errors)
      renderErrors(errors)
      return true
    }
    console.log(errors)
    return false
  }

  function renderErrors(errors){ //shows the errors passed onto it in the dom
    setLoading(false)
    errors.forEach(error =>{
      let divError = document.createElement('li')
      divError.classList.add("post-error")
      divError.textContent = error
      const errorsContainer = document.querySelector(".post-errors-container")
      errorsContainer.appendChild(divError) //render error in document
      divError.style.opacity = 1

      setTimeout(() => {
        divError.style.opacity = 0
      }, 2000);

      setTimeout(() => {
        errorsContainer.removeChild(errorsContainer.firstElementChild) //remove errors after a while 
      }, 4000);
    })
  }


  return (
    <div className="edit">
      <Loading loading={loading} />
        <div className='content-title' style={{marginTop: "60px"}}>Create A Post</div>
        <div className="edit-container flex" style={{marginLeft: "7px", marginBottom: "100px",  gap: '50px'}}>
          <div className="options-container" style={{marginTop: '45px'}}>
            <div className="flex column" id='title-editor'>
              <div className="small-heading">Post Title</div>
              <input type="text" className="title-input" onChange={e=>{setPostTitle(e.target.value)}} />
            </div>
            <div className="flex " id='color-picker'>
              <div className="color-picker flex column" id='post-bg-color'>
                <div className="small-heading" style={{marginBottom: "15px"}}>Post Preview Color</div>
                <div className="color-options"> 
                  <div className="color-circle " id="#111111" onClick={()=>{changePrevBg("#111111")}} style={{backgroundColor: "#111111"}}></div>
                  <div className="color-circle" id="#E14F4F" onClick={()=>{changePrevBg("#E14F4F")}} style={{backgroundColor: "#E14F4F"}} />
                  <div className="color-circle bg-color-selected" id="#215F99" onClick={()=>{changePrevBg("#215F99")}} style={{backgroundColor: "#215F99"}} />
                  <div className="color-circle" id="#C280F5" onClick={()=>{changePrevBg("#C280F5")}} style={{backgroundColor: "#C280F5"}} />
                  <div className="color-circle" id="#46C2CB" onClick={()=>{changePrevBg("#46C2CB")}} style={{backgroundColor: "#46C2CB"}} />
                  <div className="color-circle" id="#8B1874" onClick={()=>{changePrevBg("#8B1874")}} style={{backgroundColor: "#8B1874"}} />
                  <div className="color-circle" id="#44B57F" onClick={()=>{changePrevBg("#44B57F")}} style={{backgroundColor: "#44B57F"}} />
                </div>
              </div>
              <div className="color-picker flex column" id='post-text-color'>
                <div className="small-heading" style={{marginBottom: "15px"}}>Post Text Color</div>
                <div className="color-options"> 
                  <div className="color-circle " id="#FFFFFF" onClick={()=>{changePrevText("#FFFFFF")}} style={{backgroundColor: "#FFFFFF"}}></div>
                  <div className="color-circle" id="#7E7E7E" onClick={()=>{changePrevText("#7E7E7E")}} style={{backgroundColor: "#7E7E7E"}} />
                  <div className="color-circle" id="#BBC7CE" onClick={()=>{changePrevText("#BBC7CE")}} style={{backgroundColor: "#BBC7CE"}} />
                  <div className="color-circle" id="#EC9F9F" onClick={()=>{changePrevText("#EC9F9F")}} style={{backgroundColor: "#EC9F9F"}} />
                  <div className="color-circle" id="#8F2B2B" onClick={()=>{changePrevText("#8F2B2B")}} style={{backgroundColor: "#8F2B2B"}} />
                  <div className="color-circle" id="#4DB1D0" onClick={()=>{changePrevText("#4DB1D0")}} style={{backgroundColor: "#4DB1D0"}} />
                  <div className="color-circle text-color-selected" id="#FC4F00" onClick={()=>{changePrevText("#FC4F00")}} style={{backgroundColor: "#FC4F00"}} />
                </div>
              </div>
            </div>
          </div>
          <div className="post flex column" id='post-preview' style={{backgroundColor: postBgColor}}>
              <div className="post-top-container">
                <div className="post-title">
                  <span className='preview-text' style={{width: '100%', height: "25px", display: "block", backgroundColor: postTextColor}} />
                  <span className='preview-text' style={{width: '50%', height: "25px", display: "block", backgroundColor: postTextColor, marginTop: '5px', marginBottom: '10px'}}></span>
                </div>
                <span className='preview-text' style={{width: '30%', height: "18px", display: "block", backgroundColor: postTextColor, marginBottom: '10px'}} />
                <span style={{width: '100%', height: "5px", display: "block", backgroundColor: postTextColor, marginBottom: "35px"}} />
                <span className='preview-text' style={{width: '100%', height: "18px", display: "block", backgroundColor: postTextColor, marginBottom: '5px'}} />
                <span className='preview-text' style={{width: '100%', height: "18px", display: "block", backgroundColor: postTextColor, marginBottom: '5px'}} />
                <span className='preview-text' style={{width: '70%', height: "18px", display: "block", backgroundColor: postTextColor, marginBottom: '5px'}} />
                <span className='preview-text' style={{width: '90%', height: "18px", display: "block", backgroundColor: postTextColor, marginBottom: '5px'}} />
                
              </div>
              <div className="post-bottom-container flex between">
                <div className='post-date'>XX/XX/XXX</div>
                <div className="post-stats flex">
                  <div className="post-like">XX</div>
                  <div className="post-comments">X</div>
                </div>
              </div>
            </div>
          <div className="info-container">

          </div>
        </div>
        <Editor //tinymce cloud editor
          id='editor'
          apiKey = '1f17x63gnuprnfm348hzhqwrl8zb92kkuq49wkpealoey6ac'
          onInit={()=>{if(!draftMode)setLoading(false)}}
          initialValue= {editorValue}
          onEditorChange={(editorValue, editor)=>{
            setPostContent(editorValue) //set html value to post contnet
            let postSummary = editor.getContent({format: 'text'})
            postSummary = postSummary.substring(0,180)
            setPostSummary(postSummary) //save content as text for preview on homepage
          }}
          init={{
            height: 600,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px }'
        }} />
        <div className="flex vertical " style={{width: 'max-content', height: 'max-content', gap: '10px',marginTop: '25px'}}>
          <label htmlFor="draft" style={{fontSize: '25px'}}>Draft</label>
          <input id='draft' type='checkbox' defaultChecked="true" onChange={e=>{ e.target.checked ? setPostDraft(true) : setPostDraft(false)}} value={'draft'} />
          <button className='button cursor' id='submit-post' style={{backgroundColor: postBgColor, color: postTextColor,marginLeft: '25px'}} onClick={postForm}>Submit Post</button>
        </div>
        <ul className="post-errors-container flex column center" />
    </div>
  )
}

export default Editpage
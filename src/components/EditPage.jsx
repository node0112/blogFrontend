import React, { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'; //using cloud editor
import '@tinymce/tinymce-react'

import "./css/editpage.css"
import postAPI from './postAPI';
import { refreshAcessToken } from './authAPI';
import Loading from './Loading';

function Editpage() {
  
  
  let [postBgColor,setpostBgColor] = useState("#215F99")
  let [postTextColor,setPostTextColor] = useState("#FC4F00")
  let [postContent,setPostContent] = useState("")
  let [postTitle,setPostTitle] = useState("")
  let [author,setAuthor] = useState("")
  let [draftMode,setDraftMode] = useState(false)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    let LSauthor = localStorage.getItem('username')
    setAuthor(LSauthor)
  })

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
    let postJSON = {
      title: postTitle,
      user: userid,
      author,
      date: date,
      likes: 0,
      content: postContent,
      draft: draftMode,
      backgroundColor: postBgColor,
      textColor: postTextColor
    }
    setLoading(true)
    postAPI.post('/post/'+userid+'/post', postJSON).then(async newPost => {
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
      let newPostLink = data.postId
      //navigate to new page
    }).catch(err =>{
      setLoading(false)
      console.log(err)
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
          apiKey = '1f17x63gnuprnfm348hzhqwrl8zb92kkuq49wkpealoey6ac'
          onInit={()=>{setLoading(false)}}
          initialValue="<p>Start Typing Your Post Here!</p>"
          onEditorChange={(editorValue)=>{setPostContent(editorValue)}}
          init={{
            height: 600,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:14px }'
        }} />
        <label htmlFor="draft">Draft</label>
        <input id='draft' type='checkbox' onChange={e=>{ e.target.checked ? setDraftMode(true) : setDraftMode(false)}} value={'draft'} />
        <button onClick={postForm}>Submit</button>
    </div>
  )
}

export default Editpage
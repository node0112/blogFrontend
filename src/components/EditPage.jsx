import React, { useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'; //using cloud editor

import "./css/editpage.css"

function Editpage() {


  useEffect(() => {
    console.log(import.meta.env.VITE_EDITOR_KEY+"  joe")
  }, [])

  return (
    <div className="edit">
        <div className='content-title' style={{marginTop: "60px",marginBottom: "45px"}}>Create A Post</div>
        <div className="edit-container flex" style={{marginLeft: "7px", marginBottom: "120px", gap: '50px'}}>
          <div className="options-container">
            <div className="flex column" id='title-editor'>
              <div className="small-heading">Post Title</div>
              <input type="text" className="title-input" />
            </div>
            <div className="flex " id='color-picker'>
              <div className="color-picker flex column" id='post-bg-color'>
                <div className="small-heading">Post Preview Color</div>
                <div className="color-options"> 
                  <div className="color-circle"></div> enter color as id
                  <div className="color-circle"></div>
                  <div className="color-circle"></div>
                  <div className="color-circle"></div>
                  <div className="color-circle"></div>
                </div>
              </div>
              <div className="color-picker flex column" id='post-text-color'>
                <div className="small-heading" style={{marginBottom: "15px"}}>Post Text Color</div>
                <div className="color-options"> 
                  <div className="color-circle" id="FFFFFF" style={{backgroundColor: "#FFFFFF"}}></div>
                  <div className="color-circle" id="" style={{backgroundColor: "#7E7E7E"}} />
                  <div className="color-circle" id="" style={{backgroundColor: "#BBC7CE"}} />
                  <div className="color-circle" id="" style={{backgroundColor: "#EC9F9F"}} />
                  <div className="color-circle" id="" style={{backgroundColor: "#8F2B2B"}} />
                  <div className="color-circle" id="" style={{backgroundColor: "#4DB1D0"}} />
                </div>
              </div>
            </div>
          </div>
          <div className="post-preview">
          <div className="post flex column">
              <div className="post-top-container">
                <div className="post-title">
                  <span className='preview-text' style={{width: '100%', height: "25px", display: "block", backgroundColor: "#BBC"}} />
                  <span className='preview-text' style={{width: '40%', height: "25px", display: "block", backgroundColor: "#BBC", marginTop: '5px'}}></span>
                </div>
                <span className='preview-text' style={{width: '30%', height: "14px", display: "block", backgroundColor: "#BBC"}} />
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
          <div className="info-container">

          </div>
        </div>
        <Editor //tinymce cloud editor
          apiKey = '1f17x63gnuprnfm348hzhqwrl8zb92kkuq49wkpealoey6ac'
          onInit={console}
          initialValue="<p>Start Typing Your Post Here!</p>"
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
    </div>
  )
}

export default Editpage
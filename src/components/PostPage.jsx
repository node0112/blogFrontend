import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import postAPI from './postAPI'
import { refreshAcessToken } from './postAPI';


function PostPage({postID}) {
  let navigate = useNavigate()

  const [parsedPost,setParsedPost] = useState('')
    useEffect(()=>{
        if(postID === '' ){
          navigate('/') //incase a user stumbles here bby accident
        }
        postAPI.get('/post/'+postID).then(resData=>{
          let data = resData.data
          console.log(data.post)
          let errors = []
          if(data.errors) errors = data.errors;
          if(errors.length > 0){ //refresh token if it has expired
            if(errors[0] === 'jwt expired'){
              refreshAcessToken()
            }
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },[])
  return (
    <div className='main-post'>
      {parsedPost}
    </div>
  )
}

export default PostPage
import React, { useEffect } from 'react'
import postAPI from './postAPI'

function Draft({draftPosts, insertPosts, setPostID}) {
    
    useEffect(()=>{
        insertPosts(draftPosts)
    },[draftPosts])
    return (
    <div id='draftPosts' className='flex column'>
        <div className='content-title'>Your Draft Posts</div>
        <div className="posts-container"></div>
    </div>
  )
}

export default Draft
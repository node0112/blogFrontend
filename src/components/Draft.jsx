import React, { useEffect, useState } from 'react'
import postAPI from './postAPI'
import { useNavigate } from 'react-router-dom'

function Draft({draftPosts, insertPosts, setPostID}) {

    const [postsStat, setPostStat] = useState('You Have No Saved Drafts')
    
    useEffect(()=>{
        if(draftPosts.length > 0){
            setPostStat('')
            insertPosts(draftPosts)
        }
    },[draftPosts])

    return (
    <div id='draftPosts' className='flex column'>
        <div className='content-title'>Your Draft Posts</div>
        <div className="posts-container" style={{width: '100%', height: '100%'}}>
        </div>
        <div className="draft-message" style={{margin : 'auto', height: '100%'}}>
                {postsStat}
            </div>
    </div>
  )
}



export default Draft
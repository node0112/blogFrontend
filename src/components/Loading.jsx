import React from 'react'
import './css/loading.css'
function Loading({loading}) {
  return (
    <div style={{width: "100%", height: "100%" , backgroundColor: "whitesmoke"}}>
      {loading ? 
      <div className='loading-container flex vertical horizontal'>
          <span className="loader"></span>
      </div> 
      : <div/>
      }
    </div>
  )
}

export default Loading
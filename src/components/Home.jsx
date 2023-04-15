import React, { useEffect } from 'react'
import './css/home.css'


function Home() {  

  return (
    <div className='home flex'>
      <div className="left-container">
        <div className='content-title'>Latest Posts</div>
        <div className='posts-container'>
            <div className="post"></div>
            <div className="post"></div>
            <div className="post"></div>
            <div className="post"></div>
            <div className="post"></div>
            <div className="post"></div>
        </div>
      </div>
      <div className="right-container flex column ">
        <div className="fact-container defont flex column">
            <div className="fact-title">Daily Fact</div>
            <div className="fact-text">It takes 8 minutes for the light of the sun to reach Earth</div>
        </div>
        <div className="stat-container defont"> 
            <div className="stats flex">
              <div className="stat-name">Likes Received: </div>
              <div className="stat-value">0</div>
            </div>
            <div className="stats flex">
              <div className="stat-name">Comments: </div>
              <div className="stat-value">0</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home
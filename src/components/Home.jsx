import React, { useEffect } from 'react'
import './css/home.css'
import postAPI from './postAPI'

function Home({posts,insertPosts, fact, setFact}) {  
  
  useEffect(() => {
    insertPosts(posts)
  }, [posts])
  
  useEffect(()=>{
    getFact()
  },[])

  async function getFact(){
    let data = await postAPI.get('/fact')
    let fact = data.data.fact
    setFact(fact)
  }

  return (
    <div className='home flex'>
      <div className="left-container">
        <div className='content-title'>Latest Posts</div>
        <div className='posts-container'>
        </div>
      </div>
      <div className="right-container flex column ">
        <div className="fact-container defont flex column">
            <div className="fact-title flex vertical">Daily Fact<div className="material-icons cursor" style={{'marginLeft': '5px', 'fontSize' : '30px'}}>psychology</div></div>
            <div className="fact-text">{fact}</div>
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
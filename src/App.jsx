import { useState } from 'react'
import './App.css'
import './reset.css'
import Header from './components/Header'
import Home from './components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div className='logo-bar'>ITYPE</div>
      <div className='content-container flex column'>
        <Header />
       <Home />
      </div>
    </div>
  )
}

export default App

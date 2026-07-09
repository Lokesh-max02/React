import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'

const App = () => {
  return (
    <>
   
    <Routes>
      <Route path='/' element={<Home/>}/>
       <Route path='/about' element={<About/>}/>
        <Route path='/Contact' element={<Contact/>}/>
         <Route path='/Login' element={<Login/>}/>
    </Routes>

    </>
  )
}

export default App
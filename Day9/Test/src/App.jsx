import React from 'react'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Studentcard from './components/Studentcard'
import Employee from './components/Employee'
import Navbar from './components/Navbar'
import Parent from './components/Parent'

const App = () => {
  return (
    <>
    <Navbar/>
     <Routes>
          <Route path="/" element={<Studentcard/>}/>
          <Route path="/Employee" element={<Employee/>}/>
        </Routes>
    <Parent/>
    <Home/>
    </>
  )
}

export default App
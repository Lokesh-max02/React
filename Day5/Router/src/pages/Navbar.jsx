import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
   <>
   <div className='bg-amber-100 p-3 flex  justify-between'>
    <div className='bg-white p-4'>
       <p>image</p>
    </div>
    <div className=' p-3 flex gap-6'>
     <Link to="/Home">Home</Link>
    <Link to="/About">About</Link>
    <Link to="/Contact">Contact</Link>
    <Link to="/Login">Login</Link>
   </div>
   </div>
   </>
  )
}

export default Navbar
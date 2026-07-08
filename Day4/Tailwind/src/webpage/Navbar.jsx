import React from 'react'
import logo from "../assets/WTC.png"
const Navbar = () => {
  return (
    <>
    <div className='bg-black text-amber-50 flex justify-between align-center p-5 '>
        <div className='bg-white p-2 text-black rounded-2xl '>
            <img src={logo} alt="" width={250}/>
        </div>
       
        <div className='flex gap-5 text-xl'>
            <a href="#">Events</a>
             <a href="#">Facilities</a>
              <a href="#">Service</a>
               <a href="#">Lifestyle</a>
                <a href="#">About Us</a>
                 <a href="#">Contact</a>
        </div>
        </div>
   
    </>
  )
}

export default Navbar
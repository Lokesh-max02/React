import React from 'react'
import banner from "../assets/banner1.jpg"

const Banner = () => {
  return (
   <>
   <div className='flex bg-amber-800'>
   <div>
    <img src={banner} alt="" />
   </div>
   <div className='bg-brown-500 p-5 text-white flex flex-col gap-5'>
    <h1>Form</h1>
    <input type="text" placeholder='Enter Email' />
    <input type="number" placeholder='Enter Mobile No' />
    <button>Summit</button>
   </div>
   </div>
   </>
  )
}

export default Banner
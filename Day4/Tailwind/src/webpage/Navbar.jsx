import React from 'react'

const Navbar = () => {
  return (
    <>
    <div className='bg-black text-amber-50 flex justify-between align-center p-5 '>
        <div className='bg-white p-2 text-black rounded-2xl '>
            image
        </div>
       
        <div className='flex gap-3'>
            <a href="#">Home</a>
             <a href="#">About</a>
              <a href="#">Signin</a>
               <a href="#">Help</a>
        </div>
        </div>
   
    </>
  )
}

export default Navbar
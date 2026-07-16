import React, { useState } from 'react'
import Arrays from './Arrays'

const Colors = () => {
    const [color,setColor]=useState(!true)
  return (
    <>
    <Arrays/>
    <div className={color?'bg-amber-400 w-screen h-screen':'bg-amber-50 w-screen h-screen'}>
       <button className='bg-black p-4 text-white ' onClick={()=>setColor(true) }>Click</button>
       
    </div>
     
    
    </>
  )
}

export default Colors
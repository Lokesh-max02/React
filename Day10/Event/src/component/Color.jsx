import React, { useState } from 'react'

const Color = () => {

    const [color,setColor]=useState(true)
  return (
   <>
   <div >
    <h1>Task-4</h1>
    <div className={color ? "bg-white w-screen h-screen" : "bg-black  w-screen h-screen"}>
        <button onClick={() => setColor(!color)}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg">click</button>
    </div>
   </div>
   
   </>
  )
}

export default Color
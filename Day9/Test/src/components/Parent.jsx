import React from 'react'

const Parent = () => {
    const click=()=>{
      alert("Button is click")
    }
 
  return (
    <>
    <button className='bg-red-600 w-30 p-4' onClick={click}>click</button>
    </>
  )
}

export default Parent


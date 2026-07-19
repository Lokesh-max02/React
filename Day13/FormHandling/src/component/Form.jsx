import React, { useState } from 'react'

const Form = () => {
    const[data,setData]=useState("")
    const [click,setClick]=useState("")

    const storeData=(e)=>{
      setData(e.target.value)
    }
    const changeClick=()=>{
        
    }
  return (
   <>
  <input type="text" value={data}   onChange={storeData} placeholder='Enter a Name' />

   <h1>{data}</h1>
   <button onClick={changeClick}>Click</button>
   </>
  )
}

export default Form
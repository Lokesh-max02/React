import React, { useState } from 'react'

const Arrays = () => {
    const [arr,setArr]=useState([1,2,3,4,5,6])
    const [obj ,setObj]=useState({name:"Lokesh",age:21,location:"Chennai"})
    
    
    const changeData=()=>{
        setArr([...arr,100])  
    }
    const changeobj=()=>{
      setObj()
    }
    
  return (
    <>
    <div>
       {arr.map((e,i)=>(
          <h1>{e}</h1>
        ))}
        <button onClick={changeData}>Click</button>
    </div>
    
    </>
  )
}

export default Arrays
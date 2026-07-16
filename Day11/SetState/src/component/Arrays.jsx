import React, { useState } from 'react'

const Arrays = () => {
    const [arr,setArr]=useState([1,2,3,4,5,6])
    const [obj ,setObj]=useState({name:"Lokesh",age:21,location:"Chennai"})
    
    
    const changeData=()=>{
        setArr([...arr,100])  
    }
    const changeobj=()=>{
      setObj({...obj,salary:20000})
    }
    
  return (
    <>
    <div>
        <h1>{arr.map((e,i)=>(
          <h1>{e}</h1>
        ))}</h1>
        <button onClick={changeData}>Click</button>
    </div>
    <div>
      <h1>{obj.map((e)=>(
        <h1>{e}</h1>
      ))}</h1>
      <button onClick={changeobj}>Change obj</button>
    </div>
    </>
  )
}

export default Arrays
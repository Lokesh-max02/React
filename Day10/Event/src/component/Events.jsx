import React, { useState } from 'react'

const Events = () => {
  //task2
const [set,setSet]=useState("Rahul")
//task3
const[color,setColor]=useState("Javascript")
    const click=()=>{
       setSet("React Developer")
    }
  return (
    <>
    <div>
      <h1>Task-2</h1>
      <h1>{set}</h1>
       <button   className="bg-amber-400 text-white p-1 mb-4" onClick={click}>Change</button>
    </div>
    <div>
      <h1>Task-5</h1>
     <h1>{color}</h1>
      <button   className="bg-pink-500 text-white p-1 mb-4" onClick={()=>setColor("React JS")}>Update course</button>
    </div>
    </>
  )
}

export default Events
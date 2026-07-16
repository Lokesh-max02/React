import React, { useState } from 'react'

const Array_obj = () => {
    const [arr,setArr]=useState([
        {id:1,name:"Lokesh"},{id:2,name:"Rahul"}
    ])
     
    const [pro,setPro]=useState([{id:1,name:"Mobile"},
        {id:2,name:"Laptop"}
    ])

    const [emp,setEmp]=useState([{id:1,name:"Arun"},
        {id:2,name:"kumar"}
    ])

    const changeArr=()=>{
        setArr(arr.map((e)=>e.id===2?{...e,name:"vijay"}:e))
    }

    const changeProduct=()=>{
        setPro(pro.map((product)=>product.id===2?{...product,name:"Tablet"}:product))
    }
  return (
   <>
     <div>
        <h1>Task 5</h1>
        {arr.map((e) => (
          <h2 key={e.id}>
            {e.id} - {e.name}
          </h2>
        ))}

        <button className='bg-green-300 text-black p-1 mb-3' onClick={changeArr}>Update Student</button>
      </div>

      <div>
        <h1>Task 6</h1>
        {pro.map((r)=>(
            <h1>{r.id}-{r.name}</h1>
        ))}
         <button className='bg-gray-500 text-white p-1 mb-3' onClick={changeProduct}>Update product</button>
      </div>
   </>
  )
}

export default Array_obj
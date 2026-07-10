import React from 'react'
let arr=[{id:1,name:"rahul",course:"FS Java"},
    {id:2,name:"Gokul",course:"FS Python"},
    {id:3,name:"John",course:"FS Mern"}
]

const Array_object = () => {
  return (
   <>
   <div>
    <h1>{arr.map((e,i)=>(
      <div className='bg-amber-300 p-3 flex '>
        <div className='bg-amber-50 p-4 '>
        <h2>{e.id}</h2>
      <h2>{e.name}</h2>
      <h2>{e.course}</h2>
      
       </div>
      </div>

    ))}</h1>
   </div>
   </>
  )
}

export default Array_object
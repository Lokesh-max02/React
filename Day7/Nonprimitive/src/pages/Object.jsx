import React from 'react'
  
let object={name:"Lokesh",course:"FS Java",Experience:5}

const Object = () => {
  return (
    <>
     <div className='bg-red-500 p-4 h-30 w-40 flex justify-center '>
      <div>
        <p>Name: {object.name}</p>
        <p>Course : {object.course}</p>
        <p>Experience : {object.Experience}</p>
     </div>
     </div>
    </>
  )
}

export default Object
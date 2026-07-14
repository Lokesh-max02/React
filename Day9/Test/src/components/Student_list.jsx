import React from 'react'

const Student_list = (g) => {
    const{list}=g
    console.log(list);
    
  return (
    <>
    <div >
        <h1>{list.map((e)=>(
            <div className='bg-amber-800 p-3 justify-center gap-3'>
            <div className='bg-amber-50 w-40 h-40   '>
                 <h1>{e.id}</h1>
                  <h1>{e.name}</h1>
                   <h1>{e.course}</h1>
                   </div>
            </div>
        ))}</h1>
    </div>
    </>
  )
}

export default Student_list
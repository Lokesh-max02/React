import React from 'react'

const Contact = () => {
  return (
   <>
   <div className='bg-amber-200 p-4'>
    <h1 className='text-4xl p-4'>Contact</h1>
    <div>
      <label htmlFor="">Enter a Name:</label>
      <input className='bg-amber-50 p-1' type="text" placeholder='Enter a Name' />
      <br/>
      <br/>
      <label htmlFor="">Enter a Email:</label>
      <input  className='bg-amber-50 p-1' type="text" placeholder='Enter a Email' />
      <br/>
      <br/>
      <label htmlFor="">Enter a Phone No:</label>
      <input  className='bg-amber-50 p-1' type="text" placeholder='Enter a Phone No' />
    <br/>
    <br/>
    <label htmlFor="">Enter a Message:</label>
      <br/>
      < textarea  className='bg-amber-50 p-1' type="text" placeholder='Enter a Message' />
    <br/>
    <button className='bg-red-600 p-2'>summit</button>
    </div>
   </div>
   </>
  )
}

export default Contact
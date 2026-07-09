import React from 'react'

const Login = () => {
  return (
    <>
    <div className='bg-red-600 text-black p-5 '>
        <h1>Login</h1>
         <br/>
        <label >Enter a Email:</label>        
        <input className='bg-amber-50' type="text" placeholder='Enter a Emailid' />
         <br/>
          <br/>
        <label >Enter a Password:</label>
        <input className='bg-amber-50' type="password" placeholder='Enter a password'/>
         <br/>
          <br/>
        <button className='bg-amber-50 p-2 rounded-2xl'>signin</button>
    </div>
    </>
  )
}

export default Login
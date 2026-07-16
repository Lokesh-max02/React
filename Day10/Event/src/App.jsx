import React from 'react'
import Events from './component/Events'
import Setstate from './component/Setstate'
import Color from './component/Color'

const App = () => {
  return (
    <>
    <div className='p-10'>
      <h1  className='text-4xl '>Day 10-Task</h1>
    <Events/>
    <Setstate/>
    <Color/>
    </div>
     
    </>
  )
}

export default App
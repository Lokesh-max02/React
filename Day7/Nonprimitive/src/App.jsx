import React from 'react'
import Tasks from './pages/Array'
import Object from './pages/Object'
import Array_object from './pages/Array_object'
import { getLocation } from './pages/Object'
const App = () => {
  return (
   <>
   <Tasks/>
   <Object/>
   <Array_object/>
  {getLocation()}
   </>
  )
}

export default App
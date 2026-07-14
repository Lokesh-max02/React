import React from 'react'
import Parent from './Parent'

const Studentcard = ({names,ages,courses}) => {
  return (
    <>
    <div>
      <h1>Name : {names}</h1>
      <h1>Age : {ages}</h1>
      <h1>course : {courses}</h1>
    </div>
   
    </>
  )
}

export default Studentcard
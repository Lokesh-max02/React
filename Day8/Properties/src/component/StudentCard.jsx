import React from 'react'

const StudentCard = ({name,age,course,isplaced}) => {
  return (
    <>
    <div>
        <h1>Name:{name}</h1>
        <h1>Age:{age}</h1>
        <h1>Course:{course}</h1>
        <h1>isPlaced:{isplaced?"Placed":"Not Placed"}</h1>
    </div>
    </>
  )
}

export default StudentCard
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

     {/* task10 */}
     <div>

     </div>
    </>
  )
}

export default Object


let companyName="Zoho"
let totalEmp=50
let isHiring=true
let CEO={name:"sridhar vembu",age:56,location:"chennai" }
const Dept=["IT","HR","Marketing","Service","Sales"]
const Empl=[{name:"Rahul",Dept:"IT",age:26},
  {name:"Gokul",Dept:"HR",age:29},
  {name:"Michal",Dept:"IT",age:36}
]
export const getLocation = () => {
  return (
    <>
  <div>
    <h1>Company details:</h1>
    <h1>company name: {companyName}</h1>
    <h1>Number of Employees: {totalEmp}</h1>
    <h1>Active Hiring: {isHiring?"Hiring":"Not Hiring"}</h1>
  </div>
  <div>
    <h1>CEO Details:</h1>
    <h1>Name:{CEO.name}</h1>
     <h1>Age:{CEO.age}</h1>
      <h1>Location:{CEO.location}</h1>
  </div>

  <div>
    <h1>Department:</h1>
    <h2>{Dept.map((e,i)=>(
      <h1>{e}</h1>
    ))}</h2>
  </div>
  <div>
  <h2>Employees Detail:</h2>
  <div>
    <h1>{Empl.map((e,i)=>(
      <div>
        <h1>Name:{e.name}</h1>
        <h1>Department:{e.Dept}</h1>
        <h1>Age:{e.age}</h1>
      </div>
    ))}</h1>
  </div>
  </div>
    </>
  )
}
